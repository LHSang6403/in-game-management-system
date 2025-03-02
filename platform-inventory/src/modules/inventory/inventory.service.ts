import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RedisService } from '../redis/redis.service';
import { CacheKey } from 'src/constants/cache-key.constant';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { RABBITMQ_QUEUES } from 'src/constants/rabbitmq.constant';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    private prisma: PrismaClient,
    private redisService: RedisService,
    private rabbitMQService: RabbitMQService,
  ) {}

  async create(
    userId: number,
    itemId: number,
    quantity: number,
    json?: string,
  ) {
    if (quantity < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    const inv = await this.prisma.inventory.create({
      data: {
        userId,
        itemId,
        quantity,
        json: json ? JSON.parse(json) : undefined,
      },
    });

    await this.redisService.removeKey(CacheKey.INVENTORY.LIST);

    const transaction = {
      userId,
      itemId,
      oldQty: 0,
      newQty: quantity,
      changeQty: quantity,
      reason: 'Created new inventory entry',
      status: 'CREATED',
      timestamp: new Date(),
    };
    await this.rabbitMQService.publishToQueue(
      RABBITMQ_QUEUES.ADD_TRANSACTION,
      transaction,
    );

    this.logger.log(
      `Created inventory for Item ${itemId} with Quantity: ${quantity}`,
    );
    return inv;
  }

  async findAll() {
    const cached = await this.redisService.getValue(CacheKey.INVENTORY.LIST);
    if (cached) {
      return JSON.parse(cached);
    }

    const list = await this.prisma.inventory.findMany({
      where: { isDeleted: false },
    });
    await this.redisService.setValue(
      CacheKey.INVENTORY.LIST,
      JSON.stringify(list),
    );

    return list;
  }

  async findOne(id: number) {
    const cacheKey = CacheKey.INVENTORY.BY_ID(id);
    const cached = await this.redisService.getValue(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    const inv = await this.prisma.inventory.findUnique({
      where: { id, isDeleted: false },
    });
    if (inv) {
      await this.redisService.setValue(cacheKey, JSON.stringify(inv));
    }

    return inv;
  }

  async updateQuantityTransaction(
    id: number,
    change: number,
    userId: number,
    reason: string,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const inv = await prisma.inventory.findUnique({
        where: { id, isDeleted: false },
      });
      if (!inv) throw new BadRequestException('Inventory not found');

      const newQty = inv.quantity + change;
      if (newQty < 0) {
        this.logger.warn(
          `Inventory update failed for item ${id}: Negative balance`,
        );

        const failedTransaction = {
          userId,
          itemId: inv.itemId,
          oldQty: inv.quantity,
          newQty: inv.quantity,
          changeQty: change,
          reason: `${reason} (Rollback due to negative balance)`,
          status: 'FAILED',
          timestamp: new Date(),
        };

        await this.rabbitMQService.publishToQueue(
          RABBITMQ_QUEUES.ADD_TRANSACTION,
          failedTransaction,
        );
        throw new BadRequestException('Quantity cannot be negative');
      }

      const updated = await prisma.inventory.update({
        where: { id },
        data: { quantity: newQty },
      });

      await this.redisService.removeKey(CacheKey.INVENTORY.LIST);
      await this.redisService.removeKey(CacheKey.INVENTORY.BY_ID(id));

      // Log success transaction
      const transaction = {
        userId,
        itemId: inv.itemId,
        oldQty: inv.quantity,
        newQty,
        changeQty: change,
        reason,
        status: 'SUCCESS',
        timestamp: new Date(),
      };
      await this.rabbitMQService.publishToQueue(
        RABBITMQ_QUEUES.ADD_TRANSACTION,
        transaction,
      );

      this.logger.log(`Inventory updated: Item ${id}, New Qty: ${newQty}`);

      return updated;
    });
  }

  async remove(id: number, userId: number, reason: string) {
    return this.prisma.$transaction(async (prisma) => {
      const inv = await prisma.inventory.findUnique({ where: { id } });
      if (!inv) throw new BadRequestException('Inventory not found');

      await prisma.inventory.update({
        where: { id },
        data: { isDeleted: true },
      });

      await this.redisService.removeKey(CacheKey.INVENTORY.LIST);
      await this.redisService.removeKey(CacheKey.INVENTORY.BY_ID(id));

      // Log DELETE transaction
      const transaction = {
        userId,
        itemId: inv.itemId,
        oldQty: inv.quantity,
        newQty: 0,
        changeQty: -inv.quantity,
        reason,
        status: 'DELETED',
        timestamp: new Date(),
      };
      await this.rabbitMQService.publishToQueue(
        RABBITMQ_QUEUES.ADD_TRANSACTION,
        transaction,
      );

      this.logger.log(`Inventory deleted: Item ${id}`);
    });
  }
}

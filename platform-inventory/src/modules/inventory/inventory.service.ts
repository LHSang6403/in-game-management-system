import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RedisService } from '../redis/redis.service';
import { CacheKey } from 'src/constants/cache-key.constant';

@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaClient,
    private redisService: RedisService,
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

    return inv;
  }

  async findAll() {
    const cached = await this.redisService.getValue(CacheKey.INVENTORY.LIST);
    if (cached) {
      return JSON.parse(cached);
    }

    const list = await this.prisma.inventory.findMany();
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
    const inv = await this.prisma.inventory.findUnique({ where: { id } });
    if (inv) {
      await this.redisService.setValue(cacheKey, JSON.stringify(inv));
    }

    return inv;
  }

  async updateQuantity(id: number, change: number) {
    const inv = await this.prisma.inventory.findUnique({ where: { id } });
    if (!inv) throw new BadRequestException('Inventory not found');

    const newQty = inv.quantity + change;
    if (newQty < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    const updated = await this.prisma.inventory.update({
      where: { id },
      data: { quantity: newQty },
    });
    await this.redisService.removeKey(CacheKey.INVENTORY.LIST);
    await this.redisService.removeKey(CacheKey.INVENTORY.BY_ID(id));

    return updated;
  }

  async remove(id: number) {
    const inv = await this.prisma.inventory.delete({ where: { id } });
    await this.redisService.removeKey(CacheKey.INVENTORY.LIST);
    await this.redisService.removeKey(CacheKey.INVENTORY.BY_ID(id));

    return inv;
  }
}

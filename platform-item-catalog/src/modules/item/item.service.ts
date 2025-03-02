import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateItemInput } from '@modules/item/dto/create-item.input';
import { UpdateItemInput } from '@modules/item/dto/update-item.input';
import { RedisService } from '@modules/redis/redis.service';
import { CacheKey } from '@constants/cache-key.constant';

@Injectable()
export class ItemService {
  logger = new Logger(ItemService.name);

  constructor(
    private prisma: PrismaClient,
    private redisService: RedisService,
  ) {}

  async create(data: CreateItemInput) {
    const type = await this.prisma.itemType.findUnique({
      where: { id: data.itemTypeId },
    });
    if (!type) {
      throw new BadRequestException('ItemType does not exist');
    }

    const item = await this.prisma.item.create({
      data: {
        name: data.name,
        rarity: data.rarity,
        power: data.power,
        imageUrl: data.imageUrl,
        itemTypeId: data.itemTypeId,
      },
    });

    await this.redisService.removeByPattern(CacheKey.ITEMS.ALL);

    const itemKey = CacheKey.ITEMS.BY_ID(item.id);
    await this.redisService.setValue(itemKey, JSON.stringify(item));

    this.logger.log(`Item created: ${item.name}`);

    return item;
  }

  async findAll() {
    const listKey = CacheKey.ITEMS.LIST;

    const cached = await this.redisService.getValue(listKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const items = await this.prisma.item.findMany({
      where: { isDeleted: false },
      include: { itemType: true },
    });

    await this.redisService.setValue(listKey, JSON.stringify(items));

    return items;
  }

  async findOne(id: number) {
    const itemKey = CacheKey.ITEMS.BY_ID(id);

    const cached = await this.redisService.getValue(itemKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const item = await this.prisma.item.findUnique({
      where: { id, isDeleted: false },
      include: { itemType: true },
    });

    if (item) {
      await this.redisService.setValue(itemKey, JSON.stringify(item));
    }

    return item;
  }

  async update(data: UpdateItemInput) {
    const oldItem = await this.prisma.item.findUnique({
      where: { id: data.id },
    });
    if (!oldItem) {
      throw new BadRequestException('Item not found');
    }

    if (data.itemTypeId && data.itemTypeId !== oldItem.itemTypeId) {
      const newType = await this.prisma.itemType.findUnique({
        where: { id: data.itemTypeId },
      });
      if (!newType) {
        throw new BadRequestException('New ItemType does not exist');
      }
    }

    const updated = await this.prisma.item.update({
      where: { id: data.id },
      data: {
        name: data.name ?? oldItem.name,
        rarity: data.rarity ?? oldItem.rarity,
        power: data.power ?? oldItem.power,
        imageUrl: data.imageUrl ?? oldItem.imageUrl,
        itemTypeId: data.itemTypeId ?? oldItem.itemTypeId,
      },
      include: { itemType: true },
    });

    await this.redisService.removeByPattern(CacheKey.ITEMS.ALL);

    const itemKey = CacheKey.ITEMS.BY_ID(data.id);
    await this.redisService.setValue(itemKey, JSON.stringify(updated));

    this.logger.log(`Item updated: ${updated.name}`);

    return updated;
  }

  async remove(id: number) {
    const removed = await this.prisma.item.update({
      where: { id },
      data: { isDeleted: true },
    });

    await this.redisService.removeByPattern(CacheKey.ITEMS.ALL);

    this.logger.log(`Item removed: ${removed.name}`);

    return removed;
  }
}

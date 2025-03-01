import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateItemInput } from './dto/create-item.input';
import { UpdateItemInput } from './dto/update-item.input';
import { RedisService } from 'src/modules/redis/redis.service';
import { CacheKey } from 'src/constants/cache-key.constant';

@Injectable()
export class ItemService {
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

    return item;
  }

  async findAll() {
    const listKey = CacheKey.ITEMS.LIST;

    const cached = await this.redisService.getValue(listKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const items = await this.prisma.item.findMany({
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
      where: { id },
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

    return updated;
  }

  async remove(id: number) {
    const removed = await this.prisma.item.delete({
      where: { id },
    });

    await this.redisService.removeByPattern(CacheKey.ITEMS.ALL);

    return removed;
  }
}

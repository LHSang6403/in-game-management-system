import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateItemTypeInput } from './dto/create-item-type.input';
import { UpdateItemTypeInput } from './dto/update-item-type.input';
import { RedisService } from 'src/modules/redis/redis.service';
import { CacheKey } from 'src/constants/cache-key.constant';

@Injectable()
export class ItemTypeService {
  constructor(
    private prisma: PrismaClient,
    private redisService: RedisService,
  ) {}

  async create(data: CreateItemTypeInput) {
    const itemType = await this.prisma.itemType.create({
      data: {
        name: data.name,
        imageUrl: data.imageUrl,
      },
    });

    await this.redisService.removeByPattern(CacheKey.ITEM_TYPES.ALL);

    const key = CacheKey.ITEM_TYPES.BY_ID(itemType.id);
    await this.redisService.setValue(key, JSON.stringify(itemType));

    return itemType;
  }

  async findAll() {
    const listKey = CacheKey.ITEM_TYPES.LIST;

    const cached = await this.redisService.getValue(listKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const itemTypes = await this.prisma.itemType.findMany({
      include: { items: true },
    });

    await this.redisService.setValue(listKey, JSON.stringify(itemTypes));

    return itemTypes;
  }

  async findOne(id: number) {
    const key = CacheKey.ITEM_TYPES.BY_ID(id);

    const cached = await this.redisService.getValue(key);
    if (cached) {
      return JSON.parse(cached);
    }

    const itemType = await this.prisma.itemType.findUnique({
      where: { id },
      include: { items: true },
    });

    if (itemType) {
      await this.redisService.setValue(key, JSON.stringify(itemType));
    }

    return itemType;
  }

  async update(data: UpdateItemTypeInput) {
    const { id, name, imageUrl } = data;
    const itemType = await this.prisma.itemType.findUnique({ where: { id } });
    if (!itemType) {
      throw new BadRequestException('ItemType not found');
    }

    const updated = await this.prisma.itemType.update({
      where: { id },
      data: {
        name: name ?? itemType.name,
        imageUrl: imageUrl ?? itemType.imageUrl,
      },
    });

    await this.redisService.removeByPattern(CacheKey.ITEM_TYPES.ALL);

    const key = CacheKey.ITEM_TYPES.BY_ID(id);
    await this.redisService.setValue(key, JSON.stringify(updated));

    return updated;
  }

  async remove(id: number) {
    const removed = await this.prisma.itemType.delete({ where: { id } });

    await this.redisService.removeByPattern(CacheKey.ITEM_TYPES.ALL);

    return removed;
  }
}

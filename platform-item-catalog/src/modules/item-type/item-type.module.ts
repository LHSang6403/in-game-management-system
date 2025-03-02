import { Module } from '@nestjs/common';
import { ItemTypeResolver } from '@modules/item-type/item-type.resolver';
import { ItemTypeService } from '@modules/item-type/item-type.service';
import { PrismaClient } from '@prisma/client';
import { RedisService } from '@modules/redis/redis.service';

@Module({
  providers: [RedisService, ItemTypeResolver, ItemTypeService, PrismaClient],
})
export class ItemTypeModule {}

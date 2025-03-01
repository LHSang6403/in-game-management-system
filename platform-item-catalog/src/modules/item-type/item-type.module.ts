import { Module } from '@nestjs/common';
import { ItemTypeResolver } from './item-type.resolver';
import { ItemTypeService } from './item-type.service';
import { PrismaClient } from '@prisma/client';
import { RedisService } from '../redis/redis.service';

@Module({
  providers: [RedisService, ItemTypeResolver, ItemTypeService, PrismaClient],
})
export class ItemTypeModule {}

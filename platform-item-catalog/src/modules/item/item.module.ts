import { Module } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { PrismaClient } from '@prisma/client';
import { ItemResolver } from './item.resovler';
import { ItemService } from './item.service';

@Module({
  providers: [RedisService, ItemResolver, ItemService, PrismaClient],
})
export class ItemModule {}

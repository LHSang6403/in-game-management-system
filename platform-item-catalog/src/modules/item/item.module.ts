import { Module } from '@nestjs/common';
import { RedisService } from '@modules/redis/redis.service';
import { PrismaClient } from '@prisma/client';
import { ItemResolver } from '@modules/item/item.resovler';
import { ItemService } from '@modules/item/item.service';

@Module({
  providers: [RedisService, ItemResolver, ItemService, PrismaClient],
})
export class ItemModule {}

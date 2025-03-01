import { Module } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { InventoryService } from './inventory.service';
import { PrismaClient } from '@prisma/client';
import { InventoryResolver } from './inventory.resolver';

@Module({
  providers: [InventoryService, InventoryResolver, PrismaClient, RedisService],
  exports: [InventoryService],
})
export class InventoryModule {}

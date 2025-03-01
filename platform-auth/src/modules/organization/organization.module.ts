import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { PrismaClient } from '@prisma/client';
import { OrganizationResolver } from './oprganization.resolver';
import { RedisService } from '../redis/redis.service';

@Module({
  providers: [
    RedisService,
    OrganizationResolver,
    OrganizationService,
    PrismaClient,
  ],
  exports: [OrganizationService],
})
export class OrganizationModule {}

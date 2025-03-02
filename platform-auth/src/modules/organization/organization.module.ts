import { Module } from '@nestjs/common';
import { OrganizationService } from '@modules/organization/organization.service';
import { PrismaClient } from '@prisma/client';
import { OrganizationResolver } from '@modules/organization/oprganization.resolver';
import { RedisService } from '@modules/redis/redis.service';

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

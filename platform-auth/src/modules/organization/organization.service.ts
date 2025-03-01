import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';
import { RedisService } from '../redis/redis.service';
import { CacheKey } from 'src/constants/cache-key.constant';

@Injectable()
export class OrganizationService {
  constructor(
    private prisma: PrismaClient,
    private redisService: RedisService,
  ) {}

  async create(data: CreateOrganizationInput) {
    const org = await this.prisma.organization.create({
      data: {
        name: data.name,
        parentOrgId: data.parentOrgId ?? null,
      },
    });

    await this.redisService.removeByPattern(CacheKey.ORGS.ALL);

    const orgKey = CacheKey.ORGS.BY_ID(org.id);
    await this.redisService.setValue(orgKey, JSON.stringify(org));

    return org;
  }

  async findAll() {
    const listKey = CacheKey.ORGS.LIST;
    const cached = await this.redisService.getValue(listKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const orgs = await this.prisma.organization.findMany();
    await this.redisService.setValue(listKey, JSON.stringify(orgs));

    return orgs;
  }

  async findOne(id: number) {
    const cacheKey = CacheKey.ORGS.BY_ID(id);
    const cached = await this.redisService.getValue(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        children: true,
      },
    });

    if (org) {
      await this.redisService.setValue(cacheKey, JSON.stringify(org));
    }

    return org;
  }

  async update(id: number, data: UpdateOrganizationInput) {
    const org = await this.prisma.organization.update({
      where: { id },
      data: {
        name: data.name,
        parentOrgId: data.parentOrgId ?? null,
      },
    });

    await this.redisService.removeByPattern(CacheKey.ORGS.ALL);

    const orgKey = CacheKey.ORGS.BY_ID(id);
    await this.redisService.setValue(orgKey, JSON.stringify(org));

    return org;
  }

  async remove(id: number) {
    // Nếu tổ chức đã có user/children, bạn cần xử lý logic

    await this.prisma.organization.delete({ where: { id } });
    await this.redisService.removeByPattern(CacheKey.ORGS.ALL);

    return true;
  }
}

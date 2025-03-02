import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateOrganizationInput } from '@modules/organization/dto/create-organization.input';
import { UpdateOrganizationInput } from '@modules/organization/dto/update-organization.input';
import { RedisService } from '@modules/redis/redis.service';
import { CacheKey } from '@constants/cache-key.constant';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

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

    this.logger.log(`Organization ${org.id} has been created`);

    return org;
  }

  async findAll() {
    const listKey = CacheKey.ORGS.LIST;
    const cached = await this.redisService.getValue(listKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const orgs = await this.prisma.organization.findMany({
      where: { isDeleted: false },
      include: {
        children: true,
      },
    });
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
      where: { id, isDeleted: false },
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

    this.logger.log(`Organization ${id} has been updated`);

    return org;
  }

  async remove(id: number) {
    return this.prisma.$transaction(async (prisma) => {
      const subOrgs = await prisma.organization.findMany({
        where: { parentOrgId: id },
      });

      await prisma.organization.updateMany({
        where: {
          OR: [{ id }, { parentOrgId: id }],
        },
        data: { isDeleted: true },
      });

      await this.redisService.removeByPattern(CacheKey.ORGS.ALL);
      this.logger.log(
        `Organization ${id} and its ${subOrgs.length} sub-organizations marked as deleted.`,
      );

      return true;
    });
  }
}

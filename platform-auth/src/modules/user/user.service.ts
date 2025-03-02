import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from '@modules/user/dto/update-user.input';
import { RegisterUserInput } from '@modules/user/dto/register-user.input';
import { RedisService } from '@modules/redis/redis.service';
import { CacheKey } from '@constants/cache-key.constant';
import { Logger } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private prisma: PrismaClient,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async register(data: RegisterUserInput) {
    try {
      let orgId = data.organizationId;

      if (!orgId) {
        const newOrg = await this.prisma.organization.create({
          data: {
            name: `${data.name}'s Organization`,
          },
        });

        orgId = newOrg.id;
      } else {
        const existingOrg = await this.prisma.organization.findUnique({
          where: { id: orgId },
        });

        if (!existingOrg) {
          throw new BadRequestException('Organization does not exist');
        }
      }

      const hashed = await bcrypt.hash(data.password, 10);
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          password: hashed,
          name: data.name,
          role: data.role ?? Role.PLAYER,
          organizationId: orgId,
        },
        include: { organization: true },
      });

      await this.redisService.removeByPattern(CacheKey.USERS.ALL);
      await this.redisService.setValue(
        CacheKey.USERS.BY_ID(user.id),
        JSON.stringify(user),
      );

      this.logger.log(`User ${user.id} created successfully.`);

      return user;
    } catch (error) {
      this.logger.error(`Error in register: ${error.message}`);
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async login(email: string, password: string, device?: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email, isDeleted: false },
      });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const token = this.jwtService.sign({ sub: user.id, email: user.email });

      await this.prisma.userToken.upsert({
        where: {
          userId_device: {
            userId: user.id,
            device: device || 'unknown',
          },
        },
        update: { token },
        create: { userId: user.id, token, device: device || 'unknown' },
      });

      this.logger.log(`User ${user.id} logged in on device: ${device}`);

      return { token };
    } catch (error) {
      this.logger.error(`Error in login: ${error.message}`);
      throw new UnauthorizedException('Login failed');
    }
  }

  async logout(token: string) {
    try {
      const trimmedToken = token.startsWith('Bearer ')
        ? token.slice(7).trim()
        : token.trim();

      const decoded = this.jwtService.verify(trimmedToken);

      await this.prisma.userToken.deleteMany({
        where: { userId: decoded.sub, token: trimmedToken },
      });

      this.logger.log(`User ${decoded.sub} logged out (single device)`);

      return { message: 'Logged out successfully' };
    } catch (error) {
      this.logger.error(`Error in logout: ${error.message}`);
      throw new UnauthorizedException('Logout failed');
    }
  }

  async logoutAll(userId: number) {
    try {
      await this.prisma.userToken.deleteMany({ where: { userId } });

      this.logger.log(`User ${userId} logged out from all devices`);

      return { message: 'Logged out from all devices' };
    } catch (error) {
      this.logger.error(`Error in logoutAll: ${error.message}`);
      throw new InternalServerErrorException('Logout all failed');
    }
  }

  async update(id: number, data: UpdateUserInput) {
    try {
      let hashedPassword: string | undefined;
      if (data.password) {
        hashedPassword = await bcrypt.hash(data.password, 10);
      }

      const user = await this.prisma.user.update({
        where: { id },
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          role: data.role,
        },
      });

      await this.redisService.removeByPattern(CacheKey.USERS.ALL);
      await this.redisService.setValue(
        CacheKey.USERS.BY_ID(id),
        JSON.stringify(user),
      );

      this.logger.log(`User ${user.id} updated successfully.`);

      return user;
    } catch (error) {
      this.logger.error(`Error in update(${id}): ${error.message}`);
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async findAll() {
    const listKey = CacheKey.USERS.LIST;
    const cached = await this.redisService.getValue(listKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const users = await this.prisma.user.findMany({
      where: { isDeleted: false },
    });
    await this.redisService.setValue(listKey, JSON.stringify(users));

    return users;
  }

  async findOne(id: number) {
    const userKey = CacheKey.USERS.BY_ID(id);
    const cached = await this.redisService.getValue(userKey);
    if (cached) {
      console.log('cached', JSON.parse(cached));
      return JSON.parse(cached);
    }

    const user = await this.prisma.user.findUnique({
      where: { id, isDeleted: false },
    });
    if (user) {
      await this.redisService.setValue(userKey, JSON.stringify(user));
    }

    return user;
  }

  async remove(id: number) {
    try {
      await this.prisma.user.update({
        where: { id },
        data: { isDeleted: true },
      });
      await this.redisService.removeByPattern(CacheKey.USERS.ALL);

      this.logger.log(`User ${id} deleted successfully.`);

      return true;
    } catch (error) {
      this.logger.error(`Error in remove(${id}): ${error.message}`);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  async verifyToken(token: string) {
    try {
      let trimmedToken = '';

      if (token.startsWith('Bearer ')) {
        trimmedToken = token.slice(6).trim();
      } else {
        trimmedToken = token.trim();
      }

      const decoded = this.jwtService.verify(trimmedToken);
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return { user };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

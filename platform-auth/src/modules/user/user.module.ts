import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { UserService } from './user.service';
import { JwtStrategy } from './jwt.strategy';
import { UserResolver } from './user.resolver';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [],
  providers: [
    RedisService,
    UserResolver,
    UserService,
    JwtStrategy,
    PrismaClient,
  ],
  exports: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { UserService } from '@modules/user/user.service';
import { JwtStrategy } from '@modules/user/jwt.strategy';
import { UserResolver } from '@modules/user/user.resolver';
import { RedisService } from '@modules/redis/redis.service';
import { UserController } from '@modules/user/user.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || '',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UserController],
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

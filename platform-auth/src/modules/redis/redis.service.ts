import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  logger = new Logger(RedisService.name);

  private client: Redis;

  onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || 'mysecurepassword',
    });

    this.logger.log('Redis connected');
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.quit();
    }

    this.logger.log('Redis disconnected');
  }

  getClient(): Redis {
    return this.client;
  }

  async getValue(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async setValue(
    key: string,
    value: string,
    ttlSeconds: number = 60,
  ): Promise<'OK'> {
    return this.client.set(key, value, 'EX', ttlSeconds);
  }

  async removeKey(key: string): Promise<number> {
    return this.client.del(key);
  }

  async removeByPattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }
}

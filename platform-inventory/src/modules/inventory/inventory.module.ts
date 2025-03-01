import { Module } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { InventoryService } from './inventory.service';
import { PrismaClient } from '@prisma/client';
import { InventoryResolver } from './inventory.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'transaction_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  providers: [
    InventoryService,
    InventoryResolver,
    PrismaClient,
    RedisService,
    RabbitMQService,
  ],
  exports: [InventoryService],
})
export class InventoryModule {}

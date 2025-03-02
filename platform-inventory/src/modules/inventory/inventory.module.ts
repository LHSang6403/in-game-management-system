import { Module } from '@nestjs/common';
import { RedisService } from '@modules/redis/redis.service';
import { InventoryService } from '@modules/inventory/inventory.service';
import { PrismaClient } from '@prisma/client';
import { InventoryResolver } from '@modules/inventory/inventory.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQService } from '@modules/rabbitmq/rabbitmq.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_MQ || 'amqp://localhost:5672'],
          queue: process.env.RABBIT_MQ_TRANSACTION_QUEUE || 'transaction_queue',
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

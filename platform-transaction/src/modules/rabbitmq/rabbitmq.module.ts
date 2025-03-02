import { Module } from '@nestjs/common';
import { RabbitMQService } from '@modules/rabbitmq/rabbitmq.service';

@Module({
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}

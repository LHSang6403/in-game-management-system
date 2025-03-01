import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RABBITMQ_QUEUES } from 'src/constants/rabbitmq.constant';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQService.name);

  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    const url = process.env.RABBITMQ_URL || 'amqp://localhost';
    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createChannel();

    await this.channel.assertQueue(RABBITMQ_QUEUES.ADD_TRANSACTION, {
      durable: true,
    });
    this.logger.log(
      `RabbitMQService connected to queue: ${RABBITMQ_QUEUES.ADD_TRANSACTION}`,
    );
  }

  async publishToQueue(queueName: string, payload: any) {
    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)), {
      persistent: true,
    });
    this.logger.log(
      `Sent message to RabbitMQ queue "${queueName}":\n${JSON.stringify(payload, null, 2)}`,
    );
  }
}

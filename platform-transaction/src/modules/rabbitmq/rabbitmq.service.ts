import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RABBITMQ_QUEUES } from '@constants/rabbitmq.constant';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  logger = new Logger(RabbitMQService.name);

  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private queuesToAssert = [RABBITMQ_QUEUES.ADD_TRANSACTION];

  async onModuleInit() {
    const url = process.env.RABBITMQ_URL || 'amqp://localhost';
    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createChannel();

    for (const q of this.queuesToAssert) {
      await this.channel.assertQueue(q, { durable: true });
      this.logger.log(`RabbitMQService: Queue "${q}" asserted.`);
    }
  }

  async subscribeQueue(queueName: string, callback: (msgContent: any) => void) {
    this.channel.consume(queueName, (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          callback(content);
          this.channel.ack(msg);
        } catch (error) {
          this.logger.error(
            `Error processing message from queue "${queueName}":`,
            error,
          );
          // channel.nack(msg) // requeue/retry
        }
      }
    });
  }

  async publishToQueue(queueName: string, payload: any) {
    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(payload)), {
      persistent: true,
    });
  }
}

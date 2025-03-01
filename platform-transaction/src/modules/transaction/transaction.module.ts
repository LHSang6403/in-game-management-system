import { Module } from '@nestjs/common';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { TransactionService } from './transacton.service';
import { TransactionResolver } from './transaction.resolver';

@Module({
  imports: [RabbitMQModule],
  providers: [TransactionService, TransactionResolver],
})
export class TransactionModule {}

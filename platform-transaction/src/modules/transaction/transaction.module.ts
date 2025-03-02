import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@modules/rabbitmq/rabbitmq.module';
import { TransactionService } from '@modules/transaction/transacton.service';
import { TransactionResolver } from '@modules/transaction/transaction.resolver';

@Module({
  imports: [RabbitMQModule],
  providers: [TransactionService, TransactionResolver],
})
export class TransactionModule {}

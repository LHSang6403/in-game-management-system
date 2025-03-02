import { Args, Query, Resolver } from '@nestjs/graphql';
import { TransactionEntity } from '@modules/transaction/entities/transaction.entity';
import { TransactionService } from '@modules/transaction/transacton.service';

@Resolver(() => TransactionEntity)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => String)
  pingTransaction(): string {
    return 'pong';
  }

  @Query(() => [TransactionEntity])
  async searchTransactions(@Args('term') term: string) {
    return this.transactionService.searchTransactions(term);
  }
}

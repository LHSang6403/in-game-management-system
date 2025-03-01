import { Injectable, OnModuleInit } from '@nestjs/common';
import { RABBITMQ_QUEUES } from 'src/constants/rabbitmq.constant';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { ElasticsearchService } from '../elastic-search/elastic-search.service';

@Injectable()
export class TransactionService implements OnModuleInit {
  private readonly transactionIndex =
    process.env.ELASTICSEARCH_INDEX_NAME || 'transaction-logs';

  constructor(
    private rabbitMQ: RabbitMQService,
    private elasticsearchService: ElasticsearchService,
  ) {}

  async onModuleInit() {
    await this.rabbitMQ.subscribeQueue(
      RABBITMQ_QUEUES.ADD_TRANSACTION,
      async (msgContent) => {
        console.log('Received add-transaction event:', msgContent);

        await this.elasticsearchService.createIndex(this.transactionIndex);

        await this.elasticsearchService.indexDocument(this.transactionIndex, {
          userId: msgContent.userId,
          itemId: msgContent.itemId,
          oldQty: msgContent.oldQty,
          newQty: msgContent.newQty,
          reason: msgContent.reason,
          timestamp: new Date().toISOString(),
        });

        console.log('Transaction logged to Elasticsearch');
      },
    );
  }

  async searchTransactions(term: string) {
    const esQuery = {
      query: {
        multi_match: {
          query: term,
          fields: ['userId', 'reason'],
          fuzziness: 'AUTO',
          operator: 'OR',
        },
      },
    };

    const result = await this.elasticsearchService.search(
      this.transactionIndex,
      esQuery,
    );

    return result.map((hit: any) => {
      const source = hit._source;
      return {
        id: hit._id,
        userId: source.userId,
        itemId: source.itemId,
        oldQty: source.oldQty,
        newQty: source.newQty,
        reason: source.reason,
        timestamp: source.timestamp,
      };
    });
  }
}

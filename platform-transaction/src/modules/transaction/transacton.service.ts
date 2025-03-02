import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RABBITMQ_QUEUES } from '@constants/rabbitmq.constant';
import { RabbitMQService } from '@modules/rabbitmq/rabbitmq.service';
import { ElasticsearchService } from '@modules/elastic-search/elastic-search.service';

@Injectable()
export class TransactionService implements OnModuleInit {
  private readonly logger = new Logger(TransactionService.name);

  private readonly transactionIndex =
    process.env.ELASTICSEARCH_INDEX_NAME || 'transaction-logs';

  constructor(
    private rabbitMQ: RabbitMQService,
    private elasticsearchService: ElasticsearchService,
  ) {}

  async onModuleInit() {
    this.logger.log(`Subscribing to queue: ${RABBITMQ_QUEUES.ADD_TRANSACTION}`);

    await this.rabbitMQ.subscribeQueue(
      RABBITMQ_QUEUES.ADD_TRANSACTION,
      async (msgContent) => {
        this.logger.log(
          `Received ${RABBITMQ_QUEUES.ADD_TRANSACTION} event:`,
          msgContent,
        );

        await this.elasticsearchService.createIndex(this.transactionIndex);
        await this.elasticsearchService.indexDocument(this.transactionIndex, {
          userId: msgContent.userId,
          itemId: msgContent.itemId,
          oldQty: msgContent.oldQty,
          newQty: msgContent.newQty,
          changeQty: msgContent.changeQty,
          reason: msgContent.reason,
          status: msgContent.status,
          timestamp: msgContent.timestamp || new Date().toISOString(),
        });

        this.logger.log('Transaction logged to Elasticsearch');
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

    this.logger.log(`Search for "${term}" returned ${result.length} hits`);

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

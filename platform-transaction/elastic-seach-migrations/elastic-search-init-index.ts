import { ElasticsearchService } from '../src/modules/elastic-search/elastic-search.service';

async function main() {
  const service = new ElasticsearchService();
  await service.onModuleInit();

  const indexName = process.env.ELASTICSEARCH_INDEX_NAME || 'transaction-logs';

  await service.createIndex(indexName);

  await service.getClient().indices.putMapping({
    index: indexName,
    body: {
      properties: {
        userId: { type: 'keyword' },
        itemId: { type: 'integer' },
        oldQty: { type: 'integer' },
        newQty: { type: 'integer' },
        changeQty: { type: 'integer' },
        reason: { type: 'text' },
        status: { type: 'keyword' },
        timestamp: { type: 'date' },
      },
    },
  });

  console.log(`Index "${indexName}" migrated with mapping!`);

  await service.onModuleDestroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { ElasticsearchService } from '../src/modules/elastic-search/elastic-search.service';

async function main() {
  const service = new ElasticsearchService();
  await service.onModuleInit();

  const indexName = process.env.ELASTICSEARCH_INDEX_NAME || 'transaction-logs';

  const docs = [
    {
      userId: 'u123',
      itemId: 101,
      oldQty: 5,
      newQty: 10,
      reason: 'inventory update',
      timestamp: new Date().toISOString(),
    },
    {
      userId: 'u456',
      itemId: 202,
      oldQty: 2,
      newQty: 0,
      reason: 'item consumed',
      timestamp: new Date().toISOString(),
    },
  ];

  for (const doc of docs) {
    await service.indexDocument(indexName, doc);
  }

  console.log(`Seeded ${docs.length} transaction docs into "${indexName}".`);

  await service.onModuleDestroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

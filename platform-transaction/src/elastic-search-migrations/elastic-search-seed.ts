import { ElasticsearchService } from '../modules/elastic-search/elastic-search.service';

async function main() {
  const service = new ElasticsearchService();
  await service.onModuleInit();

  const indexName = process.env.ELASTICSEARCH_INDEX_NAME || 'transaction-logs';

  await service.createIndex(indexName);

  const docs = [
    {
      userId: 'u123',
      itemId: 101,
      oldQty: 5,
      newQty: 10,
      changeQty: 5,
      reason: 'Inventory updated by user',
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
    },
    {
      userId: 'u456',
      itemId: 202,
      oldQty: 2,
      newQty: 0,
      changeQty: -2,
      reason: 'Item consumed completely',
      status: 'COMPLETED',
      timestamp: new Date().toISOString(),
    },
    {
      userId: 'u789',
      itemId: 303,
      oldQty: 10,
      newQty: 5,
      changeQty: -5,
      reason: 'Partial consumption',
      status: 'PARTIAL',
      timestamp: new Date().toISOString(),
    },
    {
      userId: 'u001',
      itemId: 404,
      oldQty: 50,
      newQty: 40,
      changeQty: -10,
      reason: 'Bulk order fulfillment',
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
    },
    {
      userId: 'u002',
      itemId: 505,
      oldQty: 5,
      newQty: 5,
      changeQty: 0,
      reason: 'Inventory check (No change)',
      status: 'UNCHANGED',
      timestamp: new Date().toISOString(),
    },
  ];

  for (const doc of docs) {
    await service.indexDocument(indexName, doc);
  }

  console.log(
    `✅ Seeded ${docs.length} transaction documents into "${indexName}".`,
  );

  await service.onModuleDestroy();
}

main().catch((err) => {
  console.error(`❌ Seeding failed: ${err.message}`);
  process.exit(1);
});

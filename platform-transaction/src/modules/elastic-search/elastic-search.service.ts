import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchService implements OnModuleInit, OnModuleDestroy {
  private client: Client;

  onModuleInit() {
    const host = process.env.ELASTICSEARCH_HOST || 'localhost';
    const port = process.env.ELASTICSEARCH_HTTP_PORT || '9200';

    this.client = new Client({
      node: `http://${host}:${port}`,
    });
  }

  onModuleDestroy() {
    // Elasticsearch client không nhất thiết cần đóng,
    // nhưng nếu bạn muốn dọn dẹp, có thể làm ở đây
  }

  getClient() {
    return this.client;
  }

  async createIndex(indexName: string) {
    const exists = await this.client.indices.exists({ index: indexName });
    if (!exists) {
      await this.client.indices.create({ index: indexName });
    }
  }

  async indexDocument(indexName: string, doc: any) {
    await this.client.index({
      index: indexName,
      body: doc,
    });
  }

  async search(indexName: string, query: any) {
    const result = await this.client.search({
      index: indexName,
      body: query,
    });
    return result.hits.hits;
  }

  async deleteIndex(indexName: string) {
    const exists = await this.client.indices.exists({ index: indexName });
    if (exists) {
      await this.client.indices.delete({ index: indexName });
    }
  }

  // ... bạn có thể thêm các hàm update, bulk, scroll, v.v.
}

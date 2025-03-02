import { Module, Global } from '@nestjs/common';
import { ElasticsearchService } from '@modules/elastic-search/elastic-search.service';

@Global()
@Module({
  providers: [ElasticsearchService],
  exports: [ElasticsearchService],
})
export class ElasticsearchModule {}

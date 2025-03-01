import { Module, Global } from '@nestjs/common';
import { ElasticsearchService } from './elastic-search.service';

@Global()
@Module({
  providers: [ElasticsearchService],
  exports: [ElasticsearchService],
})
export class ElasticsearchModule {}

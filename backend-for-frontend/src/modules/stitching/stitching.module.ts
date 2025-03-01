import { Module } from '@nestjs/common';
import { StitchingService } from './stitching.service';
import { StitchingResolver } from './stitching.resolver';

@Module({
  providers: [StitchingService, StitchingResolver],
  exports: [StitchingService, StitchingResolver],
})
export class StitchingModule {}

import { Module } from '@nestjs/common';
import { StitchingService } from '@modules/stitching/stitching.service';
import { StitchingResolver } from '@modules/stitching/stitching.resolver';

@Module({
  providers: [StitchingService, StitchingResolver],
  exports: [StitchingService, StitchingResolver],
})
export class StitchingModule {}

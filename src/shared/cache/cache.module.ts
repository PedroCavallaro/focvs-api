import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Module({
  providers: [
    {
      provide: CacheService,
      useValue: CacheService.instace,
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}

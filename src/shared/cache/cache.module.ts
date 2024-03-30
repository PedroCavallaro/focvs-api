import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Module({
  providers: [
    {
      provide: CacheService,
      useFactory: () => new CacheService()
    }
  ],
  exports: [CacheService]
})
export class CacheModule {}

import { Global, Module } from '@nestjs/common';
import { LoggerService } from './Logger.service';
import { CacheModule } from '../cache/cache.module';
import { PrismaModule } from '../db/prisma.module';

@Global()
@Module({
  imports: [CacheModule, PrismaModule],
  providers: [LoggerService],
  exports: [LoggerService]
})
export class LoggerModule {}

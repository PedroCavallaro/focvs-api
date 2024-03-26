import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService extends Redis {
  static readonly instace = new Redis({
    host: 'localhost',
    port: 6379,
  });
}

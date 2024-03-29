import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { env } from '../env';

@Injectable()
export class CacheService extends Redis {
  static readonly instace = new Redis({
    host: 'redis',
    port: 6379,
    password: '123'
  });
}

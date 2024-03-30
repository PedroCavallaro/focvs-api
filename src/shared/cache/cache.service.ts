import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { env } from '../env';

@Injectable()
export class CacheService extends Redis {
  constructor() {
    super(env.db.redis);
  }
}

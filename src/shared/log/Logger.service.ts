import { Injectable } from '@nestjs/common'
import { LogDto } from './dto/log.dto'
import { PrismaService } from '../db/prisma.service'
import { Cron } from '@nestjs/schedule'
import { CacheService } from '../cache/cache.service'

@Injectable()
export class LoggerService {
  static readonly cache: CacheService = new CacheService()

  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 5 * * * *')
  private async syncRedisToDatabase() {
    const logs = await this.getLogsOnRedisQueue()

    console.log('Saving logs on Database')
    console.log(logs)

    await this.addMultipleLogsToDatabase(logs)
  }

  private async getLogsOnRedisQueue() {
    const logs = []
    const syncNumber = 1000
    const syncLoopArray = Array.from(Array(syncNumber).keys())
    try {
      await Promise.all(
        syncLoopArray.map(async () => {
          const log = await this.getOnQueue('log')

          if (log) {
            logs.push(JSON.parse(log))
          }
        })
      )
    } catch (error) {
      console.log(error)
    }
    return logs
  }

  private async addMultipleLogsToDatabase(logs: LogDto[]) {
    try {
      return await this.prisma.logs.createMany({
        data: logs
      })
    } catch (error) {
      PrismaService.handleError(error)
    }
  }

  static async sendToQueue(log: LogDto) {
    await LoggerService.cache.rpush('log', JSON.stringify(log))
  }
  private async getOnQueue(key: string) {
    return await LoggerService.cache.lpop(key)
  }
}

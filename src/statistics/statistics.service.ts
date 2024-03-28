import { Injectable } from '@nestjs/common';
import { StatisticsRepository } from './statistics.repository';

@Injectable()
export class StatisticsService {
  constructor(private readonly repo: StatisticsRepository) {}

  async generateStatistics() {
    return await this.repo.findUserLastWorkouts();
  }
}

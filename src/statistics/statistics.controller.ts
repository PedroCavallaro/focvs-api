import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/auth/guards/decorators/public.decorator';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly service: StatisticsService) {}

  @Get()
  @Public()
  async getUserStatistics() {
    return await this.service.generateStatistics();
  }
}

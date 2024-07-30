import { Module } from '@nestjs/common'
import { WorkoutController } from './workout.controller'
import { WorkoutService } from './workout.service'
import { WorkoutRepository } from './workout.repository'
import { PrismaModule } from 'src/shared/db/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [WorkoutController],
  providers: [WorkoutService, WorkoutRepository]
})
export class WorkoutModule {}

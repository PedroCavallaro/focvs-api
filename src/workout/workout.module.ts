import { Module } from '@nestjs/common'
import { WorkoutController } from './workout.controller'
import { WorkoutService } from './workout.service'
import { WorkoutRepository } from './workout.repository'
import { PrismaModule } from 'src/shared/db/prisma.module'
import { HashModule } from 'src/shared/services/hash'

@Module({
  imports: [PrismaModule, HashModule],
  controllers: [WorkoutController],
  providers: [WorkoutService, WorkoutRepository]
})
export class WorkoutModule {}

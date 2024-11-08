import { Module } from '@nestjs/common'
import { WorkoutController } from './workout.controller'
import { WorkoutService } from './workout.service'
import { WorkoutRepository } from './workout.repository'
import { PrismaModule } from 'src/shared/db/prisma.module'
import { HashModule } from 'src/shared/services/hash'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [
    PrismaModule,
    HttpModule,
    ClientsModule.register([
      {
        name: 'IMAGES_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 8889
        }
      }
    ]),
    HashModule
  ],
  controllers: [WorkoutController],
  providers: [WorkoutService, WorkoutRepository]
})
export class WorkoutModule {}

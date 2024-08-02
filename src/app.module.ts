import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { WorkoutModule } from './workout/workout.module'
import { ExerciseModule } from './exercise/exercise.module'
import { PrismaModule } from './shared/db/prisma.module'
// import { StatisticsModule } from './statistics/statistics.module';
// import { MongooseModule } from '@nestjs/mongoose'
// import { env } from './shared/env'
import { ScheduleModule } from '@nestjs/schedule'
import { RecoverPasswordGuard } from './auth/guards/recover-password.guard'
import { AuthGuard, FocvsSharedStuffModule, JwtService } from '@PedroCavallaro/focvs-utils'
import { APP_GUARD, Reflector } from '@nestjs/core'

@Module({
  imports: [
    FocvsSharedStuffModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    ExerciseModule,
    WorkoutModule
  ],
  controllers: [],
  providers: [
    RecoverPasswordGuard,
    {
      provide: APP_GUARD,
      useFactory: (jwtService: JwtService) => {
        return new AuthGuard(jwtService, new Reflector())
      },
      inject: [JwtService]
    }
  ]
})
export class AppModule {}

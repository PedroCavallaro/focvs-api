import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { WorkoutModule } from './workout/workout.module';
import { ExerciseModule } from './exercise/exercise.module';
import { PrismaModule } from './shared/db/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { StatisticsModule } from './statistics/statistics.module';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from './shared/env';
import { ScheduleModule } from '@nestjs/schedule';
import { RecoverPasswordGuard } from './auth/guards/recover-password.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    ExerciseModule,
    WorkoutModule,
    StatisticsModule,
    MongooseModule.forRoot(env.db.mongo, { dbName: 'focvs' })
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    RecoverPasswordGuard
  ]
})
export class AppModule {}

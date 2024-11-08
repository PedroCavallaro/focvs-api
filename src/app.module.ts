import { Module } from '@nestjs/common'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { WorkoutModule } from './workout/workout.module'
import { ExerciseModule } from './exercise/exercise.module'
import { PrismaModule } from './shared/db/prisma.module'
import { RecoverPasswordGuard } from './auth/guards/recover-password.guard'
import { APP_GUARD, Reflector } from '@nestjs/core'
import { FocvsSharedStuffModule, JwtService, AuthGuard } from '@pedrocavallaro/focvs-utils'
import { HashModule } from './shared/services/hash'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [
    FocvsSharedStuffModule,
    ConfigModule.forRoot(),
    HttpModule,
    HashModule,
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

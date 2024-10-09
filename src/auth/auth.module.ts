import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PasswordService } from '../auth/password/password.service'
import { AuthRepository } from './auth.repository'
import { PrismaModule } from 'src/shared/db/prisma.module'
import { CacheModule } from 'src/shared/cache/cache.module'
import { FocvsSharedStuffModule, JwtService } from '@pedrocavallaro/focvs-utils'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: 'MESSAGING',
        transport: Transport.TCP,
        options: {
          port: 4000
        }
      }
    ]),
    CacheModule,
    FocvsSharedStuffModule
  ],
  controllers: [AuthController],
  providers: [AuthRepository, JwtService, AuthService, PasswordService],
  exports: [AuthService]
})
export class AuthModule {}

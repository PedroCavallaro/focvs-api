import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthRepository } from './auth.repository'
import { PrismaModule } from 'src/shared/db/prisma.module'
import { CacheModule } from 'src/shared/cache/cache.module'
import { FocvsSharedStuffModule, JwtService } from '@pedrocavallaro/focvs-utils'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { HashModule } from 'src/shared/services/hash'

@Module({
  imports: [
    PrismaModule,
    HashModule,
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
  providers: [AuthRepository, JwtService, AuthService],
  exports: [AuthService]
})
export class AuthModule {}

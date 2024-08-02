import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { PasswordService } from 'src/auth/password/password.service'
import { AuthRepository } from './auth.repository'
import { PrismaModule } from 'src/shared/db/prisma.module'
import { CacheModule } from 'src/shared/cache/cache.module'
import { MailService } from 'src/jobs/mail/mail.service'
import { FocvsSharedStuffModule, JwtService } from '@PedroCavallaro/focvs-utils'

@Module({
  imports: [PrismaModule, CacheModule, FocvsSharedStuffModule],
  controllers: [AuthController],
  providers: [AuthRepository, JwtService, AuthService, PasswordService, MailService],
  exports: [AuthService]
})
export class AuthModule {}

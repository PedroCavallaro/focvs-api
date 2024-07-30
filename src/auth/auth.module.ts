import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from 'src/auth/jwt/jwt.service';
import { PasswordService } from 'src/auth/password/password.service';
import { AuthRepository } from './auth.repository';
import { AuthGuard } from './guards/auth.guard';
import { PrismaModule } from 'src/shared/db/prisma.module';
import { CacheModule } from 'src/shared/cache/cache.module';
import { MailService } from 'src/jobs/mail/mail.service';

@Module({
  imports: [PrismaModule, CacheModule],
  controllers: [AuthController],
  providers: [
    AuthRepository,
    AuthService,
    AuthGuard,
    JwtService,
    PasswordService,
    MailService
  ],
  exports: [AuthService, AuthGuard, JwtService]
})
export class AuthModule {}

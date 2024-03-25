import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from 'src/utils/jwt/jwt.service';
import { PasswordService } from 'src/utils/password/password.service';
import { AuthRepository } from './auth.repository';
import { AuthGuard } from './guards/auth.guard';
import { PrismaModule } from 'src/shared/db/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [
    AuthRepository,
    AuthService,
    AuthGuard,
    JwtService,
    PasswordService,
  ],
  exports: [AuthService, AuthGuard, JwtService],
})
export class AuthModule {}

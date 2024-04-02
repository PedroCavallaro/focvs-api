import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateAccountDto } from './dtos/create-account';
import { SiginDto } from './dtos/sign-in';
import { Public } from './guards/decorators/public.decorator';
import { GetRecoverPasswordTokenDto } from './dtos/get-recover-password-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Body() signInDto: SiginDto, @Res() res: Response) {
    const userToken = await this.service.signIn(signInDto);

    return res.status(200).send({ token: userToken });
  }

  @Public()
  @Post('register')
  async createUser(
    @Body() createAccountDto: CreateAccountDto,
    @Res() res: Response
  ) {
    const userToken = await this.service.createUser(createAccountDto);

    return res.status(200).send({ token: userToken });
  }

  @Public()
  @Post('token')
  async getRecoverPasswordToken(
    @Body() recoverDto: GetRecoverPasswordTokenDto
  ) {
    return await this.service.getRecoverPasswordToken(recoverDto);
  }
}

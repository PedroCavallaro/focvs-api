import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

import { Response } from 'express';
import { CreateAccountDto } from './dtos/CreateAccountDto';
import { SiginDto } from './dtos/SiginDto';
import { Public } from './guards/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Body() signInDto: SiginDto, @Res() res: Response) {
    const userToken = await this.authService.signIn(signInDto);

    return res.status(200).send({ token: userToken });
  }

  @Public()
  @Post('register')
  async createUser(
    @Body() createAccountDto: CreateAccountDto,
    @Res() res: Response,
  ) {
    const userToken = await this.authService.createUser(createAccountDto);

    return res.status(200).send({ token: userToken });
  }
}

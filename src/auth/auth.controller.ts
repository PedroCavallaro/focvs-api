import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common'
import { Public, AuthUser, JwtPayloadDTO } from '@pedrocavallaro/focvs-utils'
import { AuthService } from './auth.service'
import {
  SiginDto,
  CreateAccountDto,
  GetRecoverPasswordTokenDto,
  RecoverPasswordCodeDto,
  NewPasswordDto
} from './dtos'
import { Response } from 'express'
import { RecoverPasswordGuard, AuthToken } from './guards'

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Body() signInDto: SiginDto, @Res() res: Response) {
    const userToken = await this.service.signIn(signInDto)

    return res.status(200).send({ token: userToken })
  }

  @Public()
  @Post('register')
  async createUser(@Body() createAccountDto: CreateAccountDto, @Res() res: Response) {
    const userToken = await this.service.createUser(createAccountDto)

    return res.status(201).send({ token: userToken })
  }

  @Public()
  @Post('recover-token')
  async generateRecoverPasswordToken(@Body() recoverDto: GetRecoverPasswordTokenDto) {
    return await this.service.generateRecoverPasswordToken(recoverDto)
  }

  @UseGuards(RecoverPasswordGuard)
  @Post('validate')
  async validateRecoverToken(
    @AuthToken() jwt: string,
    @Body() recoverPasswordCodeDto: RecoverPasswordCodeDto
  ) {
    return await this.service.validateRecoverToken(jwt, recoverPasswordCodeDto)
  }

  @UseGuards(RecoverPasswordGuard)
  @Post('change-password')
  async changePassword(
    @AuthUser() user: JwtPayloadDTO,
    @AuthToken() jwt: string,
    @Body() newPasswordDto: NewPasswordDto
  ) {
    return await this.service.changePassword(user, jwt, newPasswordDto)
  }
}

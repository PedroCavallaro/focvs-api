import { Injectable, HttpStatus, Inject } from '@nestjs/common'
import { JwtService, AppError, JwtPayloadDTO } from '@pedrocavallaro/focvs-utils'
import { CacheService } from 'src/shared/cache/cache.service'
import { AuthRepository } from './auth.repository'
import {
  CreateAccountDto,
  SiginDto,
  GetRecoverPasswordTokenDto,
  RecoverPasswordCodeDto,
  RecoverPasswordResponse,
  NewPasswordDto
} from './dtos'
import { RecoverPasswordStatus } from './enums/recover-password.status'
import { CachedCodeObject } from './types/cached-code-object.type'
import { ClientProxy } from '@nestjs/microservices'
import { HashService } from '../shared/services/hash/hash.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly cache: CacheService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
    private readonly repo: AuthRepository,
    @Inject('MESSAGING') private readonly messaging: ClientProxy
  ) {}

  async createUser(createAccountDTO: CreateAccountDto) {
    const isAlreadyRegistered = await this.repo.searchAccount(createAccountDTO.email)
    if (isAlreadyRegistered) throw new AppError('Email já ccadastrado', HttpStatus.CONFLICT)

    const hashedPass = await this.hashService.generateHash(createAccountDTO.password)

    createAccountDTO.password = hashedPass

    const account = await this.repo.createAccount(createAccountDTO)

    const token = this.jwtService.signToken(
      account.id,
      account.email,
      account.name,
      account.imageUrl
    )

    return token
  }

  async signIn(signInDTO: SiginDto) {
    const account = await this.repo.searchAccount(signInDTO.email)

    console.log(account)
    if (!account) throw new AppError('Conta não registrada', HttpStatus.NOT_FOUND)

    const isPasswordMatch = await this.hashService.compare(signInDTO.password, account.password)

    if (!isPasswordMatch) throw new AppError('Senha incorreta', HttpStatus.NOT_FOUND)

    const token = this.jwtService.signToken(
      account.id,
      account.email,
      account.name,
      account.imageUrl
    )
    console.log(token)

    return token
  }

  async generateRecoverPasswordToken(recoverDto: GetRecoverPasswordTokenDto) {
    this.messaging.emit('send-recover-password-mail', {})

    const account = await this.repo.finAccountByEmail(recoverDto.email)
    if (!account) throw new AppError('Conta não encontrada', HttpStatus.NOT_FOUND)

    const jwt = this.jwtService.signToken(account.id, account.email, '', '')
    const token = this.generateOneTimeToken()
    const cachedCodeObject: CachedCodeObject = {
      code: token,
      status: RecoverPasswordStatus.PENDING
    }

    await this.cache.set(jwt, JSON.stringify(cachedCodeObject), 'EX', 300)

    return { token: jwt }
  }

  async validateRecoverToken(jwt: string, recoverPasswordCodeDto: RecoverPasswordCodeDto) {
    const cachedCodeObject: CachedCodeObject = await this.getCachedCodeObject(jwt)

    if (Number(cachedCodeObject.code) !== recoverPasswordCodeDto.code)
      throw new AppError('Token inválido', HttpStatus.UNAUTHORIZED)

    cachedCodeObject.status = RecoverPasswordStatus.VALID

    await this.cache.set(jwt, JSON.stringify(cachedCodeObject), 'EX', 300)

    return new RecoverPasswordResponse(RecoverPasswordStatus.VALID)
  }

  async changePassword(user: JwtPayloadDTO, jwt: string, newPasswordDto: NewPasswordDto) {
    const cachedCodeObject: CachedCodeObject = await this.getCachedCodeObject(jwt)

    if (cachedCodeObject.status !== RecoverPasswordStatus.VALID)
      throw new AppError('Token inválido', HttpStatus.UNAUTHORIZED)

    const hashedPass = await this.hashService.generateHash(newPasswordDto.password)
    await this.repo.updatePassword(user.id, hashedPass)
    await this.cache.del(jwt)

    return new RecoverPasswordResponse(RecoverPasswordStatus.SUCCESS)
  }

  private generateOneTimeToken(): string {
    const min = 10000
    const max = 99999
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min

    return randomNumber.toString()
  }

  private async getCachedCodeObject(jwt: string): Promise<CachedCodeObject> {
    const cachedCodeObject = await this.cache.get(jwt)
    if (!cachedCodeObject) throw new AppError('Token expirado', HttpStatus.NOT_FOUND)

    return JSON.parse(cachedCodeObject)
  }
}

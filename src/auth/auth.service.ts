import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dtos/create-account';
import { PasswordService } from 'src/auth/password/password.service';
import { JwtService } from 'src/auth/jwt/jwt.service';
import { AuthRepository } from './auth.repository';
import { SiginDto } from './dtos/sign-in';
import { AppError } from 'src/shared/error/AppError';
import { GetRecoverPasswordTokenDto } from './dtos/get-recover-password-token.dto';
import { CacheService } from 'src/shared/cache/cache.service';
import { TokenRecoverPasswordDto } from './dtos/token-recover-password';
import { JwtPayloadDTO } from './dtos/jwt-payload';
import { MailService } from 'src/jobs/mail/mail.service';
import { NewPasswordDto } from './dtos/new-password';
import { TokenObject, TokenStatus } from './enums/token.status';

@Injectable()
export class AuthService {
  constructor(
    private readonly cache: CacheService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly repo: AuthRepository,
    private readonly mailService: MailService
  ) {}

  async createUser(createAccountDTO: CreateAccountDto) {
    const isAlreadyRegistered = await this.repo.searchAccount(
      createAccountDTO.email
    );
    if (isAlreadyRegistered)
      throw new AppError('Email já ccadastrado', HttpStatus.CONFLICT);

    const hashedPass = await this.passwordService.generateHash(
      createAccountDTO.password
    );

    createAccountDTO.password = hashedPass;

    const account = await this.repo.createAccount(createAccountDTO);

    const token = this.jwtService.signToken(
      account.id,
      account.email,
      account.name,
      account.imageUrl
    );

    return token;
  }

  async signIn(signInDTO: SiginDto) {
    const account = await this.repo.searchAccount(signInDTO.email);

    if (!account)
      throw new AppError('Conta não registrada', HttpStatus.NOT_FOUND);

    const isPasswordMatch = await this.passwordService.comparePassword(
      signInDTO.password,
      account.password
    );

    if (!isPasswordMatch)
      throw new AppError('Senha incorreta', HttpStatus.NOT_FOUND);

    const token = this.jwtService.signToken(
      account.id,
      account.email,
      account.name,
      account.imageUrl
    );
    return token;
  }

  async generateRecoverPasswordToken(recoverDto: GetRecoverPasswordTokenDto) {
    const account = await this.repo.finAccountByEmail(recoverDto.email);

    if (!account)
      throw new AppError('Conta não encontrada', HttpStatus.NOT_FOUND);

    const jwt = this.jwtService.signToken(account.id, account.email, '', '');

    const token = this.generateOneTimeToken();

    const tokenObject: TokenObject = {
      token,
      status: TokenStatus.PENDING
    };

    this.mailService.sendMail(
      recoverDto.email,
      'Recuperação de senha',
      `Seu token de recuperação de senha é: ${token}`
    );

    await this.cache.set(`${jwt}`, JSON.stringify(tokenObject), 'EX', 300);

    return { jwt };
  }

  async validateRecoverToken(jwt: string, tokenDto: TokenRecoverPasswordDto) {
    const jwtToken = jwt.split(' ')[1];
    const tokenObject: TokenObject = JSON.parse(await this.cache.get(jwtToken));

    if (!tokenObject)
      throw new AppError('Token inválido', HttpStatus.NOT_FOUND);

    if (tokenObject.token !== tokenDto.token)
      throw new AppError('Token inválido', HttpStatus.NOT_FOUND);

    tokenObject.status = TokenStatus.VALID;

    await this.cache.set(`${jwtToken}`, JSON.stringify(tokenObject), 'EX', 300);

    return { status: tokenObject.status };
  }

  async changePassword(
    user: JwtPayloadDTO,
    jwt: string,
    newPasswordDto: NewPasswordDto
  ) {
    const jwtToken = jwt.split(' ')[1];
    const tokenObject: TokenObject = JSON.parse(await this.cache.get(jwtToken));

    if (!tokenObject)
      throw new AppError('Token inválido', HttpStatus.NOT_FOUND);

    if (tokenObject.status !== TokenStatus.VALID)
      throw new AppError('Token inválido', HttpStatus.NOT_FOUND);

    const hashedPass = await this.passwordService.generateHash(
      newPasswordDto.password
    );

    await this.repo.updatePassword(user.id, hashedPass);

    await this.cache.del(jwtToken);

    return { status: 'success' };
  }

  private generateOneTimeToken(): string {
    const min = 10000;
    const max = 99999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return randomNumber.toString();
  }
}

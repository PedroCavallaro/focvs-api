import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dtos/CreateAccountDto';
import { PasswordService } from 'src/utils/password/password.service';
import { JwtService } from 'src/utils/jwt/jwt.service';
import { AuthRepository } from './auth.repository';
import { SiginDto } from './dtos/SiginDto';
import { AppError } from 'src/shared/error/AppError';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
    private readonly repo: AuthRepository,
  ) {}

  async createUser(createAccountDTO: CreateAccountDto) {
    const isAlreadyRegistered = await this.repo.searchAccount(
      createAccountDTO.email,
    );
    if (isAlreadyRegistered)
      throw new AppError('Email já ccadastrado', HttpStatus.CONFLICT);

    const hashedPass = await this.passwordService.generateHash(
      createAccountDTO.password,
    );

    createAccountDTO.password = hashedPass;

    const account = await this.repo.createAccount(createAccountDTO);

    const token = this.jwtService.signToken(
      account.id,
      account.email,
      account.name,
      account.imageUrl,
    );

    return token;
  }

  async signIn(signInDTO: SiginDto) {
    const account = await this.repo.searchAccount(signInDTO.email);

    if (!account)
      throw new AppError('Conta não registrada', HttpStatus.NOT_FOUND);

    const isPasswordMatch = await this.passwordService.comparePassword(
      signInDTO.password,
      account.password,
    );

    if (!isPasswordMatch)
      throw new AppError('Senha incorreta', HttpStatus.NOT_FOUND);

    const token = this.jwtService.signToken(
      account.id,
      account.email,
      account.name,
      account.imageUrl,
    );
    return token;
  }
}

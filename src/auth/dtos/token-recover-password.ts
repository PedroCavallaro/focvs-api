import { IsNotEmpty } from 'class-validator';

export class TokenRecoverPasswordDto {
  @IsNotEmpty()
  token: number;
}

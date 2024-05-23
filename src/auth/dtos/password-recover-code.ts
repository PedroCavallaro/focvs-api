import { IsNotEmpty } from 'class-validator';

export class PasswordRecoverCodeDto {
  @IsNotEmpty()
  code: number;
}

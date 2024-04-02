import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SiginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8, {
    message: 'password must be at least 8 caracters'
  })
  password: string;
}

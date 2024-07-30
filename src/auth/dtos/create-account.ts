import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator'

export class CreateAccountDto {
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  @MinLength(8, {
    message: 'password must be at least 8 caracters'
  })
  password: string

  @IsOptional()
  imageurl?: string

  @IsNotEmpty()
  @MinLength(3)
  name: string
}

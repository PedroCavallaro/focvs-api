import { IsNotEmpty } from 'class-validator';

export class GetRecoverPasswordTokenDto {
  @IsNotEmpty()
  email: string;
}

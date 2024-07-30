import { IsNotEmpty, IsNumber } from 'class-validator';

export class RecoverPasswordCodeDto {
  @IsNotEmpty()
  @IsNumber()
  code: number;
}

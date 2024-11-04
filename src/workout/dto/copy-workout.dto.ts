import { IsString } from 'class-validator'

export class CopyWorkoutDto {
  @IsString()
  signature: string
}

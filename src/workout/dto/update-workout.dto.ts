import { WorkoutItem } from '@prisma/client'
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator'

export class UpdateWorkouDto {
  @IsNotEmpty()
  id: string

  @IsNotEmpty()
  @IsOptional()
  name?: string

  @IsNotEmpty()
  @IsOptional()
  picture_url?: string

  @IsOptional()
  @IsBoolean()
  public?: boolean

  @IsOptional()
  day?: number

  @IsOptional()
  exercises?: Array<WorkoutItem>
}

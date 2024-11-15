import { IsArray, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator'
import { WorkoutExercises } from './create-workout.dto'

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
  @IsArray()
  deletedSets?: Array<string>

  @IsOptional()
  @IsArray()
  exercises?: Array<WorkoutExercises>
}

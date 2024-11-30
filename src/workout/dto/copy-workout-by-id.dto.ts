import { IsString } from 'class-validator'

export class CopyWorkoutByIdDto {
  @IsString()
  workoutId: string
}

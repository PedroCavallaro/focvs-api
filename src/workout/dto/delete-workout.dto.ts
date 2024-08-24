import { IsNotEmpty } from 'class-validator'

export class DeleteWorkoutDTO {
  @IsNotEmpty()
  workoutId: string
}

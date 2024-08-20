import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator'

export class CreateWorkoutDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  @IsBoolean()
  public: boolean

  @IsNotEmpty()
  day: number

  @IsNotEmpty()
  exercises: Array<WorkoutItem>
}

export class ExerciseSet {
  @IsNotEmpty()
  @IsNumber()
  set_number: number

  @IsNotEmpty()
  @IsNumber()
  reps: number

  @IsNotEmpty()
  @IsNumber()
  weight: number
}

export class WorkoutItem {
  @IsNotEmpty()
  @IsNumber()
  exerciseId: string

  @IsNotEmpty()
  @IsNumber()
  workoutId: string

  @IsNotEmpty()
  sets: ExerciseSet[]
}

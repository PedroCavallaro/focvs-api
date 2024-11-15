import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateWorkoutDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  @IsBoolean()
  public: boolean

  @IsNotEmpty()
  day: number

  @IsNotEmpty()
  exercises: Array<WorkoutExercises>

  signature?: string
}

export class ExerciseSet {
  @IsOptional()
  @IsString()
  id?: string

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

export class WorkoutExercises {
  @IsNotEmpty()
  @IsNumber()
  id: string

  @IsNotEmpty()
  sets: ExerciseSet[]
}

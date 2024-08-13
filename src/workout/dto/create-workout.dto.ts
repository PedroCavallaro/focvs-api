import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateWorkoutDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  public: boolean;

  @IsNotEmpty()
  day: number;

  @IsNotEmpty()
  exercises: Array<PerformedWorkoutItem>;
}

export type PerformedWorkoutItem = {
  exerciseId: string;
  sets: [
    {
      set_number: number;
      reps: number;
      weight: number;
      newReps: number;
      newWeight: number;
      hasImprovements: boolean;
    }
  ];
};

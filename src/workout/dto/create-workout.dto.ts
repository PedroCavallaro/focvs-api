import { IsNotEmpty } from 'class-validator';

export class CreateWorkoutDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  day: number;

  @IsNotEmpty()
  exercises: Array<WorkOutItem>;
}

export type WorkOutItem = {
  exerciseId: string;
  sets: [
    {
      set_number: number;
      reps: number;
      weight: number;
    },
  ];
};

import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWorkoutDto {
  @IsOptional()
  id?: string;

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

import { WorkoutItem } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateWorkouDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  userId: string;

  @IsOptional()
  name: string;

  @IsOptional()
  day: number;

  @IsNotEmpty()
  sets: Array<WorkoutItem>;
}

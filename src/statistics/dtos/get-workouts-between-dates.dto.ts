import { IsNotEmpty } from 'class-validator';

export class GetWorkoutsBetweenDates {
  @IsNotEmpty()
  daysToDecrease: number;
}

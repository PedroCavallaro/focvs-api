import { IsOptional } from 'class-validator';
import { PaginationQueryDTO } from 'src/utils/pagination';

export class PaginatedWorkoutDTO extends PaginationQueryDTO {
  @IsOptional()
  username: string;

  @IsOptional()
  workoutName: string;
}

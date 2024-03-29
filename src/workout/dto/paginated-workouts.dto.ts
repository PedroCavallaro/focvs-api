import { IsOptional } from 'class-validator';
import { PaginationQueryDTO } from 'src/shared/utils/pagination';

export class PaginatedWorkoutDTO extends PaginationQueryDTO {
  @IsOptional()
  username: string;

  @IsOptional()
  workoutName: string;
}

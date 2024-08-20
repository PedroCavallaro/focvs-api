import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDTO } from 'src/utils/pagination';

export class ExerciseQueryDto extends PaginationQueryDTO {
  @IsString()
  @IsOptional()
  name: string;
}

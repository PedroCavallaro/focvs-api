import { Prisma } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDTO } from 'src/utils/pagination';

export class ExerciseQueryDto extends PaginationQueryDTO {
  @IsString()
  @IsOptional()
  name: string;
}

// export interface PrismaExerciseResponse extends Prisma.ExerciseFindManyArgs<{
//    select: {
//     name: string;
//     id: string;
//     description: string;
//     gif_url: string;
//     muscle: {
//         name: string;
//     };
//    }
// }>
import { Module } from '@nestjs/common';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';
import { ExerciseRepository } from './exercise.repository';
import { PrismaService } from 'src/shared/db/prisma.service';

@Module({
  imports: [],
  controllers: [ExerciseController],
  providers: [ExerciseRepository, ExerciseService, PrismaService],
  exports: [ExerciseService],
})
export class ExerciseModule {}

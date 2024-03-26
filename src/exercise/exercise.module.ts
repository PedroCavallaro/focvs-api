import { Module } from '@nestjs/common';
import { ExerciseController } from './exercise.controller';
import { ExerciseService } from './exercise.service';
import { ExerciseRepository } from './exercise.repository';
import { PrismaModule } from 'src/shared/db/prisma.module';
import { CacheModule } from 'src/shared/cache/cache.module';

@Module({
  imports: [PrismaModule, CacheModule],
  controllers: [ExerciseController],
  providers: [ExerciseRepository, ExerciseService],
  exports: [ExerciseService],
})
export class ExerciseModule {}

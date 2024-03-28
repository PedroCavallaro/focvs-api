import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/db/prisma.module';
import { CacheModule } from 'src/shared/cache/cache.module';
import { ExerciseController } from './exercise.controller';
import { ExerciseRepository } from './exercise.repository';
import { ExerciseService } from './exercise.service';

@Module({
  imports: [PrismaModule, CacheModule],
  controllers: [ExerciseController],
  providers: [ExerciseRepository, ExerciseService],
  exports: [ExerciseService],
})
export class ExerciseModule {}

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ExerciseService } from './exercise.service';
import { ExerciseDto } from './dto/exercise.dto';
import { MuscleDto } from './dto/muscle.dto';
import { ExerciseQueryDto } from './dto/get-exercise.dto';

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly service: ExerciseService) {}

  @Get('/muscle')
  async getMuscles() {
    const muscles = await this.service.getMuscles();

    return muscles;
  }

  @Get(':muscleId')
  async getExercises(
    @Param('muscleId') muscleId: string,
    @Query() query: ExerciseQueryDto
  ) {
    const exercises = await this.service.getExercises(muscleId, query);

    return exercises;
  }

  @Post()
  async createExercise(@Body() exercise: ExerciseDto) {
    const exerciseCreated = await this.service.createExercise(exercise);

    return exerciseCreated;
  }

  @Post('/muscle')
  async createMuscle(@Body() muscle: MuscleDto) {
    const muscleCreated = await this.service.createMuscle(muscle);

    return muscleCreated;
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common'
import { ExerciseService } from './exercise.service'
import { ExerciseDto } from './dto/exercise.dto'
import { MuscleDto } from './dto/muscle.dto'
import { Public } from '@PedroCavallaro/focvs-utils'

@Controller('exercise')
export class ExerciseController {
  constructor(private readonly service: ExerciseService) {}

  @Get()
  async getExercises() {
    const exercises = await this.service.getExercises()

    return exercises
  }

  @Get('/muscle')
  @Public()
  async getMuscles() {
    const muscles = await this.service.getMuscles()

    return muscles
  }

  @Post()
  @Public()
  async createExercise(@Body() exercise: ExerciseDto) {
    const exerciseCreated = await this.service.createExercise(exercise)

    return exerciseCreated
  }

  @Post('/muscle')
  @Public()
  async createMuscle(@Body() muscle: MuscleDto) {
    const muscleCreated = await this.service.createMuscle(muscle)

    return muscleCreated
  }
}

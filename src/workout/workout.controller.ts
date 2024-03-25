import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { Public } from 'src/auth/guards/decorators/public.decorator';
import { CreateWorkoutDto } from './dto/create-workout.dto';

@Controller('workout')
export class WorkoutController {
  constructor(private readonly service: WorkoutService) {}

  @Post('new')
  @Public()
  async createWorkout(@Body() workoutDto: CreateWorkoutDto) {
    const workout = await this.service.createWorkout(workoutDto);

    return workout;
  }

  @Get(':id')
  @Public()
  async getUserWorkouts(@Param('id') id: string) {
    const userWorkout = await this.service.getUserWorkouts(id);

    return userWorkout;
  }

  @Get()
  @Public()
  async listAll() {
    return await this.service.listAll();
  }
}

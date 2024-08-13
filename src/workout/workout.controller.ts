import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkouDto } from './dto/update-workout.dto';
import { PaginatedWorkoutDTO } from './dto';
import { JwtPayloadDTO } from 'src/auth/dtos/jwt-payload';
import { DeleteWorkoutDTO } from './dto/delete-workout.dto';
import { Public, AuthUser } from '@pedrocavallaro/focvs-utils';

@Controller('workout')
export class WorkoutController {
  constructor(private readonly service: WorkoutService) {}

  @Post('new')
  async createWorkout(
    @AuthUser() user: JwtPayloadDTO,
    @Body() workoutDto: CreateWorkoutDto
  ) {
    const workout = await this.service.createWorkout(user.id, workoutDto);

    return workout;
  }

  @Get()
  async getUserWorkouts(@AuthUser() user: JwtPayloadDTO) {
    const userWorkout = await this.service.getUserWorkouts(user.id);

    return userWorkout;
  }

  @Get(':workoutId')
  async getWorkout(@Param('workoutId') workoutId: string) {
    const workout = await this.service.getWorkout(workoutId);

    return workout;
  }

  @Get()
  @Public()
  async listAll() {
    return await this.service.listAll();
  }

  @Get('search/paginate')
  @Public()
  async searchPaginated(@Query() q: PaginatedWorkoutDTO) {
    return await this.service.searchPaginated(q);
  }

  @Put()
  async updateWorkout(updateWorkoutDto: UpdateWorkouDto) {
    const updatedWorkout = await this.service.updateWorkout(updateWorkoutDto);

    return updatedWorkout;
  }

  @Delete()
  @Public()
  async deleteUserWorkouts(
    @AuthUser() user: JwtPayloadDTO,
    { workoutId }: DeleteWorkoutDTO
  ) {
    return await this.service.deleteWorkout(user.id, workoutId);
  }
  @Delete('performed')
  @Public()
  delteWorkouts() {
    // return this.service.deltePermormed();
  }
}

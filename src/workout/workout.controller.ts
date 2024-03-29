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
import { Public } from 'src/auth/guards/decorators/public.decorator';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkouDto } from './dto/update-workout.dto';
import { PaginatedWorkoutDTO, PerformedWorkoutDto } from './dto';
import { AuthUser } from 'src/auth/guards/decorators';
import { JwtPayloadDTO } from 'src/auth/dtos/jwt-payload';
import { DeleteWorkoutDTO } from './dto/delete-workout.dto';

@Controller('workout')
export class WorkoutController {
  constructor(private readonly service: WorkoutService) {}

  @Post('new')
  @Public()
  async createWorkout(@Body() workoutDto: CreateWorkoutDto) {
    const workout = await this.service.createWorkout(workoutDto);

    return workout;
  }

  @Post('new/performed')
  async savePerformedWorkout(
    @Body() performedWorkoutDto: PerformedWorkoutDto,
    @AuthUser() user: JwtPayloadDTO
  ) {
    const performedWorkout = await this.service.savePerformed(
      user.id,
      performedWorkoutDto
    );

    return performedWorkout;
  }

  @Get(':id')
  @Public()
  async getUserWorkouts(@Param('id') id: string) {
    const userWorkout = await this.service.getUserWorkouts(id);

    return userWorkout;
  }
  @Get('performed/:id')
  @Public()
  async listPerformedWorkouts(@Param('id') id: string) {
    return await this.service.listPerformedWorkouts(id);
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
    return this.service.deltePermormed();
  }
}

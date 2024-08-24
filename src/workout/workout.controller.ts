import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { WorkoutService } from './workout.service'
import { CreateWorkoutDto } from './dto/create-workout.dto'
import { UpdateWorkouDto } from './dto/update-workout.dto'
import { JwtPayloadDTO } from 'src/auth/dtos/jwt-payload'
import { AuthUser } from '@pedrocavallaro/focvs-utils'
import { PaginationQueryDTO } from 'src/utils/pagination'

@Controller('workout')
export class WorkoutController {
  constructor(private readonly service: WorkoutService) {}

  @Post('')
  async createWorkout(@AuthUser() user: JwtPayloadDTO, @Body() workoutDto: CreateWorkoutDto) {
    const workout = await this.service.createWorkout(user.id, workoutDto)

    return workout
  }

  @Get()
  async getUserWorkouts(@AuthUser() user: JwtPayloadDTO) {
    const workouts = await this.service.getUserWorkouts(user.id)

    return workouts
  }

  @Get('today')
  async getWorkoutOfTheDay(@AuthUser() user: JwtPayloadDTO) {
    const workout = await this.service.getWorkoutOfTheDay(user.id)

    return workout
  }

  @Get('search')
  async searchPaginated(@Query() query: PaginationQueryDTO) {
    return await this.service.searchPaginated(query)
  }

  @Get(':workoutId')
  async getWorkout(@AuthUser() user: JwtPayloadDTO, @Param('workoutId') workoutId: string) {
    const workout = await this.service.getFullWorkoutById(workoutId, user.id)
    return workout
  }

  @Patch()
  async updateWorkout(@AuthUser() user: JwtPayloadDTO, @Body() updateWorkoutDto: UpdateWorkouDto) {
    const updatedWorkout = await this.service.updateWorkout(user.id, updateWorkoutDto)

    return updatedWorkout
  }

  @Delete(':id')
  async deleteUserWorkout(@AuthUser() user: JwtPayloadDTO, @Param('id') workoutId: string) {
    return await this.service.deleteWorkout(user.id, workoutId)
  }
}

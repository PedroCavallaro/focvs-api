import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { WorkoutService } from './workout.service'
import { CreateWorkoutDto } from './dto/create-workout.dto'
import { UpdateWorkouDto } from './dto/update-workout.dto'
import { PaginatedWorkoutDTO } from './dto'
import { JwtPayloadDTO } from 'src/auth/dtos/jwt-payload'
import { Public, AuthUser } from '@pedrocavallaro/focvs-utils'

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

  @Get('user/:id')
  async getSingleUserWorkout(@AuthUser() user: JwtPayloadDTO, @Param('id') id: string) {
    const workouts = await this.service.getSingleUserWorkout(user.id, id)

    return workouts
  }

  @Get(':workoutId')
  async getWorkout(@AuthUser() user: JwtPayloadDTO, @Param('workoutId') workoutId: string) {
    const workout = await this.service.getFullWorkoutById(workoutId)
    return workout
  }

  @Get('search')
  @Public()
  async searchPaginated(@AuthUser() user: JwtPayloadDTO, @Query() q: PaginatedWorkoutDTO) {
    return await this.service.searchPaginated(q)
  }

  @Put()
  async updateWorkout(@AuthUser() user: JwtPayloadDTO, @Body() updateWorkoutDto: UpdateWorkouDto) {
    const updatedWorkout = await this.service.updateWorkout(updateWorkoutDto)

    return updatedWorkout
  }

  @Delete(':id')
  async deleteUserWorkout(@AuthUser() user: JwtPayloadDTO, @Param('id') workoutId: string) {
    return await this.service.deleteWorkout(user.id, workoutId)
  }
}

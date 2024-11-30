import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { WorkoutService } from './workout.service'
import { AuthUser, JwtPayloadDTO } from '@pedrocavallaro/focvs-utils'
import { PaginationQueryDTO } from 'src/utils/pagination'
import { CopyWorkoutDto, CreateWorkoutDto, UpdateWorkouDto } from './dto'
import { CopyWorkoutByIdDto } from './dto/copy-workout-by-id.dto'

@Controller('workout')
export class WorkoutController {
  constructor(private readonly service: WorkoutService) {}

  @Post('')
  async createWorkout(@AuthUser() user: JwtPayloadDTO, @Body() createWorkoutDto: CreateWorkoutDto) {
    const workout = await this.service.createWorkout(user.id, createWorkoutDto)

    return workout
  }

  @Post('link/:link')
  async copyWorkoutToAccount(
    @AuthUser() user: JwtPayloadDTO,
    @Body() copyWorkoutDto: CopyWorkoutDto
  ) {
    const workout = await this.service.copyWorkoutToAccount(user.id, copyWorkoutDto)

    return workout
  }

  @Post('copy')
  async copyWorkoutToAccountById(
    @AuthUser() user: JwtPayloadDTO,
    @Body() copyWorkoutDto: CopyWorkoutByIdDto
  ) {
    const workout = await this.service.copyWorkoutToAccountById(user.id, copyWorkoutDto)

    return workout
  }

  @Get()
  async getUserWorkouts(@AuthUser() user: JwtPayloadDTO) {
    const workouts = await this.service.getUserWorkouts(user.id)

    return workouts
  }

  @Get('link/:link')
  async getWorkoutDetailsByShareLink(@AuthUser() user: JwtPayloadDTO, @Param('link') link: string) {
    const workout = await this.service.getWorkoutDetailsByShareLink(link)

    return { ...workout, isFromSameUser: user.id === workout.user.id }
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

  @Get('/:workoutId')
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

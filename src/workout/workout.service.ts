import { HttpStatus, Injectable } from '@nestjs/common'
import { WorkoutRepository } from './workout.repository'
import { CreateWorkoutDto } from './dto/create-workout.dto'
import { PrismaWorkoutDTO, UpdateWorkouDto } from './dto'
import { PaginationQueryDTO, parsePagination } from 'src/utils/pagination'
import { WorkoutItemResponse, WorkoutResponseDTO } from './dto/workout-response.dto'
import { AppError } from '@pedrocavallaro/focvs-utils'

@Injectable()
export class WorkoutService {
  constructor(private readonly repo: WorkoutRepository) {}

  async createWorkout(userId: string, workoutDto: CreateWorkoutDto) {
    const workout = await this.repo.saveWorkout(userId, workoutDto)

    return workout
  }

  async getUserWorkouts(userId: string) {
    const workouts = await this.repo.getUserWokouts(userId)

    const res = workouts.map((workout) => this.parseWorkoutReponse(workout))

    return res
  }

  async searchPaginated(q: PaginationQueryDTO) {
    const [workouts, count] = await this.repo.searchPaginated(q)

    const res = workouts.map((workout) => this.parseWorkoutReponse(workout))

    return parsePagination(res, q, count)
  }

  async getWorkoutOfTheDay(userId: string) {
    const workout = await this.repo.get({ userId, day: new Date().getDay() })

    return this.parseWorkoutReponse(workout)
  }

  async getSingleUserWorkout(userId: string, workoutId: string) {
    const workout = await this.repo.get({ userId, id: workoutId })

    return this.parseWorkoutReponse(workout)
  }

  async updateWorkout(userId: string, updateWorkoutDto: UpdateWorkouDto) {
    const workout = await this.repo.get({ userId, id: updateWorkoutDto.id })

    if (!workout) {
      throw new AppError('Unauthorized', HttpStatus.FORBIDDEN)
    }

    const updatedWorkout = await this.repo.updateWorkout(updateWorkoutDto)

    return updatedWorkout
  }

  async getFullWorkoutById(workoutId: string, userId: string) {
    const workout = await this.repo.get({ id: workoutId })

    if (!workout.public && userId !== workout.userId) {
      throw new AppError('Workout not found', HttpStatus.NOT_FOUND)
    }

    return this.parseWorkoutReponse(workout)
  }

  async deleteWorkout(userId: string, workoutId: string) {
    const workout = await this.repo.get({ userId, id: workoutId })

    if (!workout) {
      throw new AppError('Workout not found', HttpStatus.NOT_FOUND)
    }

    if (workout.userId !== userId) {
      throw new AppError('User does not have permission', HttpStatus.UNAUTHORIZED)
    }

    return await this.repo.deleteWorkout(userId, workoutId)
  }

  private parseWorkoutReponse(workout: PrismaWorkoutDTO): WorkoutResponseDTO {
    const exercises: WorkoutResponseDTO['exercises'] = []

    const buildedExercises: Record<string, number> = {}

    if (!workout) {
      return {} as WorkoutResponseDTO
    }

    if (!workout?.workoutItem) {
      return {
        ...workout,
        exerciseAmount: 0,
        exercises: []
      }
    }

    let exerciseAmount = 0

    for (const item of workout.workoutItem) {
      if (buildedExercises[item.exercise.id]) {
        continue
      }

      exerciseAmount++

      const exercise = {
        sets: []
      } as WorkoutItemResponse

      const relatedItems = workout.workoutItem.filter((i) => i.exercise.id === item.exercise.id)

      const sets = []

      relatedItems.map((set) =>
        sets.push({
          set_number: set.set_number,
          reps: set.reps,
          weight: set.weight
        })
      )

      exercises.push({
        exerciseId: item.exercise.id,
        gif_url: item.exercise.gif_url,
        name: item.exercise.name,
        sets: [...exercise.sets, ...sets]
      })

      buildedExercises[item.exercise.id] = 1
    }

    return {
      ...workout,
      exercises,
      exerciseAmount
    }
  }
}

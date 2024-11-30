import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import { WorkoutRepository } from './workout.repository'
import { CreateWorkoutDto } from './dto/create-workout.dto'
import { CopyWorkoutDto, PrismaWorkoutDTO, UpdateWorkouDto } from './dto'
import { PaginationQueryDTO, parsePagination } from 'src/utils/pagination'
import { WorkoutResponseDTO } from './dto/workout-response.dto'
import { AppError, ForbiddenError } from '@pedrocavallaro/focvs-utils'
import { HashService } from 'src/shared/services/hash/hash.service'
import { ClientProxy } from '@nestjs/microservices'
import { randomUUID } from 'node:crypto'

@Injectable()
export class WorkoutService {
  constructor(
    @Inject('IMAGES_SERVICE') private readonly imageService: ClientProxy,
    private readonly repo: WorkoutRepository,
    private readonly hashService: HashService
  ) {}

  async createWorkout(userId: string, workoutDto: CreateWorkoutDto) {
    const signature = randomUUID()

    const { workout, muscles } = await this.repo.saveWorkout(userId, { ...workoutDto, signature })

    this.imageService.emit('workout_created', {
      workoutId: workout.id,
      muscles: muscles.map((e) => e.name)
    })

    return workout
  }

  async copyWorkoutToAccount(userId: string, copyWorokoutDto: CopyWorkoutDto) {
    const userWorkouts = await this.repo.count({ signature: copyWorokoutDto.signature, userId })

    if (userWorkouts >= 1) {
      throw new ForbiddenError('Esse treino já está copiado na sua conta')
    }

    const workout = await this.repo.get({ signature: copyWorokoutDto.signature })

    const res = await this.repo.saveCopied(userId, workout)

    return res
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

  async getWorkoutDetailsByShareLink(link: string) {
    const workout = await this.repo.get({ signature: link })

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

    const updatedWorkout = await Promise.all([
      this.repo.updateWorkout(updateWorkoutDto),
      this.repo.upsertWorkoutSets(updateWorkoutDto)
    ])

    if (updateWorkoutDto.deletedSets) {
      await this.repo.deleteManySets(updateWorkoutDto.deletedSets)
    }

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

      const relatedItems = workout.workoutItem.filter((i) => i.exercise.id === item.exercise.id)

      const sets = []

      relatedItems.map((set) =>
        sets.push({
          id: set.id,
          set_number: set.set_number,
          done: false,
          reps: set.reps,
          weight: set.weight
        })
      )

      exercises.push({
        id: item.exercise.id,
        gif_url: item.exercise.gif_url,
        name: item.exercise.name,
        sets
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

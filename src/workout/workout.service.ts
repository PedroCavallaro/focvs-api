import { Injectable } from '@nestjs/common'
import { WorkoutRepository } from './workout.repository'
import { CreateWorkoutDto } from './dto/create-workout.dto'
import { PaginatedWorkoutDTO, PrismaWorkoutDTO, UpdateWorkouDto } from './dto'
import { parsePagination } from 'src/utils/pagination'
import {
  WorkoutDetailsDTO,
  WorkoutItemResponse,
  WorkoutResponseDTO
} from './dto/workout-response.dto'
import { Workout } from '@prisma/client'

@Injectable()
export class WorkoutService {
  constructor(private readonly repo: WorkoutRepository) {}

  async createWorkout(userId: string, workoutDto: CreateWorkoutDto) {
    const workout = await this.repo.saveWorkout(userId, workoutDto)

    return workout
  }

  async getUserWorkouts(userId: string) {
    const workouts = await this.repo.getUserWokouts(userId)

    const res = workouts.map((workout) => this.getExerciseAmount(workout))

    return res
  }

  async searchPaginated(q: PaginatedWorkoutDTO) {
    const [workouts, count] = await this.repo.searchPaginated(q)

    return parsePagination(workouts, q, count)
  }

  async getWorkoutOfTheDay(userId: string) {
    const workout = await this.repo.get({ userId, day: new Date().getDay() })

    return this.parseWorkoutReponse(workout)
  }

  async getSingleUserWorkout(userId: string, workoutId: string) {
    const workout = await this.repo.get({ userId, id: workoutId })

    return this.parseWorkoutReponse(workout)
  }

  async updateWorkout(updateWorkoutDto: UpdateWorkouDto) {
    const updatedWorkout = await this.repo.updateWorkout(updateWorkoutDto)

    return updatedWorkout
  }

  async listAll() {
    return await this.repo.listAll()
  }

  async deleteWorkout(userId: string, workoutId: string) {
    return await this.repo.deleteWorkout(userId, workoutId)
  }

  private getExerciseAmount(
    workout: Workout & { workoutItem: Array<{ exerciseId: string }> }
  ): WorkoutDetailsDTO {
    if (!workout?.workoutItem) return { ...workout, exerciseAmount: 0 }

    const exerciseIds: Record<string, boolean> = {}
    let count = 0

    for (const { exerciseId } of workout.workoutItem) {
      if (!exerciseIds[exerciseId]) {
        exerciseIds[exerciseId] = true

        count++
      }
    }

    return { ...workout, exerciseAmount: count }
  }

  private parseWorkoutReponse(workout: PrismaWorkoutDTO): WorkoutResponseDTO {
    const exercises: WorkoutResponseDTO['exercises'] = []

    const buildedExercises: Record<string, number> = {}

    if (!workout) {
      return {} as WorkoutResponseDTO
    }

    if (!workout?.workoutItem) {
      return {
        id: workout.id,
        name: workout.name,
        day: workout.day,
        public: workout.public,
        exercises: []
      }
    }

    for (const item of workout.workoutItem) {
      if (buildedExercises[item.exercise.id]) {
        continue
      }

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
      id: workout.id,
      name: workout.name,
      day: workout.day,
      public: workout.public,
      exercises
    }
  }
}

import { Injectable } from '@nestjs/common';
import { WorkoutRepository } from './workout.repository';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { PaginatedWorkoutDTO, PrismaWorkoutDTO, UpdateWorkouDto } from './dto';
import { parsePagination } from 'src/utils/pagination';
import {
  WorkoutItemResponse,
  WorkoutResponseDTO
} from './dto/workout-response.dto';

@Injectable()
export class WorkoutService {
  constructor(private readonly repo: WorkoutRepository) {}

  async createWorkout(userId: string, workoutDto: CreateWorkoutDto) {
    const workout = await this.repo.saveWorkout(userId, workoutDto);

    return workout;
  }
  async searchPaginated(q: PaginatedWorkoutDTO) {
    const [workouts, count] = await this.repo.searchPaginated(q);

    return parsePagination(workouts, q, count);
  }

  async getWorkoutOfTheDay(userId: string) {
    const workout = await this.repo.getWorkoutOfTheDay(userId);

    return this.parseWorkoutReponse(workout);
  }

  async updateWorkout(updateWorkoutDto: UpdateWorkouDto) {
    const updatedWorkout = await this.repo.updateWorkout(updateWorkoutDto);

    return updatedWorkout;
  }

  async listAll() {
    return await this.repo.listAll();
  }

  async deleteWorkout(userId: string, workoutId: string) {
    return await this.repo.deleteWorkout(userId, workoutId);
  }

  private parseWorkoutReponse(workout: PrismaWorkoutDTO): WorkoutResponseDTO {
    const exercises: WorkoutResponseDTO['exercises'] = [];

    const buildedExercises: Record<string, number> = {};

    for (const item of workout.workoutItem) {
      if (buildedExercises?.[item.exercise.id]) {
        continue;
      }

      const exercise = {
        sets: []
      } as WorkoutItemResponse;

      const relatedItems = workout.workoutItem.filter(
        (i) => i.exercise.id === item.exercise.id
      );

      const sets = [];

      relatedItems.map((set) =>
        sets.push({
          set_number: set.set_number,
          reps: set.reps,
          weight: set.weight
        })
      );

      exercises.push({
        exerciseId: item.exercise.id,
        gif_url: item.exercise.gif_url,
        name: item.exercise.name,
        sets: [...exercise.sets, ...sets]
      });

      buildedExercises[item.exercise.id] = 1;
    }

    return {
      id: workout.id,
      name: workout.name,
      day: workout.day,
      public: workout.public,
      exercises
    };
  }
}

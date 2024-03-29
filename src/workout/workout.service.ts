import { Injectable } from '@nestjs/common';
import { WorkoutRepository } from './workout.repository';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import {
  PaginatedWorkoutDTO,
  PerformedWorkoutDto,
  PrismaWorkoutDTO
} from './dto';
import { MongoWorkoutRepository } from './workout.mongo.repository';
import { parsePagination } from 'src/shared/utils/pagination';

@Injectable()
export class WorkoutService {
  constructor(
    private readonly repo: WorkoutRepository,
    private readonly mongoRepo: MongoWorkoutRepository
  ) {}

  async createWorkout(workoutDto: CreateWorkoutDto) {
    const workout = await this.repo.saveWorkout(workoutDto);

    return workout;
  }
  async searchPaginated(q: PaginatedWorkoutDTO) {
    const [workouts, count] = await this.repo.searchPaginated(q);

    return parsePagination(workouts, q, count);
  }
  async listPerformedWorkouts(id: string) {
    return await this.mongoRepo.listPerformedWorkouts(id);
  }
  deltePermormed() {
    return this.mongoRepo.deleteWorkouts();
  }
  async savePerformed(id: string, performedWorkoutDto: PerformedWorkoutDto) {
    const performedWorkout = await this.mongoRepo.savePerformed(
      id,
      performedWorkoutDto
    );

    return performedWorkout;
  }

  async updateWorkout(updateWorkoutDto) {
    const updatedWorkout = await this.repo.updateWorkout(updateWorkoutDto);

    return updatedWorkout;
  }

  async getUserWorkouts(id: string) {
    const workouts = await this.repo.getUserWokouts(id);

    return this.transformeArray(workouts);
  }

  async getWorkout(workoutId: string) {
    const workout = await this.repo.getWorkout(workoutId);

    return this.transformeArray([workout]);
  }

  async listAll() {
    return await this.repo.listAll();
  }

  async deleteWorkout(userId: string, workoutId: string) {
    return await this.repo.deleteWorkout(userId, workoutId);
  }

  private transformeArray(array: PrismaWorkoutDTO[]) {
    return array.map((item) => ({
      id: item.id,
      name: item.name,
      day: item.day,
      userId: item.userId,
      exercises: item.workoutItem.reduce(
        (
          acc: {
            name: string;
            sets: { reps: number; weight: number; set_number: number }[];
          }[],
          currentItem
        ) => {
          const existingExerciseIndex = acc.findIndex(
            (exercise) => exercise.name === currentItem.exercise.name
          );
          if (existingExerciseIndex !== -1) {
            acc[existingExerciseIndex].sets.push({
              set_number: currentItem.set_number,
              reps: currentItem.reps,
              weight: currentItem.weight
            });
          } else {
            acc.push({
              name: currentItem.exercise.name,
              sets: [
                {
                  set_number: currentItem.set_number,
                  reps: currentItem.reps,
                  weight: currentItem.weight
                }
              ]
            });
          }
          return acc;
        },
        []
      )
    }));
  }
}

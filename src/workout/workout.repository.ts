import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/db/prisma.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';

@Injectable()
export class WorkoutRepository {
  constructor(private readonly prisma: PrismaService) {}

  updateWorkout(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteWorkout(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async saveWorkout(workoutDto: CreateWorkoutDto) {
    try {
      const workout = await this.prisma.workout.create({
        data: {
          name: workoutDto.name,
          day: workoutDto.day,
          userId: workoutDto.userId,
        },
      });

      workoutDto.exercises.map((e) => {
        e.sets.map(async (s) => {
          await this.prisma.workoutItem.create({
            data: {
              reps: s.reps,
              weight: s.weight,
              set_number: s.set_number,
              exerciseId: e.exerciseId,
              workoutId: workout.id,
            },
          });
        });
      });

      return workout;
    } catch (error) {
      PrismaService.handleError(error);
    }
  }
  async getUserWokouts(userId: string) {
    const workout = await this.prisma.workout.findMany({
      where: {
        userId,
      },
      include: {
        workoutItem: {
          select: {
            exercise: {
              select: {
                name: true,
              },
            },
            set_number: true,
            reps: true,
            weight: true,
          },
          orderBy: {
            set_number: 'asc',
          },
        },
      },
    });

    return workout;
  }

  async listAll() {
    try {
      const workout = await this.prisma.workout.findMany();
      const sets = await this.prisma.workoutItem.findMany();

      return {
        workout,
        sets,
      };
    } catch (error) {
      PrismaService.handleError(error);
    }
  }
}

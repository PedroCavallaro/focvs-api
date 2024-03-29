import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/db/prisma.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkouDto } from './dto/update-workout.dto';
import { Prisma, Workout } from '@prisma/client';
import { PaginatedWorkoutDTO } from './dto/paginated-workouts.dto';

@Injectable()
export class WorkoutRepository {
  private readonly workoutInclude = {
    workoutItem: {
      select: {
        exercise: {
          select: {
            name: true
          }
        },
        set_number: true,
        reps: true,
        weight: true
      },
      orderBy: {
        set_number: 'asc'
      }
    }
  } satisfies Prisma.WorkoutInclude;

  constructor(private readonly prisma: PrismaService) {}

  async searchPaginated(q: PaginatedWorkoutDTO) {
    try {
      const params = {
        skip: (Number(q.page) - 1) * Number(q.limit),
        take: Number(q.limit)
      };

      const cond = {
        NOT: {
          public: false
        },
        OR: [
          {
            name: {
              contains: q.workoutName
            }
          },
          {
            user: {
              name: {
                contains: q.username
              }
            }
          }
        ]
      } satisfies Prisma.WorkoutWhereInput;

      return await this.prisma.$transaction([
        this.prisma.workout.findMany({
          where: {
            ...cond
          },
          ...params
        }),
        this.prisma.workout.count({
          where: {
            ...cond
          }
        })
      ]);
    } catch (error) {
      PrismaService.handleError(error);
    }
  }

  async updateWorkout(updateWorkoutDto: UpdateWorkouDto) {
    try {
      const update = await this.prisma.workout.update({
        where: {
          id: updateWorkoutDto.id
        },
        data: {
          day: updateWorkoutDto.day,
          name: updateWorkoutDto.name
        }
      });
      return update;
    } catch (error) {
      PrismaService.handleError(error);
    }
  }
  async updateWorkoutSets(updateWorkouDto: UpdateWorkouDto) {
    try {
      for (const set of updateWorkouDto.sets) {
        await this.prisma.workoutItem.update({
          where: {
            id: set.id
          },
          data: {
            exerciseId: set.exerciseId,
            reps: set.reps,
            weight: set.weight,
            workoutId: set.workoutId
          }
        });
      }
    } catch (error) {
      PrismaService.handleError(error);
    }
  }

  async deleteWorkout(userId: string, workoutId: string) {
    try {
      return await this.prisma.workout.deleteMany({
        where: {
          id: workoutId,
          AND: {
            userId
          }
        }
      });
    } catch (error) {
      PrismaService.handleError(error);
    }
  }
  async saveWorkout(workoutDto: CreateWorkoutDto): Promise<Workout> {
    try {
      const workout = await this.prisma.workout.create({
        data: {
          name: workoutDto.name,
          day: workoutDto.day,
          public: workoutDto.public,
          userId: workoutDto.userId
        }
      });

      workoutDto.exercises.map((e) => {
        e.sets.map(async (s) => {
          await this.prisma.workoutItem.create({
            data: {
              reps: s.reps,
              weight: s.weight,
              set_number: s.set_number,
              exerciseId: e.exerciseId,
              workoutId: workout.id
            }
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
        userId
      },
      include: this.workoutInclude
    });

    return workout;
  }

  async getWorkout(workoutId: string) {
    try {
      const workout = await this.prisma.workout.findFirstOrThrow({
        where: {
          AND: [{ id: workoutId }, { public: true }]
        },
        include: this.workoutInclude
      });

      return workout;
    } catch (error) {
      PrismaService.handleError(error);
    }
  }

  async listAll() {
    try {
      const workout = await this.prisma.workout.findMany();
      const sets = await this.prisma.workoutItem.findMany();

      return {
        workout,
        sets
      };
    } catch (error) {
      PrismaService.handleError(error);
    }
  }
}

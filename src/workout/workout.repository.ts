import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/db/prisma.service'
import { Prisma, Workout, WorkoutItem } from '@prisma/client'
import { buildPaginationParams, PaginationQueryDTO } from 'src/utils/pagination'
import { UpdateWorkouDto, CreateWorkoutDto } from './dto'

@Injectable()
export class WorkoutRepository {
  private readonly workoutInclude = {
    user: {
      select: {
        name: true,
        image_url: true
      }
    },
    workoutItem: {
      select: {
        exerciseId: true,
        exercise: {
          select: {
            id: true,
            gif_url: true,
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
  } satisfies Prisma.WorkoutInclude

  constructor(private readonly prisma: PrismaService) {}

  async searchPaginated(q: PaginationQueryDTO) {
    try {
      const cond = {
        NOT: {
          public: false
        },
        OR: [
          {
            name: {
              contains: q.q
            }
          },
          {
            user: {
              name: {
                contains: q.q
              }
            }
          }
        ]
      } satisfies Prisma.WorkoutWhereInput

      return await this.prisma.$transaction([
        this.prisma.workout.findMany({
          where: {
            ...cond
          },
          include: {
            ...this.workoutInclude
          },
          ...buildPaginationParams(q)
        }),
        this.prisma.workout.count({
          where: {
            ...cond
          }
        })
      ])
    } catch (error) {
      PrismaService.handleError(error)
    }
  }

  async get(where?: Prisma.WorkoutWhereInput) {
    try {
      const workout = await this.prisma.workout.findFirst({
        where,
        include: {
          ...this.workoutInclude
        }
      })
      console.log(workout)

      return workout
    } catch (error) {
      PrismaService.handleError(error)
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
          name: updateWorkoutDto.name,
          public: updateWorkoutDto.public,
          picture_url: updateWorkoutDto.picture_url
        }
      })
      return update
    } catch (error) {
      PrismaService.handleError(error)
    }
  }
  async updateWorkoutSets(updateWorkouDto: UpdateWorkouDto) {
    try {
      for (const set of updateWorkouDto.exercises) {
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
        })
      }
    } catch (error) {
      PrismaService.handleError(error)
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
      })
    } catch (error) {
      PrismaService.handleError(error)
    }
  }

  async saveWorkout(userId: string, workoutDto: CreateWorkoutDto): Promise<Workout> {
    try {
      return await this.prisma.$transaction(async () => {
        const workout = await this.prisma.workout.create({
          data: {
            name: workoutDto.name,
            day: workoutDto.day,
            public: workoutDto.public,
            userId: userId
          }
        })

        const workoutItemsToCreate: Omit<WorkoutItem, 'id'>[] = []

        for (const { sets, exerciseId } of workoutDto.exercises) {
          for (const { ...s } of sets) {
            workoutItemsToCreate.push({
              ...s,
              exerciseId,
              workoutId: workout.id
            })
          }
        }

        await this.prisma.workoutItem.createMany({
          data: workoutItemsToCreate
        })

        return workout
      })
    } catch (error) {
      PrismaService.handleError(error)
    }
  }
  async getUserWokouts(userId: string) {
    const workout = await this.prisma.workout.findMany({
      where: {
        userId
      },
      include: {
        ...this.workoutInclude
      }
    })
    return workout
  }

  async getWorkout(workoutId: string) {
    try {
      const workout = await this.prisma.workout.findFirstOrThrow({
        where: {
          AND: [{ id: workoutId }, { public: true }]
        },
        include: this.workoutInclude
      })

      return workout
    } catch (error) {
      PrismaService.handleError(error)
    }
  }
}

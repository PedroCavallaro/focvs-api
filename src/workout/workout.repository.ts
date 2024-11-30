import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/db/prisma.service'
import { Muscle, Prisma, Workout, WorkoutItem } from '@prisma/client'
import { buildPaginationParams, PaginationQueryDTO } from 'src/utils/pagination'
import { UpdateWorkouDto, CreateWorkoutDto, PrismaWorkoutDTO } from './dto'
import { randomUUID } from 'node:crypto'

@Injectable()
export class WorkoutRepository {
  private readonly workoutInclude = {
    user: {
      select: {
        id: true,
        name: true,
        image_url: true
      }
    },
    workoutItem: {
      select: {
        id: true,
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

  async deleteManySets(sets: string[]) {
    try {
      return await this.prisma.workoutItem.deleteMany({
        where: {
          id: {
            in: sets
          }
        }
      })
    } catch (error) {
      PrismaService.handleError(error)
    }
  }

  async get(where?: Prisma.WorkoutWhereInput): Promise<PrismaWorkoutDTO> {
    try {
      const workout = await this.prisma.workout.findFirst({
        where,
        include: {
          ...this.workoutInclude
        }
      })

      return workout
    } catch (error) {
      PrismaService.handleError(error)
    }
  }

  async count(where?: Prisma.WorkoutWhereInput) {
    try {
      const count = await this.prisma.workout.count({
        where
      })

      return count
    } catch (error) {
      PrismaService.handleError(error)
    }
  }

  async getMany(where?: Prisma.WorkoutWhereInput): Promise<PrismaWorkoutDTO[]> {
    try {
      const workout = await this.prisma.workout.findMany({
        where,
        include: {
          ...this.workoutInclude
        }
      })

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
  async upsertWorkoutSets(updateWorkouDto: UpdateWorkouDto) {
    try {
      if (!updateWorkouDto?.exercises) {
        return
      }

      console.log('oi')
      const setsToUpdate = []

      for (const exercise of updateWorkouDto.exercises) {
        for (const set of exercise.sets) {
          setsToUpdate.push(
            this.prisma.workoutItem.upsert({
              where: {
                id: set?.id ?? randomUUID()
              },
              update: {
                workoutId: updateWorkouDto.id,
                exerciseId: exercise.id,
                reps: set.reps,
                weight: set.weight,
                set_number: set.set_number
              },
              create: {
                workoutId: updateWorkouDto.id,
                exerciseId: exercise.id,
                reps: set.reps,
                set_number: set.set_number,
                weight: set.weight
              }
            })
          )
        }

        await Promise.all(setsToUpdate)
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

  async saveCopied(userId: string, workout: PrismaWorkoutDTO) {
    try {
      return await this.prisma.$transaction(async () => {
        const savedWorkout = await this.prisma.workout.create({
          data: {
            name: workout.name,
            day: workout.day,
            signature: workout.signature,
            public: workout.public,
            userId: userId,
            picture_url: workout.picture_url,
            copied: true
          }
        })

        const workoutItemsToCreate: Omit<WorkoutItem, 'id'>[] = []

        for (const workoutItem of workout.workoutItem) {
          workoutItemsToCreate.push({
            reps: 1,
            set_number: workoutItem.set_number,
            weight: 1,
            exerciseId: workoutItem.exerciseId,
            workoutId: savedWorkout.id
          })
        }

        await this.prisma.workoutItem.createMany({
          data: workoutItemsToCreate
        })

        return savedWorkout
      })
    } catch (error) {
      PrismaService.handleError(error)
    }
  }

  async createWorkoutItems(
    workoutDto: CreateWorkoutDto | UpdateWorkouDto,
    { id: workoutId }: Partial<Workout>
  ) {
    const workoutItemsToCreate: Omit<WorkoutItem, 'id'>[] = []

    const exerciseIds = []

    for (const { sets, id } of workoutDto.exercises) {
      for (const { ...s } of sets) {
        workoutItemsToCreate.push({
          ...s,
          exerciseId: id,
          workoutId: workoutId
        })
      }

      exerciseIds.push(id)
    }

    await this.prisma.workoutItem.createMany({
      data: workoutItemsToCreate
    })

    return exerciseIds
  }

  async saveWorkout(
    userId: string,
    workoutDto: CreateWorkoutDto
  ): Promise<{ workout: Workout; muscles: Muscle[] }> {
    try {
      const id = randomUUID()
      const picture_url = `${process.env.MINIO_URL}/workout/${id}.png`

      return await this.prisma.$transaction(async () => {
        const workout = await this.prisma.workout.create({
          data: {
            id,
            name: workoutDto.name,
            day: workoutDto.day,
            signature: workoutDto.signature,
            public: workoutDto.public,
            userId: userId,
            picture_url
          }
        })

        const exerciseIds = await this.createWorkoutItems(workoutDto, workout)

        const muscles = await this.prisma.muscle.findMany({
          where: {
            exercise: {
              some: {
                id: {
                  in: exerciseIds
                }
              }
            }
          }
        })

        return { workout, muscles }
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

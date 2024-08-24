import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/db/prisma.service'
import { ExerciseDto } from './dto/exercise.dto'
import { MuscleDto } from './dto/muscle.dto'
import { ExerciseQueryDto } from './dto/get-exercise.dto'
import { buildPaginationParams } from 'src/utils/pagination'

@Injectable()
export class ExerciseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getExercisesByMuscle(muscle: string) {
    try {
      return await this.prisma.exercise.findMany({
        where: {
          muscleId: muscle
        }
      })
    } catch (error) {
      PrismaService.handleError(error)
    }
  }

  async getExercises(muscleId: string, query: ExerciseQueryDto) {
    try {
      return await Promise.all([
        this.prisma.exercise.findMany({
          where: {
            muscleId
          },
          select: {
            id: true,
            name: true,
            description: true,
            gif_url: true,
            muscle: {
              select: {
                name: true
              }
            }
          },
          ...buildPaginationParams(query)
        }),
        this.prisma.exercise.count({
          where: {
            muscleId
          }
        })
      ])
    } catch (error) {
      PrismaService.handleError(error)
    }
  }
  async getMuscleByName(name: string) {
    try {
      return await this.prisma.muscle.findFirst({
        where: {
          name
        }
      })
    } catch (error) {
      PrismaService.handleError(error)
    }
  }
  async createExercise({
    description,
    gif_url,
    muscleId,
    name
  }: ExerciseDto): Promise<ExerciseDto> {
    try {
      const exercise = await this.prisma.exercise.create({
        data: {
          description,
          gif_url,
          name,
          muscleId
        }
      })
      return exercise
    } catch (error) {
      PrismaService.handleError(error)
    }
  }
  async searchExercise(name: string): Promise<ExerciseDto> {
    try {
      const exercise = await this.prisma.exercise.findFirst({
        where: {
          name
        }
      })

      return exercise
    } catch (error) {
      PrismaService.handleError(error)
    }
  }

  async createMuscle(name: string, picture_url: string): Promise<MuscleDto> {
    try {
      const muscle = await this.prisma.muscle.create({
        data: {
          name,
          picture_url: picture_url ?? ''
        }
      })

      return muscle
    } catch (error) {
      PrismaService.handleError(error)
    }
  }
  async searchMuscle(name: string): Promise<MuscleDto> {
    try {
      const muscle = await this.prisma.muscle.findFirst({
        where: {
          name
        }
      })

      return muscle
    } catch (error) {
      PrismaService.handleError(error)
    }
  }

  async getMuscles() {
    try {
      const muscles = await this.prisma.muscle.findMany()

      return muscles
    } catch (error) {
      PrismaService.handleError(error)
    }
  }
}

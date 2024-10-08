import { ExerciseRepository } from './exercise.repository'
import { HttpStatus, Injectable } from '@nestjs/common'
import { CacheService } from 'src/shared/cache/cache.service'
import { AppError } from '@pedrocavallaro/focvs-utils'
import { ExerciseQueryDto } from './dto/get-exercise.dto'
import { parsePagination } from 'src/utils/pagination'
import { ExerciseDto, MuscleDto } from './dto'

@Injectable()
export class ExerciseService {
  constructor(
    private readonly repo: ExerciseRepository,
    private readonly cache: CacheService
  ) {}

  async createExercise(exerciseDto: ExerciseDto) {
    const exerciseAlreadyCreated = await this.repo.searchExercise(exerciseDto.name)

    if (exerciseAlreadyCreated) throw new AppError('Exercicio já cadastrado', HttpStatus.CONFLICT)

    const exercise = await this.repo.createExercise({
      description: exerciseDto.description,
      gif_url: exerciseDto.gif_url,
      muscleId: exerciseDto.muscleId,
      name: exerciseDto.name
    })

    return exercise
  }

  async createMuscle(muscleDto: MuscleDto) {
    const muscleAlreadyCreated = await this.repo.searchMuscle(muscleDto.name)

    if (muscleAlreadyCreated) throw new AppError('Musculo já cadastrado', HttpStatus.CONFLICT)

    const exercise = await this.repo.createMuscle(muscleDto.name, muscleDto.picture_url)

    return exercise
  }

  async getExercises(muscleId: string, query: ExerciseQueryDto) {
    // const cachedExercises = await this.cache.get(`exercises:${query.page ?? 0}`)

    // if(cachedExercises) {
    //   const parsedExercises = JSON.parse(cachedExercises)
      
    //   return parsePagination(parsedExercises.data, query, parsedExercises.total)
    // }

    const [exercises, count] = await this.repo.getExercises(muscleId, query)

    console.log(exercises);

    // await this.cache.set(`exercises:${query.page ?? 0}`, JSON.stringify({
    //   total: count,
    //   data: JSON.stringify(exercises)
    // }))

    return parsePagination(exercises, query, count)
  }

  async getMuscles(q: string) {
    const res = await this.repo.getMuscles(q)
 
    const muscles = res.map((m) => ({
      ...m,
      exerciseCount: m._count.exercise,
      _count: undefined
    }))

    return  muscles
  }
}

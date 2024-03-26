import { AppError } from 'src/shared/error/AppError';
import { ExerciseDto } from './dto/ExerciseDto';
import { ExerciseRepository } from './exercise.repository';
import { HttpStatus, Injectable } from '@nestjs/common';
import { MuscleDto } from './dto/MuscleDto';
import { CacheService } from 'src/shared/cache/cache.service';

@Injectable()
export class ExerciseService {
  constructor(
    private readonly repo: ExerciseRepository,
    private readonly cache: CacheService,
  ) {}

  async createExercise(exerciseDto: ExerciseDto) {
    const exerciseAlreadyCreated = await this.repo.searchExercise(
      exerciseDto.name,
    );

    if (exerciseAlreadyCreated)
      throw new AppError('Exercicio já cadastrado', HttpStatus.CONFLICT);

    const exercise = await this.repo.createExercise({
      description: exerciseDto.description,
      gif_url: exerciseDto.gif_url,
      muscleId: exerciseDto.muscleId,
      name: exerciseDto.name,
    });

    return exercise;
  }

  async createMuscle(muscleDto: MuscleDto) {
    const muscleAlreadyCreated = await this.repo.searchMuscle(muscleDto.name);

    if (muscleAlreadyCreated)
      throw new AppError('Musculo já cadastrado', HttpStatus.CONFLICT);

    const exercise = await this.repo.createMuscle(
      muscleDto.name,
      muscleDto.picture_url,
    );

    return exercise;
  }

  async getExercises() {
    const cachedExercises = await this.cache.get('exercises');

    if (cachedExercises) return JSON.parse(cachedExercises);

    const exercises = await this.repo.getExercises();

    this.cache.set('exercises', JSON.stringify(exercises));

    return exercises;
  }
  async getExerciseByMuscle(muscle: string) {
    const cachedExercises = await this.cache.get(muscle);

    if (cachedExercises) return JSON.parse(cachedExercises);

    const muscleFound = await this.repo.getMuscleByName(muscle);

    if (!muscleFound)
      throw new AppError('Musculo não encontrado', HttpStatus.NOT_FOUND);

    const exercises = await this.repo.getExercisesByMuscle(muscle);

    this.cache.set(muscleFound.name, JSON.stringify(exercises));

    return exercises;
  }
  async getMuscles() {
    return await this.repo.getMuscles();
  }
}

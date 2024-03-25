import { AppError } from 'src/shared/error/AppError';
import { ExerciseDto } from './dto/ExerciseDto';
import { ExerciseRepository } from './exercise.repository';
import { HttpStatus, Injectable } from '@nestjs/common';
import { MuscleDto } from './dto/MuscleDto';

@Injectable()
export class ExerciseService {
  constructor(private readonly repo: ExerciseRepository) {}

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
    return await this.repo.getExercises();
  }
  async getMuscles() {
    return await this.repo.getMuscles();
  }
}

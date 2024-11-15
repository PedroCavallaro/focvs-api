import { WorkoutItem } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { ExerciseDto } from 'src/exercise/dto'
import { CreateWorkoutDto, ExerciseSet } from 'src/workout/dto'
import prisma from 'test/db/client'

export async function addRawExercise() {
  const muscle = await prisma.muscle.create({
    data: {
      name: 'foo_muscle',
      picture_url: 'http://a'
    }
  })

  const exercise = await prisma.exercise.create({
    data: {
      description: 'foo',
      gif_url: 'https://a',
      name: 'bar',
      muscleId: muscle.id
    }
  })

  return exercise
}

export async function createRawWorkout(userId: string, data?: Partial<CreateWorkoutDto>) {
  return await prisma.workout.create({
    data: {
      name: data?.name ?? 'treino',
      day: data?.day ?? 0,
      public: data?.public ?? false,
      userId: userId,
      signature: randomUUID()
    }
  })
}

export async function addWorkoutItems(workoutId: string, data: Partial<WorkoutItem & ExerciseSet>) {
  let exercise: ExerciseDto

  if (!data?.id) {
    exercise = await addRawExercise()
  }

  return await prisma.workoutItem.create({
    data: {
      reps: data?.reps ?? 10,
      exerciseId: data?.id ?? exercise.id,
      set_number: data?.set_number ?? 1,
      weight: data?.weight ?? 10,
      workoutId
    }
  })
}

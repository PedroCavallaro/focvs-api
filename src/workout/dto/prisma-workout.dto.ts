import { Prisma } from '@prisma/client';

class WorkoutInclude implements Prisma.WorkoutInclude {
  workoutItem: {
    select: {
      exercise: {
        select: {
          id: true;
          gif_url: true;
          name: true;
        };
      };
      set_number: true;
      reps: true;
      weight: true;
    };
  };
}

export type PrismaWorkoutDTO = Prisma.WorkoutGetPayload<{
  include: WorkoutInclude;
}>;

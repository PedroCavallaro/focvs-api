export class CreateWorkoutDto {
  id?: string;
  userId: string;
  name: string;
  day: number;
  exercises: Array<WorkOutItem>;
}

type WorkOutItem = {
  exerciseId: string;
  sets: [
    {
      set_number: number;
      reps: number;
      weight: number;
    },
  ];
};

// id         String   @id @default(uuid())
//   reps       Int
//   weight     Float
//   Workout    Workout  @relation(fields: [workoutId], references: [id])
//   workoutId  String
//   Exercise   Exercise @relation(fields: [exerciseId], references: [id])
//   exerciseId String

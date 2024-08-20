-- DropForeignKey
ALTER TABLE "Workout_item" DROP CONSTRAINT "Workout_item_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "Workout_item" DROP CONSTRAINT "Workout_item_workoutId_fkey";

-- AddForeignKey
ALTER TABLE "Workout_item" ADD CONSTRAINT "Workout_item_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_item" ADD CONSTRAINT "Workout_item_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

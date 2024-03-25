/*
  Warnings:

  - Made the column `userId` on table `Workout` required. This step will fail if there are existing NULL values in that column.
  - Made the column `workoutId` on table `WorkoutItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `exerciseId` on table `WorkoutItem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutItem" DROP CONSTRAINT "WorkoutItem_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutItem" DROP CONSTRAINT "WorkoutItem_workoutId_fkey";

-- AlterTable
ALTER TABLE "Workout" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "WorkoutItem" ALTER COLUMN "workoutId" SET NOT NULL,
ALTER COLUMN "exerciseId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutItem" ADD CONSTRAINT "WorkoutItem_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutItem" ADD CONSTRAINT "WorkoutItem_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `WorkoutItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkoutItem" DROP CONSTRAINT "WorkoutItem_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutItem" DROP CONSTRAINT "WorkoutItem_workoutId_fkey";

-- DropIndex
DROP INDEX "Workout_name_userId_id_idx";

-- DropTable
DROP TABLE "WorkoutItem";

-- CreateTable
CREATE TABLE "Workout_item" (
    "id" TEXT NOT NULL,
    "set_number" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "workoutId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,

    CONSTRAINT "Workout_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Workout_name_idx" ON "Workout"("name");

-- AddForeignKey
ALTER TABLE "Workout_item" ADD CONSTRAINT "Workout_item_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_item" ADD CONSTRAINT "Workout_item_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `set_position` on the `PerformedExercise` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PerformedExercise" DROP COLUMN "set_position",
ADD COLUMN     "done" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "set_number" INTEGER;

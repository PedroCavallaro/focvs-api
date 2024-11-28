/*
  Warnings:

  - Made the column `set_number` on table `PerformedExercise` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PerformedExercise" ALTER COLUMN "set_number" SET NOT NULL;

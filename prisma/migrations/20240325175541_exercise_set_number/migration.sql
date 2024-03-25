/*
  Warnings:

  - Added the required column `set_number` to the `WorkoutItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkoutItem" ADD COLUMN     "set_number" INTEGER NOT NULL;

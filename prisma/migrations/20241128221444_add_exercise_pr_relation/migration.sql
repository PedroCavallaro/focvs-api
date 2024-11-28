-- AddForeignKey
ALTER TABLE "ExercisePr" ADD CONSTRAINT "ExercisePr_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

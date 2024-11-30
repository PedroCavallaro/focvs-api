-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(64) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "image_url" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "day" INTEGER NOT NULL,
    "signature" TEXT NOT NULL,
    "picture_url" TEXT,
    "public" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    "copied" BOOLEAN DEFAULT false,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "gif_url" TEXT NOT NULL,
    "muscleId" TEXT NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Muscle" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "picture_url" TEXT NOT NULL,

    CONSTRAINT "Muscle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logs" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "requestorId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "operation" TEXT,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformedWorkout" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "performed_at" TIMESTAMP NOT NULL,
    "spent_minutes" INTEGER NOT NULL,
    "workoutId" TEXT,

    CONSTRAINT "PerformedWorkout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerformedExercise" (
    "id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "performed_workout_id" TEXT NOT NULL,
    "set_number" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PerformedExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExercisePr" (
    "id" TEXT NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,

    CONSTRAINT "ExercisePr_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE INDEX "Account_email_idx" ON "Account" USING HASH ("email");

-- CreateIndex
CREATE INDEX "Workout_name_idx" ON "Workout"("name");

-- CreateIndex
CREATE INDEX "Exercise_name_idx" ON "Exercise"("name");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_item" ADD CONSTRAINT "Workout_item_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout_item" ADD CONSTRAINT "Workout_item_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_muscleId_fkey" FOREIGN KEY ("muscleId") REFERENCES "Muscle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformedWorkout" ADD CONSTRAINT "PerformedWorkout_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformedExercise" ADD CONSTRAINT "PerformedExercise_performed_workout_id_fkey" FOREIGN KEY ("performed_workout_id") REFERENCES "PerformedWorkout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerformedExercise" ADD CONSTRAINT "PerformedExercise_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExercisePr" ADD CONSTRAINT "ExercisePr_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

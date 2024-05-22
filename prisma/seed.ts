import {
  PrismaClient,
  User,
  Account,
  Muscle,
  Exercise,
  Workout,
  WorkoutItem
} from '@prisma/client';
import { faker } from '@faker-js/faker';

async function seed() {
  try {
    const prisma = new PrismaClient();

    const userPromises: Promise<User>[] = [];

    for (let i = 0; i < 5; i++) {
      const userPromise = prisma.user.create({
        data: {
          name: faker.internet.userName(),
          image_url: 'https://i.pravatar.cc/150?u=' + i
        }
      });
      userPromises.push(userPromise);
    }

    const users: User[] = await Promise.all(userPromises);

    const accountPromises: Promise<Account>[] = [];

    for (const user of users) {
      const accountPromise = prisma.account.create({
        data: {
          email: faker.internet.email(),
          password: faker.internet.password(),
          userId: user.id
        }
      });
      accountPromises.push(accountPromise);
    }

    await Promise.all(accountPromises);

    const musclePromise: Promise<Muscle>[] = [];
    const muscles = [
      'Peitoral',
      'Biceps',
      'Triceps',
      'Dorsal',
      'Trapézio',
      'Ombro',
      'Perna',
      'Glúteo',
      'Abdômen',
      'Trapézio'
    ];

    for (let i = 0; i < 10; i++) {
      const muscle = prisma.muscle.create({
        data: {
          name: muscles[i],
          picture_url: 'https://i.pravatar.cc/150?u=' + i
        }
      });
      musclePromise.push(muscle);
    }

    const musclesSaved: Muscle[] = await Promise.all(musclePromise);

    const exercisePromises: Promise<Exercise>[] = [];
    const exercise = [
      `Supino`,
      `Rosca direta`,
      `Tríceps pulley`,
      `Puxada frontal`,
      `Desenvolvimento`,
      `Agachamento`,
      `Leg press`,
      `Stiff`,
      `Abdominal`,
      `Elevação de ombros`
    ];

    for (const muscle of musclesSaved) {
      const exercisePromise = prisma.exercise.create({
        data: {
          name: exercise[Math.floor(Math.random() * exercise.length)],
          description: faker.lorem.sentence(),
          gif_url:
            'https://i.pravatar.cc/150?u=' + Math.floor(Math.random() * 10),
          muscleId: muscle.id
        }
      });
      exercisePromises.push(exercisePromise);
    }

    const exercisesSaved: Exercise[] = await Promise.all(exercisePromises);

    console.log(exercisesSaved);

    const workoutsPromise: Promise<Workout>[] = [];

    for (let i = 0; i < users.length; i++) {
      workoutsPromise.push(
        prisma.workout.create({
          data: {
            name: `Treino do dia ${i + 1}`,
            day: i,
            public: true,
            userId: users[i].id
          }
        })
      );
    }
    const workouts = await Promise.all(workoutsPromise);
    console.log(workouts);
    const workoutItemPromises: Promise<WorkoutItem>[] = [];

    for (const workout of workouts) {
      for (let i = 0; i < 5; i++) {
        const workoutItemPromise = prisma.workoutItem.create({
          data: {
            set_number: i + 1,
            reps: Math.floor(Math.random() * 10) + 1,
            weight: Math.floor(Math.random() * 100) + 1,
            workoutId: workout.id,
            exerciseId:
              exercisesSaved[Math.floor(Math.random() * exercisesSaved.length)]
                .id
          }
        });
        workoutItemPromises.push(workoutItemPromise);
      }
    }

    await Promise.all(workoutItemPromises);

    prisma.$disconnect();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

(async () => {
  await seed();
})();

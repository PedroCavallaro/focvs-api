import { PrismaClient, Muscle, Exercise } from '@prisma/client'
import { faker } from '@faker-js/faker'

async function seed() {
  try {
    const prisma = new PrismaClient()

    const musclePromise: Promise<Muscle>[] = []
    const muscles = ['Peitoral', 'Dorsal', 'Perna']
    const pics = [
      'https://i.pinimg.com/originals/d8/1b/47/d81b4799318a6b03520967910cbbc66d.gif',
      'https://gymvisual.com/img/p/5/6/8/3/5683.gif',
      'https://media.tenor.com/Pfj8vy41k-0AAAAM/gym.gif'
    ]

    for (let i = 0; i < muscles.length; i++) {
      const muscle = prisma.muscle.create({
        data: {
          name: muscles[i],
          picture_url: pics[i]
        }
      })
      musclePromise.push(muscle)
    }

    const musclesSaved: Muscle[] = await Promise.all(musclePromise)

    const exercisePromises: Promise<Exercise>[] = []
    const exercise = ['Supino', 'Barra', 'Agachamento']

    for (const muscle of musclesSaved) {
      const exercisePromise = prisma.exercise.create({
        data: {
          name: exercise[Math.floor(Math.random() * exercise.length)],
          description: faker.lorem.sentence(),
          gif_url: muscle.picture_url,
          muscleId: muscle.id
        }
      })

      exercisePromises.push(exercisePromise)
    }

    await Promise.all(exercisePromises)

    prisma.$disconnect()
  } catch (error) {
    console.error(error)
    throw error
  }
}

// await seed()

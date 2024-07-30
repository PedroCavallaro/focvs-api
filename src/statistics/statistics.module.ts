// import { Module } from '@nestjs/common';
// import { StatisticsController } from './statistics.controller';
// import { StatisticsService } from './statistics.service';
// import { StatisticsRepository } from './statistics.repository';
// import { MongooseModule } from '@nestjs/mongoose';
// import { performedWorkoutSchema } from 'src/workout/schema/performedWorkout.schema';
// import { MongoWorkoutRepository } from 'src/workout/workout.mongo.repository';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       {
//         name: 'Workout',
//         schema: performedWorkoutSchema
//       }
//     ])
//   ],
//   controllers: [StatisticsController],
//   providers: [StatisticsService, StatisticsRepository, MongoWorkoutRepository]
// })
// export class StatisticsModule {}

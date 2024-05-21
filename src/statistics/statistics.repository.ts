import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PerformedWorkout } from 'src/workout/schema/performedWorkout.schema';

export class StatisticsRepository {
  constructor(
    @InjectModel('Workout') private readonly model: Model<PerformedWorkout>
  ) {}

  async findUserWorkoutsBetweenDates(userId: string, daysToDecrease: number) {
    try {
      const pastDate = new Date();

      pastDate.setDate(pastDate.getDate() - daysToDecrease);

      const workouts = await this.model.find({
        userId,
        date: {
          $gte: pastDate.toISOString()
        }
      });

      return workouts;
    } catch (error) {
      console.log(error);
    }
  }
  async lastThree(userId: string) {
    try {
      const workouts = await this.model
        .find({ userId })
        .sort({ date: -1 })
        .limit(3);

      return workouts;
    } catch (error) {
      console.log(error);
    }
  }
  async hoursByMonth(userId: string, month: Date) {
    try {
      const total = await this.model.aggregate([
        {
          $match: {
            userId,
            date: {
              $gte: month
            }
          }
        },
        {
          $group: {
            _id: {
              userId: userId
            },
            hours: { $sum: '$hours' }
          }
        }
      ]);

      return total[0] ? total[0].hours : 0;
    } catch (error) {
      console.log(error);
    }
  }

  async hoursByWeek(userId: string, week: Date) {
    try {
      const total = await this.model.aggregate([
        {
          $match: {
            userId,
            date: {
              $gte: week
            }
          }
        },
        {
          $group: {
            _id: {
              userId: userId,
              week: '$date'
            },
            hours: { $sum: '$hours' }
          }
        }
      ]);

      return total[0] ? total[0].hours : 0;
    } catch (error) {
      console.log(error);
    }
  }
  async workoutsByMonth(userId: string, month: Date) {
    try {
      const total = await this.model
        .find({
          userId,
          date: {
            $gte: month
          }
        })
        .countDocuments();

      return total;
    } catch (error) {
      console.log(error);
    }
  }

  async workoutsByWeek(userId: string, week: Date) {
    try {
      const total = await this.model
        .find({
          userId,
          date: {
            $gte: week
          }
        })
        .countDocuments();

      return total;
    } catch (error) {
      console.log(error);
    }
  }

  async exercisesWithImprovements(userId: string) {
    try {
      const exercises = await this.model
        .find({ userId, 'exercises.sets.hasImprovements': true })
        .select('exercises.sets.newWeight')
        .limit(3);

      return exercises;
    } catch (error) {
      console.log(error);
    }
  }
}

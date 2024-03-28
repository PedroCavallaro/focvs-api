import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PerformedWorkout } from 'src/workout/schema/performedWorkout.schema';

export class StatisticsRepository {
  constructor(
    @InjectModel('Workout') private readonly model: Model<PerformedWorkout>,
  ) {}

  async findUserLastWorkouts() {
    try {
      const pastDate = new Date();

      pastDate.setDate(pastDate.getDate() - 100);

      const workouts = await this.model.find({
        date: {
          $gte: new Date(new Date().getDate() - 21),
        },
      });

      return workouts;
    } catch (error) {
      console.log(error);
    }
  }
  decreaseWeeks(weeksToDecrease: number) {
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const weeks = weeksToDecrease * msPerWeek;
    const newDate = new Date(new Date().getTime() - weeks);

    return newDate;
  }
}

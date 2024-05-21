import { Injectable } from '@nestjs/common';
import { StatisticsRepository } from './statistics.repository';
import { secondsToMinutes, startOfMonth, startOfWeek } from 'date-fns';
import { WorkoutHoursResponseDTO } from './dtos/workout-hours-response.dto';

@Injectable()
export class StatisticsService {
  constructor(private readonly repo: StatisticsRepository) {}

  async getUserWorkoutsBetweenDates(userId: string, days: number) {
    return await this.repo.findUserWorkoutsBetweenDates(userId, days);
  }

  async lastThree(userId: string) {
    return await this.repo.lastThree(userId);
  }

  async hoursByWeekAndMonth(userId: string): Promise<WorkoutHoursResponseDTO> {
    const monthInit = startOfMonth(new Date());
    const weekInit = startOfWeek(new Date(), { weekStartsOn: 0 });

    const [weekly, monthly] = await Promise.all([
      this.repo.hoursByWeek(userId, weekInit),
      this.repo.hoursByMonth(userId, monthInit)
    ]);

    return this.formatMonthAndWeekHours(weekly, monthly);
  }

  async monthAndWeekWorkouts(userId: string) {
    const monthInit = startOfMonth(new Date());
    const weekInit = startOfWeek(new Date(), { weekStartsOn: 0 });

    const [weekly, monthly] = await Promise.all([
      this.repo.workoutsByWeek(userId, weekInit),
      this.repo.workoutsByMonth(userId, monthInit)
    ]);

    return {
      weekAmount: weekly,
      monthAmount: monthly
    };
  }

  async exercisesWithImprovements(userId: string) {
    return await this.repo.exercisesWithImprovements(userId);
  }

  formatMonthAndWeekHours(weekSeconds: number, monthSeconds: number) {
    const weeMinutes = secondsToMinutes(weekSeconds);
    const weekHours = Math.floor(weeMinutes / 60);
    const monthMinutes = secondsToMinutes(monthSeconds);
    const monthHours = Math.floor(monthMinutes / 60);

    console.log(monthHours);
    return {
      week: `${String(weekHours).padStart(2, '0')}:${String(weeMinutes % 60).padStart(2, '0')}`,
      month: `${String(monthHours).padStart(2, '0')}:${String(monthMinutes % 60).padStart(2, '0')}`
    };
  }
}

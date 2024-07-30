// import { Controller, Get, Query } from '@nestjs/common';
// import { StatisticsService } from './statistics.service';
// import { AuthUser } from 'src/auth/guards/decorators';
// import { JwtPayloadDTO } from 'src/auth/dtos/jwt-payload';
// import { GetWorkoutsBetweenDates } from './dtos/get-workouts-between-dates.dto';

// @Controller('statistics')
// export class StatisticsController {
//   constructor(private readonly service: StatisticsService) {}

//   @Get('days')
//   async getUserWorkoutsBetweenDates(
//     @AuthUser() user: JwtPayloadDTO,
//     @Query() q: GetWorkoutsBetweenDates
//   ) {
//     return await this.service.getUserWorkoutsBetweenDates(
//       user.id,
//       q.daysToDecrease
//     );
//   }

//   @Get('three')
//   async getUserLastThreeWorkouts(@AuthUser() user: JwtPayloadDTO) {
//     return await this.service.lastThree(user.id);
//   }

//   @Get('hours')
//   async getHours(@AuthUser() user: JwtPayloadDTO) {
//     return await this.service.hoursByWeekAndMonth(user.id);
//   }

//   @Get('amount')
//   async getWorkoutAmount(@AuthUser() user: JwtPayloadDTO) {
//     return await this.service.monthAndWeekWorkouts(user.id);
//   }

//   @Get('improvements')
//   async exercisesWithImprovements(@AuthUser() user: JwtPayloadDTO) {
//     return await this.service.exercisesWithImprovements(user.id);
//   }
// }

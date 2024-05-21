import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PerformedWorkoutItem } from '../dto';

@Schema()
export class PerformedWorkout {
  @Prop({
    type: String
  })
  id: string;

  @Prop({
    type: String
  })
  userId: string;

  @Prop({
    type: String
  })
  name: string;

  @Prop({
    type: Number
  })
  hours: number;

  @Prop({
    type: Date
  })
  date: Date;

  @Prop({
    type: Array<PerformedWorkoutItem>
  })
  exercises: Array<PerformedWorkoutItem>;
}

export const performedWorkoutSchema =
  SchemaFactory.createForClass(PerformedWorkout);

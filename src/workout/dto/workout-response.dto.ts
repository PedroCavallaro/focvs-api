import { ExerciseSet } from './create-workout.dto'

export interface WorkoutResponseDTO {
  id: string
  name: string
  public: boolean
  day: number
  exercises: Array<WorkoutItemResponse>
}

export interface WorkoutItemResponse {
  exerciseId: string
  name: string
  gif_url: string
  sets: ExerciseSet[]
}

export interface WorkoutDetailsDTO {
  id: string
  name: string
  public: boolean
  day: number
  picture_url: string
  exerciseAmount: number
}

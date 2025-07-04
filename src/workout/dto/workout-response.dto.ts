import { ExerciseSet } from './create-workout.dto'

export interface WorkoutResponseDTO {
  id: string
  name: string
  public: boolean
  day: number
  exerciseAmount: number
  user: {
    id: string
    name: string
    image_url: string
  }
  exercises: Array<WorkoutItemResponse>
}

export interface WorkoutItemResponse {
  id: string
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

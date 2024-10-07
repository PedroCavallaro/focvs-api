import { HttpStatus, INestApplication } from "@nestjs/common"
import { Exercise, User } from "@prisma/client"
import { CreateWorkoutDto } from "src/workout/dto"
import { doRequest } from "test/app/app.automation"
import { getAppWithAuth } from "test/auth/automation/guard.automation"
import { resetDatabase } from "test/db/client"
import { addRawExercise, createRawWorkout } from "./automation/workout.automation"

describe("Workout Controller", () => {
    let app: INestApplication
    let user: User
    let exercise: Exercise


    beforeAll(async () => {
        const module = await getAppWithAuth()
        app = module.app
        user = module.user
    
        exercise = await addRawExercise()
        await resetDatabase()

        await app.init()
    })


    beforeEach(async () => {
        await resetDatabase()

    })

    describe("POST ", () => {
        async function send(data: Partial<CreateWorkoutDto> , expected?: HttpStatus) {
            return await doRequest(app).post("/workout").send(data).expect(expected ??HttpStatus.OK) 
        }

        function getPayload(): CreateWorkoutDto {
            return  {
                day: 0,
                name: "treino",
                public: false,
                exercises: [
                    {
                    exerciseId: exercise.id,
                    sets:  [
                        {
                            reps: 10,
                            set_number: 1,
                            weight: 10
                        }
                    ]
                    }
                ],
            }
        }   

        describe("/", () => {
            
                    it("Should create a workout", async () => {
                        const payload: CreateWorkoutDto = getPayload()
            
            
                        const res = await send(payload)
            
                        console.log(res);
                    })

        })
    })

    describe("GET" , () => {
        describe("/", () => {
            it("Should return all user workouts", async () => {
                const workout = await createRawWorkout(user.id) 


                const res = await doRequest(app).get("/workout")

                expect(res.body).toBe([
                    expect.objectContaining({
                        id: workout.id
                    })
                ])
            })
        })
    
        describe("/today", () => {
            it("Should return user's today workout", async () => {
                const workout = await createRawWorkout(user.id, {
                    day: new Date().getDay()
                }) 

                const res = await doRequest(app).get("/workout")

                expect(res.body).toBe([
                    expect.objectContaining({
                        id: workout.id
                    })
                ])
            })
        })
    })

    describe("/search", () => {
        it("Should return of workouts based on the search", async () => {
            const workout = await createRawWorkout(user.id, {
                day: new Date().getDay()
            }) 

            const res = await doRequest(app).get("/workout")

            expect(res.body).toBe([
                expect.objectContaining({
                    id: workout.id
                })
            ])
        })
    })

    describe("/:workoutId", () => {
        it("Should a workout", async () => {
            const workout = await createRawWorkout(user.id, {
                day: new Date().getDay()
            }) 

            const res = await doRequest(app).get("/workout")

            expect(res.body).toBe([
                expect.objectContaining({
                    id: workout.id
                })
            ])
        })

        it("Should throw an error if workout is not public", async () => {
            const workout = await createRawWorkout(user.id, {
                day: new Date().getDay()
            }) 

            const res = await doRequest(app).get("/workout")

            expect(res.body).toBe([
                expect.objectContaining({
                    id: workout.id
                })
            ])
        })

        it("Should return workout if is not public, but the searching user is the owner", async () => {
            const workout = await createRawWorkout(user.id, {
                day: new Date().getDay()
            }) 

            const res = await doRequest(app).get("/workout")

            expect(res.body).toBe([
                expect.objectContaining({
                    id: workout.id
                })
            ])
        })
    })
})
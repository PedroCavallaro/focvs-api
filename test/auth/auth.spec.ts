import { INestApplication } from '@nestjs/common'
import { resetDatabase } from 'test/db/client'
import { doRequest, getApp } from 'test/app/app.automation'
import { CreateAccountDto } from 'src/auth/dtos/create-account'
import { JwtService } from '@pedrocavallaro/focvs-utils'

describe('Auth Controller', () => {
  let app: INestApplication
  let jwtService: JwtService

  describe('POST /auth/login', () => {
    beforeAll(async () => {
      await resetDatabase()

      const module = await getApp()

      jwtService = module.module.get(JwtService)

      jest.spyOn(jwtService, 'signToken').mockImplementation(() => 'mocked-jwt')

      app = module.app
      await app.init()
    })

    afterAll(async () => resetDatabase())

    it('Should create a new user', async () => {
      const newUser: CreateAccountDto = {
        email: 'novoEmail@email.com',
        name: 'new user',
        password: '123947501'
      }

      const res = await doRequest(app).post('/auth/register').send(newUser).expect(200)

      expect(res.body.token).toBeDefined()
    })

    it('Should throw an error when recieving incorrect data', async () => {
      const newUser: CreateAccountDto = {
        email: 'novoE@email.com',
        name: 'new user',
        password: '121'
      }

      await doRequest(app).post('/auth/register').send(newUser).expect(400)
    })
  })
})

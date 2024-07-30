import { TestingModule } from '@nestjs/testing'
import { IGetApp, getApp } from 'test/app/app.automation'
import { JwtService } from 'src/auth/jwt/jwt.service'
import { JwtPayloadDTO } from 'src/auth/dtos/jwt-payload'
import { RawUser, addRawUser } from './auth.automation'

let payload: JwtPayloadDTO = {
  email: '',
  imageUrl: '',
  name: '',
  iat: 123000,
  exp: 123000
}

export function mockAuthGuards(module: TestingModule) {
  const jwtService = module.get(JwtService)

  const jwt = 'mocked-jwt'

  jest.spyOn(jwtService, 'signToken').mockImplementation(() => jwt)
  jest.spyOn(jwtService, 'verifyToken').mockImplementation(() => payload)

  const changePayload = (newPayload: Partial<typeof payload>) => {
    payload = {
      ...payload,
      ...newPayload
    }
  }

  return { jwt, payload, changeUser: changePayload }
}

export function changeUser(user: Partial<JwtPayloadDTO> | Partial<RawUser>) {
  if ('id' in user) {
    payload.email = user.email ?? user.email
    payload.id = user.id
    return
  }

  payload = {
    ...payload,
    ...user
  }
}

export interface IAppWithAuth extends IGetApp {
  sudo: RawUser
  user: RawUser
}

export async function getAppWithAuth() {
  const module: IGetApp = await getApp()

  const user = await addRawUser({
    email: 'user@email.com.br'
  })

  changeUser(user)
  mockAuthGuards(module.module)

  return {
    ...module,
    user
  }
}

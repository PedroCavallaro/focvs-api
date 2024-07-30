import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import * as request from 'supertest'
import { baseDbUrl } from 'test/db/client'

process.env.DATABASE_URL = baseDbUrl

export interface IGetApp {
  app: INestApplication
  module: TestingModule
}

export async function getApp() {
  const module: TestingModule = await Test.createTestingModule({
    imports: [AppModule]
  }).compile()

  const app = module.createNestApplication()

  app.useGlobalPipes(new ValidationPipe({ transform: true }))

  return { app, module, http: app.getHttpServer() }
}

export function doRequest(app: INestApplication) {
  return request(app.getHttpServer())
}

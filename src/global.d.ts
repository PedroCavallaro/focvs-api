import { JwtPayloadDTO } from './auth/dtos/jwt-payload';

export {};

declare module 'express' {
  interface Request {
    user?: JwtPayloadDTO;
    token?: string;
  }
}

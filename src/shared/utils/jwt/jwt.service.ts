import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { env } from 'src/shared/env';

@Injectable()
export class JwtService {
  signToken(id: string, email: string, name: string, imageUrl: string): string {
    return jwt.sign(
      {
        id,
        email,
        name,
        imageUrl
      },
      env.jwt.secret,
      {
        expiresIn: 30 * 60 * 60 * 60
      }
    );
  }

  verifyToken(token: string) {
    return jwt.verify(token, env.jwt.secret);
  }
}

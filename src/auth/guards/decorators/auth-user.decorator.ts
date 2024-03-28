import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const AuthUser = createParamDecorator(
  async (_: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);

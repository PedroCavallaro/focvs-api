import { HttpException, HttpStatus } from '@nestjs/common';
import { isArray } from 'class-validator';

export class AppError extends HttpException {
  public declare cause: string | string[];

  constructor(
    message: string | string[],
    statusCode = 400,
    public readonly details: Record<string, any> | undefined = undefined,
  ) {
    super(isArray(message) ? message[0] : message, statusCode);

    this.cause = message;
  }
}

export class ForbiddenError extends AppError {
  constructor(
    message = 'User does not have permission to access this resource',
  ) {
    super(message, HttpStatus.FORBIDDEN);
  }
}

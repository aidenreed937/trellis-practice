import type { ApiErrorCode, ApiErrorResponse } from '@trellis-practice/shared';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: ApiErrorCode,
  ) {
    super(message);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Invalid request') {
    super(message, 400, 'BAD_REQUEST');
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409, 'CONFLICT');
  }
}

export function toErrorResponse(error: AppError): ApiErrorResponse {
  return {
    error: {
      code: error.code,
      message: error.message,
    },
  };
}

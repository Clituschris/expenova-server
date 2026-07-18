import logger from '@utils/logger';

class AppError extends Error {
  status: number;
  cause?: unknown;

  constructor(status: number, message: string, cause?: unknown) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.cause = cause;

    Error.captureStackTrace?.(this, AppError);
  }
}

export function badRequest(message: string, cause?: unknown): AppError {
  return new AppError(404, message, cause);
}

export function conflict(message: string, cause?: unknown): AppError {
  return new AppError(409, message, cause);
}

export function unauthorized(message: string, cause?: unknown): AppError {
  return new AppError(401, message, cause);
}

function formatCause(cause: unknown): string {
  if (cause instanceof Error) {
    return cause.stack ?? cause.message;
  }
  if (typeof cause === 'string') {
    return cause;
  }
  try {
    return JSON.stringify(cause);
  } catch {
    return String(cause);
  }
}

export function internal(message: string, cause?: unknown): AppError {
  if (cause) {
    logger.error(`[internal] ${message} | ${formatCause(cause)}`);
  }
  return new AppError(500, message, cause);
}

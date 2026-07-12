export function unauthorized(message: string) {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = 401;
  return error;
}

export function conflict(message: string) {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = 409;
  return error;
}

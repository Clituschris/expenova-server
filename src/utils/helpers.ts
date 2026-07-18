type PostgresError = {
  code: string;
  status: number;
  message: string;
  detail?: string;
};

export function isPostgresError(err: unknown): err is PostgresError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof (err as Record<string, unknown>).code === 'string'
  );
}

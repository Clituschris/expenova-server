import type { FastifyInstance } from 'fastify';
import logger from '@utils/logger';

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, _req, reply) => {
    logger.error(error);
    // Postgres unique constraint violation
    if ((error as { code?: string }).code === '23505') {
      return reply.status(409).send({ error: 'Resource already exists' });
    }
    const _error = error as { statusCode?: number; message: string };
    const statusCode = _error.statusCode ?? 500;
    return reply.status(statusCode).send({
      error: statusCode === 500 ? 'Internal server error' : _error.message
    });
  });
}

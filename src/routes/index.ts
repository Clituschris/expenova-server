import type { FastifyInstance } from 'fastify';

import AuthRouter from './auth/authRouter';
import HealthRouter from './health/healthController';

export async function healthRoutes(app: FastifyInstance) {
  await app.register(HealthRouter.routes(), { prefix: '/health' });
}

export async function apiRoutes(app: FastifyInstance) {
  await app.register(AuthRouter.routes(), { prefix: '/auth' });
}

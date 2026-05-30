import { FastifyInstance } from 'fastify';
import { usersRoutes } from './users';

export async function apiRoutes(app: FastifyInstance) {
    app.register(usersRoutes, { prefix: '/users' });
}

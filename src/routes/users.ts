import { FastifyInstance } from 'fastify';
import sql from '../db/client';

interface CreateUserBody {
    email: string;
    name: string;
    password_hash: string;
}

export async function usersRoutes(app: FastifyInstance) {
    app.get('/', async (_req, reply) => {
        const users = await sql`
      SELECT id, email, name, is_active, created_at, updated_at
      FROM users ORDER BY created_at DESC
    `;
        return reply.send(users);
    });

    app.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
        const [user] = await sql`
      SELECT id, email, name, is_active, created_at, updated_at
      FROM users WHERE id = ${req.params.id}
    `;
        if (!user) return reply.status(404).send({ error: 'User not found' });
        return reply.send(user);
    });

    app.post<{ Body: CreateUserBody }>('/', async (req, reply) => {
        const { email, name, password_hash } = req.body;
        const [user] = await sql`
      INSERT INTO users (email, name, password_hash)
      VALUES (${email}, ${name}, ${password_hash})
      RETURNING id, email, name, is_active, created_at, updated_at
    `;
        return reply.status(201).send(user);
    });

    app.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
        const [user] = await sql`
      DELETE FROM users WHERE id = ${req.params.id} RETURNING id
    `;
        if (!user) return reply.status(404).send({ error: 'User not found' });
        return reply.status(204).send();
    });
}
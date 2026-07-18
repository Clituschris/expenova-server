import fp from 'fastify-plugin';
import cors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';

async function corsConfig(app: FastifyInstance) {
  await app.register(cors, {
    origin: (origin, cb) => {
      const allowedOrigins = [process.env.DOMAIN, process.env.CLIENT_URL];

      // allow server-to-server / Postman (no origin)
      if (!origin) {
        return cb(null, true);
      } else if (allowedOrigins.includes(origin)) {
        return cb(null, true);
      } else {
        return cb(new Error('Not allowed by CORS'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true // important for cookies
  });
}

export default fp(corsConfig);

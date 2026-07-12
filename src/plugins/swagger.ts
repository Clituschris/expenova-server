import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import fastifyBasicAuth from '@fastify/basic-auth';

async function swaggerConfig(fastify: FastifyInstance) {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Expenova API',
        description: 'API documentation',
        version: '1.0.0'
      },
      servers: [
        {
          url: process.env.DOMAIN as string
        }
      ],
      tags: [
        { name: 'Health', description: 'Health routes' },
        { name: 'Auth', description: 'Authentication routes' }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    }
  });

  if (process.env.DOCS_USERNAME && process.env.DOCS_PASSWORD) {
    await fastify.register(fastifyBasicAuth, {
      validate: (username, password, req, reply, done) => {
        const validUsername = username === process.env.DOCS_USERNAME;
        const validPassword = password === process.env.DOCS_PASSWORD;
        if (!validUsername || !validPassword) {
          done(new Error('Invalid credentials'));
          return;
        }
        done();
      },
      authenticate: { realm: 'Expenova API Docs' }
    });

    fastify.addHook('onRequest', (request, reply, done) => {
      if (request.url.startsWith('/docs')) {
        fastify.basicAuth(request, reply, done);
      } else {
        done();
      }
    });
  }

  await fastify.register(swaggerUi, {
    routePrefix: '/docs'
  });
}

export default fp(swaggerConfig);

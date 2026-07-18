import fastify from 'fastify';

const app = fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
  }
});

export default app.log;

import 'dotenv/config';
import Fastify from 'fastify';
import logger from '@utils/logger';

import { swaggerPlugin, jwtPlugin, corsPlugin } from './plugins';
import { apiRoutes, healthRoutes } from './routes';
import { registerErrorHandler } from './middleware/error-handler';

const app = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
  }
});

async function start() {
  // register plugins
  await app.register(corsPlugin);
  await app.register(swaggerPlugin);
  await app.register(jwtPlugin);

  // health check
  await app.register(healthRoutes);

  await app.register(apiRoutes, { prefix: '/api/v1' });

  registerErrorHandler(app);

  const port = Number(process.env.PORT) || 3000;

  await app.listen({ port, host: '0.0.0.0' });

  // graceful shutdown
  const closeGracefully = async (signal: string) => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    await app.close();
    process.exit(0);
  };

  process.on('SIGTERM', () => closeGracefully('SIGTERM'));
  process.on('SIGINT', () => closeGracefully('SIGINT'));
}

start().catch((err) => {
  logger.error(err);
  process.exit(1);
});

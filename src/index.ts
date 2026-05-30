import 'dotenv/config';
import Fastify from 'fastify';
import { apiRoutes } from './routes';
import { registerErrorHandler } from './middleware/error-handler';

const app = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

// Health check
app.get('/health', async () => ({ status: 'ok', env: process.env.NODE_ENV }));

app.register(apiRoutes, { prefix: '/api/v1' });

registerErrorHandler(app);

const port = Number(process.env.PORT) || 3000;
app.listen({ port, host: '0.0.0.0' }, (err) => {
  if (err) { app.log.error(err); process.exit(1); }
});

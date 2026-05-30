import 'dotenv/config';
import Fastify from 'fastify';
import { usersRoutes } from './routes/users';
import { registerErrorHandler } from './middleware/error-handler';

const app = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

// Health check — Render uses this to confirm the service is alive
app.get('/health', async () => ({ status: 'ok', env: process.env.NODE_ENV }));

app.register(usersRoutes);
registerErrorHandler(app);

const port = Number(process.env.PORT) || 3000;
app.listen({ port, host: '0.0.0.0' }, (err) => {
  if (err) { app.log.error(err); process.exit(1); }
});

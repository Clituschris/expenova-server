import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify';

describe('Health Endpoint', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = Fastify();
    app.get('/health', () => ({ status: 'ok', env: process.env.NODE_ENV }));
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 status code', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health'
    });
    expect(response.statusCode).toBe(200);
  });

  it('should return ok status', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health'
    });
    const body = JSON.parse(response.body) as { status: string };
    expect(body.status).toBe('ok');
  });

  it('should include environment info', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health'
    });
    const body = JSON.parse(response.body) as Record<string, unknown>;
    expect(body).toHaveProperty('env');
    expect(body).toHaveProperty('status');
  });
});

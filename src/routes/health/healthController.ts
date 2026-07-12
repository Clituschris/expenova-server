import { BaseRouter } from '@routes/baseRouter';
import { Public, Get } from '@routes/decorators';
import type { Request, Response } from '@type/fastify';

import { healthCheckSchema } from './health.schema';

class HealthRouter extends BaseRouter {
  @Public()
  @Get('/', healthCheckSchema)
  health(req: Request, res: Response) {
    return res.send({ status: 'ok', env: process.env.NODE_ENV });
  }
}

export default HealthRouter;

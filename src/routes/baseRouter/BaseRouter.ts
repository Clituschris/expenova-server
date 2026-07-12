import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyReply,
  FastifyRequest
} from 'fastify';
import { getRoutes, isPublic } from '@routes/decorators';

type RouteHandler = (req: FastifyRequest, reply: FastifyReply) => unknown;

interface RouteDefinition {
  method: string;
  url: string;
  schema?: Record<string, unknown>;
  propertyKey: string;
}

export abstract class BaseRouter {
  constructor(protected app: FastifyInstance) {
    this.registerRoutes();
  }

  private registerRoutes() {
    const proto = Object.getPrototypeOf(this) as object;
    const routes = getRoutes(proto) as RouteDefinition[];

    for (const route of routes) {
      const requiresAuth = !isPublic(proto, route.propertyKey);

      const schema = requiresAuth
        ? { ...route.schema, security: [{ bearerAuth: [] }] }
        : route.schema;

      const handler = (this as unknown as Record<string, RouteHandler>)[
        route.propertyKey
      ].bind(this);

      this.app.route({
        method: route.method,
        url: route.url,
        schema,
        preHandler: requiresAuth
          ? [
              (req: FastifyRequest, reply: FastifyReply) =>
                this.app.authenticate(req, reply)
            ]
          : undefined,
        handler
      });
    }
  }

  static routes(
    this: new (app: FastifyInstance) => BaseRouter
  ): FastifyPluginAsync {
    return (app: FastifyInstance) => {
      new this(app);
      return Promise.resolve();
    };
  }
}

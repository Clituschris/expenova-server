interface RouteMeta {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  schema?: RouteSchema;
  propertyKey: string | symbol;
}

// Replace with your actual schema shape (e.g. a Zod/JSON-schema type) if you have one.
type RouteSchema = Record<string, unknown>;

const ROUTES = new WeakMap<object, RouteMeta[]>();
const PUBLIC = new WeakMap<object, Set<string | symbol>>();

function createMethodDecorator(method: RouteMeta['method']) {
  return (url: string, schema?: RouteSchema) => {
    return (target: object, propertyKey: string | symbol) => {
      const existing = ROUTES.get(target) || [];
      existing.push({ method, url, schema, propertyKey });
      ROUTES.set(target, existing);
    };
  };
}

export const Get = createMethodDecorator('GET');
export const Post = createMethodDecorator('POST');
export const Put = createMethodDecorator('PUT');
export const Patch = createMethodDecorator('PATCH');
export const Delete = createMethodDecorator('DELETE');

export function getRoutes(target: object): RouteMeta[] {
  return ROUTES.get(target) || [];
}

export function Public() {
  return (target: object, propertyKey: string | symbol) => {
    const existing = PUBLIC.get(target) || new Set<string | symbol>();
    existing.add(propertyKey);
    PUBLIC.set(target, existing);
  };
}

export function isPublic(
  target: object,
  propertyKey: string | symbol
): boolean {
  return PUBLIC.get(target)?.has(propertyKey) ?? false;
}

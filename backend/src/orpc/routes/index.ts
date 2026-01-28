import type { FastifyInstance } from 'fastify';
import { counterRoutes } from './counter.route';

// Route modules to register - add new route files here
const routeModules = [
  { prefix: '/api', register: counterRoutes },
] as const;

/**
 * Dynamic route registration.
 * Each route module exports a function that registers its routes on the Fastify instance.
 */
export async function registerRoutes(app: FastifyInstance): Promise<void> {
  for (const mod of routeModules) {
    await app.register(
      async (instance) => {
        await mod.register(instance);
      },
      { prefix: mod.prefix }
    );
  }
}

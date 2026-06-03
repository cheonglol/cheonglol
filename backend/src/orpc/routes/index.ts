import type { FastifyInstance } from 'fastify';

const routeModules = [] as const;

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

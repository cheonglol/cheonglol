import Fastify from 'fastify';
import { registerRoutes } from './orpc/routes/index';

const PORT = Number(process.env.PORT || 4000);

async function start() {
  const app = Fastify({ logger: true });

  // CORS: prefer @fastify/cors, fallback to manual headers
  try {
    // @ts-expect-error - @fastify/cors is an optional dependency
    const cors = await import('@fastify/cors');
    await app.register(cors.default, { origin: true });
  } catch {
    app.addHook('onRequest', async (_req, reply) => {
      reply.header('access-control-allow-origin', '*');
      reply.header('access-control-allow-methods', 'GET,POST,PUT,DELETE,OPTIONS');
      reply.header('access-control-allow-headers', 'content-type');
    });
  }

  // Health endpoint
  app.get('/health', async () => ({ ok: true, now: new Date().toISOString() }));

  // Dynamic route registration from orpc/routes
  await registerRoutes(app);

  await app.listen({ port: PORT, host: '0.0.0.0' });
  app.log.info(`backend listening on ${PORT}`);
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});

import Fastify from 'fastify';
import { registerRoutes } from './orpc/routes/index';

const PORT = Number(process.env.PORT || 4000);

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'http://localhost:4321',  // local frontend dev
  'http://localhost:3000',
  'https://cheonglol.github.io',  // GitHub Pages
  'https://cheonglol.com',  // future custom domain
];

async function start() {
  const app = Fastify({ logger: true });

  // CORS configuration
  try {
    // @ts-expect-error - @fastify/cors is an optional dependency
    const cors = await import('@fastify/cors');
    await app.register(cors.default, {
      origin: (origin, cb) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return cb(null, true);
        if (ALLOWED_ORIGINS.includes(origin)) {
          return cb(null, true);
        }
        // Also allow any *.github.io for development
        if (origin.endsWith('.github.io')) {
          return cb(null, true);
        }
        return cb(new Error('Not allowed by CORS'), false);
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
  } catch {
    // Fallback manual CORS headers
    app.addHook('onRequest', async (req, reply) => {
      const origin = req.headers.origin || '';
      if (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.github.io')) {
        reply.header('access-control-allow-origin', origin);
      }
      reply.header('access-control-allow-methods', 'GET,POST,PUT,DELETE,OPTIONS');
      reply.header('access-control-allow-headers', 'Content-Type,Authorization');
      reply.header('access-control-allow-credentials', 'true');
      if (req.method === 'OPTIONS') {
        reply.status(204).send();
      }
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

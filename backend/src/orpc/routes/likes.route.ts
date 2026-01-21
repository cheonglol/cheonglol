import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createLikesHandlers } from '../handlers/likes.handler';

// Simple rate limiting: 20 requests per minute per IP
const RATE_LIMIT = 20;
const RATE_WINDOW = 60_000;
const requestCounts = new Map<string, { count: number; windowStart: number }>();

// Cleanup every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of requestCounts) {
    if (now - record.windowStart > RATE_WINDOW * 2) requestCounts.delete(key);
  }
}, 300_000);

function getClientIP(req: FastifyRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.ip;
}

function checkRateLimit(req: FastifyRequest, reply: FastifyReply): boolean {
  const ip = getClientIP(req);
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now - record.windowStart > RATE_WINDOW) {
    requestCounts.set(ip, { count: 1, windowStart: now });
    return true;
  }

  record.count++;
  if (record.count > RATE_LIMIT) {
    reply.status(429).send({ error: 'Too many requests, slow down' });
    return false;
  }
  return true;
}

export async function likesRoutes(app: FastifyInstance): Promise<void> {
  const handlers = createLikesHandlers();

  // GET /likes/:slug?userId=xxx - get like count and user's like status
  app.get<{ Params: { slug: string }; Querystring: { userId?: string } }>(
    '/likes/:slug',
    async (req) => {
      const userId = req.query.userId || '';
      return handlers.get({ slug: req.params.slug, userId });
    }
  );

  // POST /likes/:slug - toggle like (rate limited)
  app.post<{ Params: { slug: string }; Body: { userId: string } }>(
    '/likes/:slug',
    async (req, reply) => {
      if (!checkRateLimit(req, reply)) return;
      const userId = req.body?.userId || '';
      if (!userId) {
        reply.status(400).send({ error: 'userId is required' });
        return;
      }
      return handlers.toggle({ slug: req.params.slug, userId });
    }
  );
}

import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createLikesHandlers } from '../handlers/likes.handler';

// In-memory rate limiter with ban
const RATE_LIMIT = 25; // max requests
const RATE_WINDOW = 60_000; // 1 minute
const BAN_DURATION = 48 * 60 * 60 * 1000; // 48 hours

const requestCounts = new Map<string, { count: number; windowStart: number }>();
const bannedIPs = new Map<string, number>(); // IP -> ban expiry timestamp

function getClientIP(req: FastifyRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.ip;
}

function checkRateLimit(req: FastifyRequest, reply: FastifyReply): boolean {
  const ip = getClientIP(req);
  const now = Date.now();

  // Check if banned
  const banExpiry = bannedIPs.get(ip);
  if (banExpiry) {
    if (now < banExpiry) {
      reply.status(429).send({ error: 'Banned for spamming', retryAfter: Math.ceil((banExpiry - now) / 1000) });
      return false;
    }
    bannedIPs.delete(ip);
  }

  // Rate limiting
  const record = requestCounts.get(ip);
  if (!record || now - record.windowStart > RATE_WINDOW) {
    requestCounts.set(ip, { count: 1, windowStart: now });
    return true;
  }

  record.count++;
  if (record.count > RATE_LIMIT) {
    bannedIPs.set(ip, now + BAN_DURATION);
    requestCounts.delete(ip);
    reply.status(429).send({ error: 'Banned for spamming', retryAfter: BAN_DURATION / 1000 });
    return false;
  }

  return true;
}

export async function likesRoutes(app: FastifyInstance): Promise<void> {
  const handlers = createLikesHandlers();

  // GET /likes/:slug - get like count for a post
  app.get<{ Params: { slug: string } }>('/likes/:slug', async (req) => {
    return handlers.get({ slug: req.params.slug });
  });

  // POST /likes/:slug - increment like count (rate limited)
  app.post<{ Params: { slug: string } }>('/likes/:slug', async (req, reply) => {
    if (!checkRateLimit(req, reply)) return;
    return handlers.increment({ slug: req.params.slug });
  });
}

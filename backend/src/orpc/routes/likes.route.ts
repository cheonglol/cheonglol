import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createLikesHandlers } from '../handlers/likes.handler';

// Rate limiting config
const RATE_LIMIT = 10; // max requests per window (stricter)
const RATE_WINDOW = 60_000; // 1 minute
const BAN_DURATION = 48 * 60 * 60 * 1000; // 48 hours
const SLUG_COOLDOWN = 3_000; // 3 seconds cooldown per IP+slug combo

const requestCounts = new Map<string, { count: number; windowStart: number }>();
const bannedIPs = new Map<string, number>(); // IP -> ban expiry timestamp
const slugCooldowns = new Map<string, number>(); // "IP:slug" -> last request timestamp

// Cleanup old entries periodically (prevent memory leak)
setInterval(() => {
  const now = Date.now();
  for (const [key, expiry] of bannedIPs) {
    if (now > expiry) bannedIPs.delete(key);
  }
  for (const [key, time] of slugCooldowns) {
    if (now - time > SLUG_COOLDOWN * 2) slugCooldowns.delete(key);
  }
  for (const [key, record] of requestCounts) {
    if (now - record.windowStart > RATE_WINDOW * 2) requestCounts.delete(key);
  }
}, 60_000);

function getClientIP(req: FastifyRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.ip;
}

function checkRateLimit(req: FastifyRequest, reply: FastifyReply, slug?: string): boolean {
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

  // Per-slug cooldown (prevent rapid toggle spam)
  if (slug) {
    const cooldownKey = `${ip}:${slug}`;
    const lastRequest = slugCooldowns.get(cooldownKey);
    if (lastRequest && now - lastRequest < SLUG_COOLDOWN) {
      reply.status(429).send({ error: 'Too fast, please wait', retryAfter: Math.ceil((SLUG_COOLDOWN - (now - lastRequest)) / 1000) });
      return false;
    }
    slugCooldowns.set(cooldownKey, now);
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

  // GET /likes/:slug?userId=xxx - get like count and user's like status
  app.get<{ Params: { slug: string }; Querystring: { userId?: string } }>(
    '/likes/:slug',
    async (req) => {
      const userId = req.query.userId || '';
      return handlers.get({ slug: req.params.slug, userId });
    }
  );

  // POST /likes/:slug - like a post (rate limited)
  app.post<{ Params: { slug: string }; Body: { userId: string } }>(
    '/likes/:slug',
    async (req, reply) => {
      if (!checkRateLimit(req, reply, req.params.slug)) return;
      const userId = req.body?.userId || '';
      if (!userId) {
        reply.status(400).send({ error: 'userId is required' });
        return;
      }
      return handlers.like({ slug: req.params.slug, userId });
    }
  );

  // DELETE /likes/:slug - unlike a post (rate limited)
  app.delete<{ Params: { slug: string }; Body: { userId: string } }>(
    '/likes/:slug',
    async (req, reply) => {
      if (!checkRateLimit(req, reply, req.params.slug)) return;
      const userId = req.body?.userId || '';
      if (!userId) {
        reply.status(400).send({ error: 'userId is required' });
        return;
      }
      return handlers.unlike({ slug: req.params.slug, userId });
    }
  );
}

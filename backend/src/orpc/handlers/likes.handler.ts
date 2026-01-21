import type { PostLike } from '../contract';

// Lazy Prisma client with Prisma 7 adapter
let prisma: any = null;
let prismaError: string | null = null;

async function getPrisma() {
  if (prisma !== null) return prisma || null;
  try {
    const { Pool } = await import('pg');
    const { PrismaPg } = await import('@prisma/adapter-pg');
    const { PrismaClient } = await import('@prisma/client');

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
    console.log('[likes] Prisma connected');
  } catch (err) {
    prismaError = String(err);
    console.error('[likes] Prisma failed to connect:', err);
    prisma = false;
  }
  return prisma || null;
}

export function createLikesHandlers() {
  return {
    async get({ slug }: { slug: string }): Promise<PostLike> {
      const db = await getPrisma();
      if (!db) {
        console.warn('[likes] No DB connection, returning 0. Error:', prismaError);
        return { slug, count: 0 };
      }
      try {
        const like = await db.postLike.findUnique({ where: { slug } });
        return like ?? { slug, count: 0 };
      } catch (err) {
        console.error('[likes] GET error:', err);
        return { slug, count: 0 };
      }
    },

    async increment({ slug }: { slug: string }): Promise<PostLike> {
      const db = await getPrisma();
      if (!db) {
        console.warn('[likes] No DB connection, returning 0. Error:', prismaError);
        return { slug, count: 0 };
      }
      try {
        const like = await db.postLike.upsert({
          where: { slug },
          update: { count: { increment: 1 } },
          create: { slug, count: 1 },
        });
        console.log('[likes] Incremented:', slug, 'count:', like.count);
        return like;
      } catch (err) {
        console.error('[likes] INCREMENT error:', err);
        return { slug, count: 0 };
      }
    },
  };
}

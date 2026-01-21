// Response type for likes
export type LikeResponse = {
  slug: string;
  count: number;
  userLiked: boolean;
};

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
    async get({ slug, userId }: { slug: string; userId: string }): Promise<LikeResponse> {
      const db = await getPrisma();
      if (!db) {
        console.warn('[likes] No DB connection. Error:', prismaError);
        return { slug, count: 0, userLiked: false };
      }
      try {
        // Count total likes for this post
        const count = await db.userLike.count({ where: { slug } });
        // Check if this user has liked
        const userLike = userId
          ? await db.userLike.findUnique({ where: { slug_userId: { slug, userId } } })
          : null;
        return { slug, count, userLiked: !!userLike };
      } catch (err) {
        console.error('[likes] GET error:', err);
        return { slug, count: 0, userLiked: false };
      }
    },

    async like({ slug, userId }: { slug: string; userId: string }): Promise<LikeResponse> {
      const db = await getPrisma();
      if (!db || !userId) {
        console.warn('[likes] No DB connection or userId. Error:', prismaError);
        return { slug, count: 0, userLiked: false };
      }
      try {
        // Try to create the like (will fail if already exists due to unique constraint)
        await db.userLike.create({
          data: { slug, userId },
        });
        console.log('[likes] User liked:', slug, 'userId:', userId.slice(0, 8));
        const count = await db.userLike.count({ where: { slug } });
        return { slug, count, userLiked: true };
      } catch (err: any) {
        // If unique constraint violation, user already liked
        if (err?.code === 'P2002') {
          const count = await db.userLike.count({ where: { slug } });
          return { slug, count, userLiked: true };
        }
        console.error('[likes] LIKE error:', err);
        return { slug, count: 0, userLiked: false };
      }
    },

    async unlike({ slug, userId }: { slug: string; userId: string }): Promise<LikeResponse> {
      const db = await getPrisma();
      if (!db || !userId) {
        console.warn('[likes] No DB connection or userId. Error:', prismaError);
        return { slug, count: 0, userLiked: false };
      }
      try {
        // Try to delete the like
        await db.userLike.delete({
          where: { slug_userId: { slug, userId } },
        });
        console.log('[likes] User unliked:', slug, 'userId:', userId.slice(0, 8));
        const count = await db.userLike.count({ where: { slug } });
        return { slug, count, userLiked: false };
      } catch (err: any) {
        // If not found, user hasn't liked
        if (err?.code === 'P2025') {
          const count = await db.userLike.count({ where: { slug } });
          return { slug, count, userLiked: false };
        }
        console.error('[likes] UNLIKE error:', err);
        return { slug, count: 0, userLiked: false };
      }
    },
  };
}

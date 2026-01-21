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
        return { slug, count: 0, userLiked: false };
      }
      try {
        const count = await db.userLike.count({ where: { slug } });
        const userLike = userId
          ? await db.userLike.findUnique({ where: { slug_userId: { slug, userId } } })
          : null;
        return { slug, count, userLiked: !!userLike };
      } catch (err) {
        console.error('[likes] GET error:', err);
        return { slug, count: 0, userLiked: false };
      }
    },

    async toggle({ slug, userId }: { slug: string; userId: string }): Promise<LikeResponse> {
      const db = await getPrisma();
      if (!db || !userId) {
        return { slug, count: 0, userLiked: false };
      }
      try {
        // Check if user already liked
        const existing = await db.userLike.findUnique({
          where: { slug_userId: { slug, userId } },
        });

        if (existing) {
          // Unlike
          await db.userLike.delete({ where: { slug_userId: { slug, userId } } });
          const count = await db.userLike.count({ where: { slug } });
          return { slug, count, userLiked: false };
        } else {
          // Like
          await db.userLike.create({ data: { slug, userId } });
          const count = await db.userLike.count({ where: { slug } });
          return { slug, count, userLiked: true };
        }
      } catch (err) {
        console.error('[likes] TOGGLE error:', err);
        const count = await db.userLike.count({ where: { slug } }).catch(() => 0);
        return { slug, count, userLiked: false };
      }
    },
  };
}

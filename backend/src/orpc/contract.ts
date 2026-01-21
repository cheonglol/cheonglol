// Authoritative oRPC contract for the application (types + procedure signatures)
import { z } from 'zod';

export const PostLike = z.object({
  slug: z.string(),
  count: z.number(),
});

export type PostLike = z.infer<typeof PostLike>;

export const AppContract = {
  likes: {
    get: {
      input: z.object({ slug: z.string() }),
      output: PostLike,
    },
    increment: {
      input: z.object({ slug: z.string() }),
      output: PostLike,
    },
  },
} as const;

export type AppContract = typeof AppContract;

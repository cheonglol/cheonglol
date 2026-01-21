import type { PostLike } from '../contract';

export async function createLikesHandlers() {
  return {
    async get({ slug }: { slug: string }): Promise<PostLike> {
      return { slug, count: 0 };
    },
  };
}

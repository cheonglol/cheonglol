import type { FastifyInstance } from 'fastify';
import { createLikesHandlers } from '../handlers/likes.handler';

export async function likesRoutes(app: FastifyInstance): Promise<void> {
  const handlers = await createLikesHandlers();

  // GET /likes/:slug - get like count for a post
  app.get<{ Params: { slug: string } }>('/likes/:slug', async (req) => {
    return handlers.get({ slug: req.params.slug });
  });
}

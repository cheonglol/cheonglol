import type { FastifyInstance } from 'fastify';
import { createCounterHandlers } from '../handlers/counter.handler';

export async function counterRoutes(app: FastifyInstance): Promise<void> {
  const handlers = await createCounterHandlers();

  // GET /counter - get current counter value
  app.get('/counter', async () => {
    return handlers.get();
  });

  // POST /counter/increment - increment counter
  app.post('/counter/increment', async () => {
    return handlers.increment();
  });
}

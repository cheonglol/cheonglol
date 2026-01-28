// Authoritative oRPC contract for the application (types + procedure signatures)
import { z } from 'zod';

export const CounterResponse = z.object({
  value: z.number(),
});

export type CounterResponse = z.infer<typeof CounterResponse>;

export const AppContract = {
  counter: {
    get: {
      input: z.object({}),
      output: CounterResponse,
    },
    increment: {
      input: z.object({}),
      output: CounterResponse,
    },
  },
} as const;

export type AppContract = typeof AppContract;

import { PrismaClient } from '@prisma/client';
import type { CounterResponse } from '../contract';

const prisma = new PrismaClient();

export async function createCounterHandlers() {
  // Ensure counter exists
  let counter = await prisma.counter.findFirst();
  if (!counter) {
    counter = await prisma.counter.create({ data: {} });
  }

  return {
    async get(): Promise<CounterResponse> {
      const counter = await prisma.counter.findFirst();
      return { value: counter?.value ?? 0 };
    },
    async increment(): Promise<CounterResponse> {
      const counter = await prisma.counter.findFirst();
      if (!counter) {
        const newCounter = await prisma.counter.create({ data: { value: 1 } });
        return { value: newCounter.value };
      }
      const updated = await prisma.counter.update({
        where: { id: counter.id },
        data: { value: { increment: 1 } },
      });
      return { value: updated.value };
    },
  };
}

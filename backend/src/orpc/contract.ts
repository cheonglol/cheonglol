// Authoritative oRPC contract for the application (types + procedure signatures)
import { z } from 'zod';

export const AppContract = {} as const;

export type AppContract = typeof AppContract;

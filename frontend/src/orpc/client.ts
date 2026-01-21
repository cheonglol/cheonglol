// Lightweight, typed wrapper for calling the backend oRPC endpoints.
// TODO: replace with `@orpc/react-query` + a proper transport once the contract is published/imported.
import type { Post } from '../types/orpc';

// Backend URL: use env var in prod, localhost in dev
const API_BASE = import.meta.env.PUBLIC_API_URL || 'http://localhost:4000';

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.ok === true;
  } catch {
    return false;
  }
}

export async function fetchPosts(): Promise<Post[]> {
  const res = await fetch(`${API_BASE}/api/orpc/posts.getAll`);
  if (!res.ok) throw new Error('failed to fetch posts');
  return res.json();
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const res = await fetch(`${API_BASE}/api/orpc/posts.getBySlug/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

export type { Post };

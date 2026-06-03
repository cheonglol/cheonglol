import { useQuery } from '@tanstack/react-query';
import type { Post } from '../types/orpc';

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:4000';

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/api/posts`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export function usePosts() {
  return useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 60_000,
  });
}

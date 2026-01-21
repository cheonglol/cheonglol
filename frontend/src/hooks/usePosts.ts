import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Post } from '../types/orpc';

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:4000';

// Posts
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

// Likes
export type PostLike = {
  slug: string;
  count: number;
};

async function fetchLikes(slug: string): Promise<PostLike> {
  const res = await fetch(`${API_URL}/api/likes/${slug}`);
  if (!res.ok) return { slug, count: 0 };
  return res.json();
}

async function incrementLike(slug: string): Promise<PostLike> {
  const res = await fetch(`${API_URL}/api/likes/${slug}`, { method: 'POST' });
  if (!res.ok) return { slug, count: 0 };
  return res.json();
}

export function useLikes(slug: string) {
  return useQuery<PostLike, Error>({
    queryKey: ['likes', slug],
    queryFn: () => fetchLikes(slug),
    staleTime: 30_000,
  });
}

export function useLikeMutation(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => incrementLike(slug),
    onSuccess: (data) => {
      queryClient.setQueryData(['likes', slug], data);
    },
  });
}

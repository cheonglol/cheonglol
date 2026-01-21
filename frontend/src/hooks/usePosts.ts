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
  userLiked: boolean;
};

async function fetchLikes(slug: string, userId: string): Promise<PostLike> {
  const res = await fetch(`${API_URL}/api/likes/${slug}?userId=${userId}`);
  if (!res.ok) return { slug, count: 0, userLiked: false };
  return res.json();
}

async function toggleLike(slug: string, userId: string): Promise<PostLike> {
  const res = await fetch(`${API_URL}/api/likes/${slug}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error('Failed to toggle like');
  return res.json();
}

export function useLikes(slug: string, userId: string) {
  return useQuery<PostLike, Error>({
    queryKey: ['likes', slug, userId],
    queryFn: () => fetchLikes(slug, userId),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    enabled: !!slug && !!userId,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useToggleLike(slug: string, userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => toggleLike(slug, userId),
    onSuccess: (data) => {
      queryClient.setQueryData(['likes', slug, userId], data);
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

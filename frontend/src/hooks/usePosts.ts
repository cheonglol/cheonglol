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

async function incrementLike(slug: string, userId: string): Promise<PostLike> {
  const res = await fetch(`${API_URL}/api/likes/${slug}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) return { slug, count: 0, userLiked: false };
  return res.json();
}

async function decrementLike(slug: string, userId: string): Promise<PostLike> {
  const res = await fetch(`${API_URL}/api/likes/${slug}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) return { slug, count: 0, userLiked: false };
  return res.json();
}

export function useLikes(slug: string, userId: string) {
  return useQuery<PostLike, Error>({
    queryKey: ['likes', slug, userId],
    queryFn: () => fetchLikes(slug, userId),
    staleTime: 30_000,
    enabled: !!userId,
  });
}

export function useLikeMutation(slug: string, userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => incrementLike(slug, userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['likes', slug, userId] });
      const previous = queryClient.getQueryData<PostLike>(['likes', slug, userId]);
      queryClient.setQueryData<PostLike>(['likes', slug, userId], (old) => ({
        slug,
        count: (old?.count ?? 0) + 1,
        userLiked: true,
      }));
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['likes', slug, userId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['likes', slug, userId] });
    },
  });
}

export function useUnlikeMutation(slug: string, userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => decrementLike(slug, userId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['likes', slug, userId] });
      const previous = queryClient.getQueryData<PostLike>(['likes', slug, userId]);
      queryClient.setQueryData<PostLike>(['likes', slug, userId], (old) => ({
        slug,
        count: Math.max(0, (old?.count ?? 0) - 1),
        userLiked: false,
      }));
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['likes', slug, userId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['likes', slug, userId] });
    },
  });
}

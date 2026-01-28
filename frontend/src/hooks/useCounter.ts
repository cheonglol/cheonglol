import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:4000';

// Counter
export type CounterResponse = {
  value: number;
};

async function fetchCounter(): Promise<CounterResponse> {
  const res = await fetch(`${API_URL}/api/counter`);
  if (!res.ok) throw new Error('Failed to fetch counter');
  return res.json();
}

async function incrementCounter(): Promise<CounterResponse> {
  const res = await fetch(`${API_URL}/api/counter/increment`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to increment counter');
  return res.json();
}

export function useCounter() {
  return useQuery<CounterResponse, Error>({
    queryKey: ['counter'],
    queryFn: fetchCounter,
    staleTime: 30_000,
  });
}

export function useIncrementCounter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: incrementCounter,
    onSuccess: (data) => {
      queryClient.setQueryData(['counter'], data);
    },
  });
}

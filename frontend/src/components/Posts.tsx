import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { HealthGate } from "./HealthGate";
import PostsList from "./PostsList";

/**
 * React island for posts from the API.
 */
export function Posts() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HealthGate>
        <PostsList />
      </HealthGate>
    </QueryClientProvider>
  );
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { HealthGate } from "../HealthGate";
import PostsList from "./PostsList";

/**
 * Self-contained React island for backend posts.
 * Includes its own QueryClientProvider to avoid SSR context issues.
 */
export function BackendPosts() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HealthGate>
        <PostsList />
      </HealthGate>
    </QueryClientProvider>
  );
}

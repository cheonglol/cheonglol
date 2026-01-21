import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { HealthGate } from "./HealthGate";

interface Props {
  children: ReactNode;
}

export function AppProvider({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HealthGate>{children}</HealthGate>
    </QueryClientProvider>
  );
}

import { type ReactNode } from "react";
import { useHealthCheck } from "../hooks/useHealthCheck";

interface Props {
  children: ReactNode;
  loadingText?: string;
}

export function HealthGate({
  children,
  loadingText = "Connecting to backend...",
}: Props) {
  const { isHealthy, isChecking } = useHealthCheck();

  if (isChecking || !isHealthy) {
    return (
      <div className="loading">
        <p>{loadingText}</p>
        <p className="text-muted">Retrying every 5 seconds...</p>
      </div>
    );
  }

  return <>{children}</>;
}

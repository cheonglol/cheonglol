import { useState, useEffect } from 'react';
import { checkHealth } from '../orpc/client';

/**
 * Single health check on mount. No retries - if backend is down,
 * we just show the static content without likes.
 */
export function useHealthCheck() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    checkHealth().then((healthy) => {
      if (!cancelled) {
        setIsHealthy(healthy);
        setIsChecking(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { isHealthy, isChecking };
}

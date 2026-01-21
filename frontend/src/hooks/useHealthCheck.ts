import { useState, useEffect, useCallback } from 'react';
import { checkHealth } from '../orpc/client';

const RETRY_INTERVAL = 5000;

export function useHealthCheck() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const check = useCallback(async () => {
    const healthy = await checkHealth();
    if (healthy) {
      setIsHealthy(true);
      setIsChecking(false);
    }
    return healthy;
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const runCheck = async () => {
      const healthy = await check();
      if (!healthy && !cancelled) {
        timeoutId = setTimeout(runCheck, RETRY_INTERVAL);
      }
    };

    runCheck();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [check]);

  return { isHealthy, isChecking };
}

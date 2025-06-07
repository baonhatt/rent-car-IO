import { useState, useEffect, useCallback } from 'react';

export function useThrottle<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const [lastRun, setLastRun] = useState<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    if (now - lastRun >= delay) {
      setThrottledValue(value);
      setLastRun(now);
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value);
        setLastRun(Date.now());
      }, delay - (now - lastRun));
      return () => clearTimeout(timer);
    }
  }, [value, delay, lastRun]);

  return throttledValue;
}

// Example usage:
// const searchTerm = useThrottle(inputValue, 300); // Throttle for 300ms 
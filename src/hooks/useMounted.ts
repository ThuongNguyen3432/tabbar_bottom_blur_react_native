import { useCallback, useEffect, useRef } from 'react';

/**
 * Guards a state update that lands after unmount.
 *
 * Returns a getter rather than a boolean: a boolean captured at render time is
 * stale by the time the async work finishes, which is exactly when it matters.
 */
export function useMounted(): () => boolean {
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return useCallback(() => mounted.current, []);
}

import { useEffect, useState } from 'react';

import { appConfig } from '../config';

/**
 * Delays a value until it stops changing.
 *
 * The timer is cleared on every change, so a fast typist fires one request at
 * the end instead of one per keystroke.
 */
export function useDebounce<T>(value: T, delayMs = appConfig.ui.debounceMs): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

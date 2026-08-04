import { useCallback, useEffect, useState } from 'react';

import type { PermissionName, PermissionStatus } from '../constants/permissions';
import { checkPermission, requestPermission } from '../core/permissions';
import { useMounted } from './useMounted';

/**
 * Current status plus a way to ask.
 *
 * Checking on mount is deliberately separate from requesting: showing the
 * system prompt the moment a screen opens, before the user has done anything
 * that needs the permission, is the fastest way to get a permanent refusal.
 */
export function usePermission(name: PermissionName) {
  const [status, setStatus] = useState<PermissionStatus | null>(null);
  const isMounted = useMounted();

  useEffect(() => {
    void checkPermission(name).then(result => {
      if (isMounted()) {
        setStatus(result);
      }
    });
  }, [name, isMounted]);

  const request = useCallback(async () => {
    const result = await requestPermission(name);
    if (isMounted()) {
      setStatus(result);
    }
    return result;
  }, [name, isMounted]);

  return { status, request, isGranted: status === 'granted' };
}

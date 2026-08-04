import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import {
  subscribeToNetwork,
  UNKNOWN_STATUS,
  type NetworkStatus,
} from '../../core/network';

const NetworkContext = createContext<NetworkStatus>(UNKNOWN_STATUS);

/**
 * One NetInfo subscription for the whole app.
 *
 * Every component that called the hook directly would open its own listener,
 * and NetInfo polls; a single subscription broadcast through context costs one.
 */
export function NetworkProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<NetworkStatus>(UNKNOWN_STATUS);

  useEffect(() => subscribeToNetwork(setStatus), []);

  const value = useMemo(() => status, [status]);

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

export function useNetwork(): NetworkStatus {
  return useContext(NetworkContext);
}

/**
 * Offline only when the device is sure. `isInternetReachable` is null while
 * unknown, and treating that as offline flashes a banner on every launch.
 */
export function useIsOffline(): boolean {
  const { isConnected, isInternetReachable } = useNetwork();
  return !isConnected || isInternetReachable === false;
}

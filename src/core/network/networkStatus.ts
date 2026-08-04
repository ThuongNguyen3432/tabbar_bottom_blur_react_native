import NetInfo, {
  NetInfoStateType,
  type NetInfoState,
} from '@react-native-community/netinfo';

export type NetworkStatus = {
  /** The radio is up. Says nothing about whether traffic reaches anywhere. */
  isConnected: boolean;
  /**
   * The device believes it can reach the internet. Null while unknown — on
   * Android the check is asynchronous and starts unresolved.
   */
  isInternetReachable: boolean | null;
  type: NetInfoState['type'];
};

export const UNKNOWN_STATUS: NetworkStatus = {
  isConnected: true,
  isInternetReachable: null,
  type: NetInfoStateType.unknown,
};

function toStatus(state: NetInfoState): NetworkStatus {
  return {
    isConnected: state.isConnected ?? false,
    isInternetReachable: state.isInternetReachable,
    type: state.type,
  };
}

/**
 * Starts optimistic rather than offline: the first callback can take a moment,
 * and flashing an offline banner on every launch is worse than being briefly
 * wrong.
 */
export function subscribeToNetwork(onChange: (status: NetworkStatus) => void): () => void {
  return NetInfo.addEventListener(state => onChange(toStatus(state)));
}

export async function getNetworkStatus(): Promise<NetworkStatus> {
  try {
    return toStatus(await NetInfo.fetch());
  } catch {
    return UNKNOWN_STATUS;
  }
}

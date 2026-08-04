import { env } from './env';

/** Tunables the app reads at runtime. Values, not behaviour. */
export const appConfig = {
  api: {
    baseUrl: env.apiUrl,
    /** Aborts a request that has not responded, in milliseconds. */
    timeout: 30_000,
    /** Retries for network-level failures; 4xx and 5xx are never retried. */
    maxRetries: 2,
  },
  auth: {
    /** Refresh this long before the access token actually expires. */
    refreshSkewMs: 60_000,
  },
  ui: {
    /** How long a tap has to be held to count as a long press. */
    longPressDelayMs: 400,
    debounceMs: 300,
  },
  pagination: {
    pageSize: 20,
  },
} as const;

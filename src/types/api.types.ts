/** The envelope every endpoint speaks, and the error shape it fails with. */

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

/**
 * What the server returns on failure.
 *
 * `code` is the stable, machine-readable half — messages get reworded, codes do
 * not, so branching logic reads `code` and only the UI reads `message`.
 */
export type ApiErrorBody = {
  code: string;
  message: string;
  /** Field name -> what is wrong with it, for form errors. */
  fields?: Record<string, string>;
};

/**
 * A failure after normalisation, so callers handle one shape whether the
 * request died in transport, timed out, or came back 4xx.
 */
export type NormalisedApiError = {
  kind: 'http' | 'network' | 'timeout' | 'parse' | 'unknown';
  /** Absent when the request never reached the server. */
  status?: number;
  code: string;
  message: string;
  fields?: Record<string, string>;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  /** Unix milliseconds. */
  expiresAt: number;
};

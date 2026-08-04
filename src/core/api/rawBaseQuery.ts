import { fetchBaseQuery, type BaseQueryFn } from '@reduxjs/toolkit/query';
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

import { appConfig } from '../../config';
import { tokenStorage } from '../storage/tokenStorage';
import type { BaseQueryError } from './api.types';

/**
 * The transport, without any auth-retry logic — that lives in
 * baseQueryWithReauth, which wraps this.
 */
const fetchQuery = fetchBaseQuery({
  baseUrl: appConfig.api.baseUrl,
  timeout: appConfig.api.timeout,
  prepareHeaders: headers => {
    const tokens = tokenStorage.peek();
    if (tokens) {
      headers.set('authorization', `Bearer ${tokens.accessToken}`);
    }
    headers.set('accept', 'application/json');
    return headers;
  },
});

/**
 * Flattens RTK Query's error union into one shape.
 *
 * Its FetchBaseQueryError is a union tagged by `status`, where the status can
 * be a number, 'FETCH_ERROR', 'TIMEOUT_ERROR' or 'PARSING_ERROR'. Callers
 * should not have to destructure that at every call site.
 */
export function normaliseError(error: FetchBaseQueryError): BaseQueryError {
  if (typeof error.status === 'number') {
    const body = error.data as { code?: string; message?: string; fields?: Record<string, string> } | undefined;
    return {
      kind: 'http',
      status: error.status,
      code: body?.code ?? `http_${error.status}`,
      message: body?.message ?? `Request failed with status ${error.status}`,
      fields: body?.fields,
    };
  }

  switch (error.status) {
    case 'TIMEOUT_ERROR':
      return { kind: 'timeout', code: 'timeout', message: 'The request timed out' };
    case 'PARSING_ERROR':
      return { kind: 'parse', code: 'parse_error', message: 'The response could not be read' };
    case 'FETCH_ERROR':
      return { kind: 'network', code: 'network_error', message: 'No connection' };
    default:
      return { kind: 'unknown', code: 'unknown', message: 'Something went wrong' };
  }
}

export const rawBaseQuery: BaseQueryFn<string | FetchArgs, unknown, BaseQueryError> =
  async (args, api, extraOptions) => {
    const result = await fetchQuery(args, api, extraOptions);
    if (result.error) {
      return { error: normaliseError(result.error) };
    }
    return { data: result.data };
  };

import type { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query';

import { appConfig } from '../../config';
import { tokenStorage } from '../storage/tokenStorage';
import type { BaseQueryError, RefreshResponse } from './api.types';
import { rawBaseQuery } from './rawBaseQuery';
import { refreshMutex } from './refreshMutex';

/** Emitted when refresh fails, so the auth slice can clear its own state. */
export const SESSION_EXPIRED = 'auth/sessionExpired' as const;

async function refreshTokens(): Promise<boolean> {
  const current = tokenStorage.peek();
  if (!current?.refreshToken) {
    return false;
  }

  // Deliberately the raw query: the refresh call must not recurse into this
  // wrapper, or a failing refresh would trigger another refresh.
  const result = await rawBaseQuery(
    {
      url: '/auth/refresh',
      method: 'POST',
      body: { refreshToken: current.refreshToken },
    },
    // The refresh endpoint needs neither dispatch nor state.
    { signal: new AbortController().signal } as never,
    {},
  );

  if (result.error) {
    return false;
  }

  const body = result.data as RefreshResponse;
  await tokenStorage.save({
    accessToken: body.accessToken,
    refreshToken: body.refreshToken,
    expiresAt: Date.now() + body.expiresIn * 1000 - appConfig.auth.refreshSkewMs,
  });
  return true;
}

/**
 * Retries a 401 once, after refreshing.
 *
 * All concurrent 401s funnel through {@link refreshMutex}, so one refresh
 * happens and everyone else waits for it — with single-use refresh tokens, a
 * burst of parallel refreshes would invalidate the session.
 *
 * Only 401 is retried. A 403 means the token is fine and the action is not
 * allowed, and retrying it would loop.
 */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  BaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) {
    return result;
  }

  const refreshed = refreshMutex.isLocked()
    ? await refreshMutex.wait()
    : await refreshMutex.run(refreshTokens);

  if (!refreshed) {
    await tokenStorage.clear();
    api.dispatch({ type: SESSION_EXPIRED });
    return result;
  }

  result = await rawBaseQuery(args, api, extraOptions);
  return result;
};

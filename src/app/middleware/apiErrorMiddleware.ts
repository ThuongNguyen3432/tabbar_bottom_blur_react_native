import { isRejectedWithValue, type Middleware } from '@reduxjs/toolkit';

import { featureFlags } from '../../config';
import { crashReporting } from '../../core/crash-reporting';
import { logger } from '../../core/logger';
import type { NormalisedApiError } from '../../types/api.types';

const log = logger('api');

/**
 * One place every failed request is observed.
 *
 * RTK Query rejects with a value rather than throwing, so a global catch would
 * never see these — this listens for that rejection instead.
 *
 * It only reports. Deciding what the user sees belongs to the screen, which
 * knows whether the request was a background refresh or something they asked
 * for.
 */
export const apiErrorMiddleware: Middleware = () => next => action => {
  if (isRejectedWithValue(action)) {
    const error = action.payload as NormalisedApiError | undefined;

    log.warn(`${error?.code ?? 'unknown'} — ${error?.message ?? 'no message'}`, {
      status: error?.status,
    });

    // 401 is ordinary: the reauth wrapper already retried, and a logged-out
    // user is not a crash.
    const worthReporting =
      featureFlags.reportApiErrors && error?.kind === 'http' && error.status !== 401;

    if (worthReporting) {
      crashReporting.recordError(error, { source: 'api' });
    }
  }

  return next(action);
};

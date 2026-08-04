import { createListenerMiddleware } from '@reduxjs/toolkit';

import type { AppDispatch, RootState } from '../store';

/**
 * For side effects that react to actions — persisting a preference, clearing
 * caches on logout — without putting them in a reducer, which must stay pure.
 *
 * Features add listeners with `startAppListening`, which is this middleware's
 * `startListening` pre-typed with the app's state and dispatch.
 */
export const listenerMiddleware = createListenerMiddleware();

export const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>();

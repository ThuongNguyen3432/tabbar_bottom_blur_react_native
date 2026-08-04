import { combineReducers } from '@reduxjs/toolkit';

import { baseApi } from '../core/api';
import { authReducer } from '../features/auth/redux/authSlice';
import { settingsReducer } from '../features/settings/redux/settingsSlice';

/**
 * Feature slices plus the single RTK Query reducer.
 *
 * Kept apart from store.ts so the persist config can wrap it, and so the store
 * file stays about wiring rather than about which slices exist.
 */
export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  settings: settingsReducer,
});

export type RootReducerState = ReturnType<typeof rootReducer>;

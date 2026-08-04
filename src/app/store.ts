import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist';

import { env } from '../config';
import { baseApi } from '../core/api';
import { apiErrorMiddleware, listenerMiddleware } from './middleware';
import { persistedReducer } from './persistor';
import { rootReducer } from './rootReducer';

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist dispatches actions carrying non-serialisable callbacks.
        // Only these are exempt; everything else is still checked.
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .prepend(listenerMiddleware.middleware)
      .concat(baseApi.middleware, apiErrorMiddleware),
  devTools: env.isDev,
});

export const persistor = persistStore(store);

// Lets RTK Query refetch when the app returns to the foreground or regains a
// connection. Without it, cached data can stay stale indefinitely.
setupListeners(store.dispatch);

export type AppStore = typeof store;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

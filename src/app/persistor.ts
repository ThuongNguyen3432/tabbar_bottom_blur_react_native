import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';

import { featureFlags } from '../config';
import { rootReducer } from './rootReducer';

/**
 * What survives a restart.
 *
 * An allowlist, not a blocklist: a new slice has to opt in. `api` must never be
 * persisted — rehydrating a stale cache shows yesterday's data as though it
 * were fresh — and tokens live in the keychain, not here.
 *
 * The feature flag empties the list rather than swapping the reducer, so the
 * store always sees one reducer type. Branching on the reducer itself gives a
 * union that the store's generics cannot resolve.
 */
export const persistedReducer = persistReducer(
  {
    key: 'root',
    version: 1,
    storage: AsyncStorage,
    whitelist: featureFlags.persistStore ? ['settings'] : [],
  },
  rootReducer,
);

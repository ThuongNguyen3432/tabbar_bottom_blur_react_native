import { SECURE_KEYS } from '../../constants/storageKeys';
import type { AuthTokens } from '../../types/api.types';
import { secureStorage } from './secureStorage';

/**
 * The one place auth tokens are read and written.
 *
 * An in-memory copy backs every read because the API layer needs the access
 * token on each request, and hitting the keychain per request is both slow and
 * liable to fail while the device is locked.
 */
let cached: AuthTokens | null = null;

export const tokenStorage = {
  /** Synchronous, for request headers. Null until load() has run. */
  peek(): AuthTokens | null {
    return cached;
  },

  async load(): Promise<AuthTokens | null> {
    const [accessToken, refreshToken] = await Promise.all([
      secureStorage.get(SECURE_KEYS.accessToken),
      secureStorage.get(SECURE_KEYS.refreshToken),
    ]);

    if (!accessToken || !refreshToken) {
      cached = null;
      return null;
    }

    // expiresAt is not persisted separately: a token that outlives its stored
    // expiry is rejected by the server anyway, and the refresh flow handles it.
    cached = { accessToken, refreshToken, expiresAt: 0 };
    return cached;
  },

  async save(tokens: AuthTokens): Promise<void> {
    cached = tokens;
    await Promise.all([
      secureStorage.set(SECURE_KEYS.accessToken, tokens.accessToken),
      secureStorage.set(SECURE_KEYS.refreshToken, tokens.refreshToken),
    ]);
  },

  async clear(): Promise<void> {
    cached = null;
    await Promise.all([
      secureStorage.remove(SECURE_KEYS.accessToken),
      secureStorage.remove(SECURE_KEYS.refreshToken),
    ]);
  },
};

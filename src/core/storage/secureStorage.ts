import * as Keychain from 'react-native-keychain';

/**
 * Keychain-backed storage for secrets.
 *
 * Each key gets its own keychain "service" so entries can be removed
 * independently; a single shared entry would mean rewriting all of them to
 * change one.
 *
 * The keychain is unavailable while the device is locked, so every call can
 * fail for reasons that are not the caller's fault — hence the same
 * never-throw contract as plain storage.
 */
export const secureStorage = {
  async get(key: string): Promise<string | null> {
    try {
      const entry = await Keychain.getGenericPassword({ service: key });
      return entry ? entry.password : null;
    } catch {
      return null;
    }
  },

  async set(key: string, value: string): Promise<boolean> {
    try {
      // The username is unused but required; the key doubles as a label.
      await Keychain.setGenericPassword(key, value, { service: key });
      return true;
    } catch {
      return false;
    }
  },

  async remove(key: string): Promise<boolean> {
    try {
      await Keychain.resetGenericPassword({ service: key });
      return true;
    } catch {
      return false;
    }
  },
};

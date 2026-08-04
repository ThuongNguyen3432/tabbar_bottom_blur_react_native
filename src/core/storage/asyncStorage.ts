import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Typed wrapper over AsyncStorage.
 *
 * Reads never throw: a storage failure means "no value", which every caller can
 * already handle, whereas a rejection forces a try/catch around every lookup.
 * Writes report success so callers that care can react.
 */
export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      return raw === null ? null : (JSON.parse(raw) as T);
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  async remove(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  /** Only the app's own keys — never AsyncStorage.clear(), which is global. */
  async removeMany(keys: string[]): Promise<boolean> {
    try {
      // async-storage 3 dropped multiRemove; the keys are few enough that
      // removing them in parallel costs nothing.
      await Promise.all(keys.map(key => AsyncStorage.removeItem(key)));
      return true;
    } catch {
      return false;
    }
  },
};

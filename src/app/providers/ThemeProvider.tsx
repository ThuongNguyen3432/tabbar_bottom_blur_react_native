import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_THEME_MODE, type ThemeMode } from '../../constants/app';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { ThemeContext, themes, type ThemeContextValue } from '../../theme';

/**
 * Holds the user's choice of light, dark, or follow-the-system.
 *
 * The choice and the resulting palette are separate: `system` is a real, stored
 * option, so remembering it as "dark" would silently stop following the OS the
 * next time the user switched appearance.
 *
 * Children render immediately rather than waiting on storage. Blocking would
 * mean a blank frame on every launch to avoid one frame of the wrong palette;
 * `isReady` is exposed for anything that would rather wait.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_THEME_MODE);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    AsyncStorage.getItem(STORAGE_KEYS.themeMode)
      .then(stored => {
        if (cancelled) {
          return;
        }
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setModeState(stored);
        }
      })
      // A theme preference is not worth failing a launch over.
      .catch(() => {})
      .finally(() => {
        if (!cancelled) {
          setIsReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    // Applied first so the UI does not wait on the write.
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEYS.themeMode, next).catch(() => {});
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    // useColorScheme can also report null or 'unspecified' — on a device that
    // has no preference, and briefly during startup. Anything but 'dark' is
    // treated as light rather than indexed blindly.
    const resolved =
      mode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;
    return { theme: themes[resolved], mode, setMode, isReady };
  }, [mode, systemScheme, setMode, isReady]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

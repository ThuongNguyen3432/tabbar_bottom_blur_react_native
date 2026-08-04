import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

// Imported for its side effect: i18next.init() runs at module load, and
// without it useTranslation returns an uninitialised instance whose
// changeLanguage is undefined.
import '../../i18n';
import { persistor, store } from '../store';
import { LanguageProvider } from './LanguageProvider';
import { NetworkProvider } from './NetworkProvider';
import { ThemeProvider } from './ThemeProvider';

/**
 * Every provider, in the one order that works.
 *
 * GestureHandlerRootView has to be outermost or no gesture reaches the handler.
 * Redux comes before LanguageProvider, which reads from it. PersistGate waits
 * for rehydration so nothing renders against defaults and then jumps.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <GestureHandlerRootView style={styles.root}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <ThemeProvider>
              <LanguageProvider>
                <NetworkProvider>
                  <BottomSheetModalProvider>{children}</BottomSheetModalProvider>
                </NetworkProvider>
              </LanguageProvider>
            </ThemeProvider>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

/**
 * Spike: Android bottom tab bar with a real blur.
 * See docs/superpowers/specs/2026-07-30-android-blur-tabbar-design.md
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { linking } from './src/app/navigation/linking';
import { MainNavigator } from './src/app/navigation/MainNavigator';
import { ThemeProvider } from './src/app/providers/ThemeProvider';
import { useAppTheme } from './src/theme';

/**
 * Split from App so it sits *inside* ThemeProvider — the status bar and the
 * navigators both need the resolved theme, and a component cannot read a
 * context that it provides itself.
 */
function Root() {
  const theme = useAppTheme();

  return (
    <>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <BottomSheetModalProvider>
        <NavigationContainer linking={linking}>
          <MainNavigator />
        </NavigationContainer>
      </BottomSheetModalProvider>
    </>
  );
}

function App() {
  return (
    // GestureHandlerRootView has to be the outermost view, and needs flex: 1 —
    // without it neither the sheet's drag nor the drawer's swipe reaches the
    // gesture handler.
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider>
          <Root />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;

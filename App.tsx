/**
 * Entry point. Everything else lives under src/.
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';

import { linking } from './src/app/navigation/linking';
import { RootNavigator } from './src/app/navigation/RootNavigator';
import { AppProviders } from './src/app/providers';
import { AppToast } from './src/components';
import { useAppTheme } from './src/theme';

/**
 * Split from App so it sits *inside* AppProviders — the status bar and the
 * navigators both read the theme, and a component cannot read a context that
 * it provides itself.
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
      <NavigationContainer linking={linking}>
        <RootNavigator />
      </NavigationContainer>
      {/* Last, and outside the navigators, so toasts draw above sheets and
          modals rather than behind them. */}
      <AppToast />
    </>
  );
}

export default function App() {
  return (
    <AppProviders>
      <Root />
    </AppProviders>
  );
}

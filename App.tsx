/**
 * Spike: Android bottom tab bar with a real blur.
 * See docs/superpowers/specs/2026-07-30-android-blur-tabbar-design.md
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FeedScreen } from './src/screens/FeedScreen';
import { AnimatedTabIcon } from './src/tabbar/AnimatedTabIcon';
import { BlurTabBar } from './src/tabbar/BlurTabBar';
import type { IconName } from './src/tabbar/TabBarIcon';

const Tab = createBottomTabNavigator();

const ACTIVE_COLOR = '#ff2d55';
const INACTIVE_COLOR = '#4a4a4f';

const TABS: { name: string; icon: IconName }[] = [
  { name: 'Home', icon: 'home' },
  { name: 'Saved', icon: 'heart' },
  { name: 'Add', icon: 'plus' },
  { name: 'Search', icon: 'search' },
  { name: 'People', icon: 'people' },
];

function Tabs() {
  return (
    <Tab.Navigator
      tabBar={props => <BlurTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // Bottom tabs default to 'none' — screens snap between tabs with no
        // transition at all. 'shift' slides the outgoing screen out while the
        // incoming one slides in, which also keeps content moving under the
        // tab bar so the blur is visibly recomputing mid-transition.
        animation: 'shift',
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
      }}
    >
      {TABS.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={FeedScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon name={tab.icon} color={color} focused={focused} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

function App() {
  return (
    // GestureHandlerRootView has to be the outermost view, and needs flex: 1 —
    // without it the sheet's drag gestures never reach the handler.
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <BottomSheetModalProvider>
          <NavigationContainer>
            <Tabs />
          </NavigationContainer>
        </BottomSheetModalProvider>
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

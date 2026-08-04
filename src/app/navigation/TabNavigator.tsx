import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { SettingsScreen } from '../../features/settings/screens/SettingsScreen';
import { FeedScreen } from '../../screens/FeedScreen';
import { useAppTheme } from '../../theme';
import { AnimatedTabIcon } from '../../tabbar/AnimatedTabIcon';
import { BlurTabBar } from '../../tabbar/BlurTabBar';
import type { IconName } from '../../tabbar/TabBarIcon';
import type { MainTabParamList } from './navigation.types';

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabDef = {
  name: keyof MainTabParamList;
  icon: IconName;
  component: React.ComponentType<Record<string, never>>;
};

const TABS: TabDef[] = [
  { name: 'Home', icon: 'home', component: FeedScreen },
  { name: 'Saved', icon: 'heart', component: FeedScreen },
  { name: 'Add', icon: 'plus', component: FeedScreen },
  { name: 'Search', icon: 'search', component: FeedScreen },
  { name: 'Profile', icon: 'people', component: SettingsScreen },
];

export function TabNavigator() {
  const { colors } = useAppTheme();

  return (
    <Tab.Navigator
      tabBar={props => <BlurTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // Bottom tabs default to 'none' — screens snap between tabs with no
        // transition at all. 'shift' slides the outgoing screen out while the
        // incoming one slides in, which also keeps content moving under the tab
        // bar so the blur is visibly recomputing mid-transition.
        animation: 'shift',
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      {TABS.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
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

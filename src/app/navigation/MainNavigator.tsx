import { createDrawerNavigator } from '@react-navigation/drawer';

import { AboutScreen } from '../../features/settings/screens/AboutScreen';
import { useAppTheme } from '../../theme';
import { DrawerContent } from './DrawerContent';
import { TabNavigator } from './TabNavigator';
import type { MainDrawerParamList } from './navigation.types';

const Drawer = createDrawerNavigator<MainDrawerParamList>();

/**
 * Drawer over the tabs, not beside them.
 *
 * The tab navigator is one drawer screen, so opening the drawer slides the
 * whole tabbed UI aside and the tab bar keeps its state. Nesting it the other
 * way round would give every tab a drawer of its own.
 */
export function MainNavigator() {
  const { colors } = useAppTheme();

  return (
    <Drawer.Navigator
      drawerContent={props => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: { backgroundColor: colors.surface, width: 280 },
        // The default scrim is a fixed black; this one follows the palette.
        overlayColor: colors.scrim,
      }}
    >
      <Drawer.Screen
        name="Tabs"
        component={TabNavigator}
        options={{ title: 'Trang chính' }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{ title: 'Giới thiệu' }}
      />
    </Drawer.Navigator>
  );
}

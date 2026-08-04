import type { LinkingOptions } from '@react-navigation/native';

import type { MainDrawerParamList } from './navigation.types';

/**
 * Deep links.
 *
 * The nesting has to mirror whatever NavigationContainer actually renders —
 * React Navigation matches one level of config per level of navigator, and a
 * config that describes a navigator which is not mounted resolves nothing.
 *
 * App.tsx mounts MainNavigator directly, so the drawer is the root here. Once
 * RootNavigator is mounted instead, this needs an outer Auth/Main level to
 * match it again.
 */
export const linking: LinkingOptions<MainDrawerParamList> = {
  prefixes: ['tabbarblurlab://', 'https://example.com'],
  config: {
    screens: {
      Tabs: {
        screens: {
          Home: 'home',
          Saved: 'saved',
          Add: 'add',
          Search: 'search',
          Profile: 'profile/:userId?',
        },
      },
      About: 'about',
    },
  },
};

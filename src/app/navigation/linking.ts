import type { LinkingOptions } from '@react-navigation/native';

import type { RootStackParamList } from './navigation.types';

/**
 * Deep links.
 *
 * The nesting has to mirror whatever NavigationContainer actually renders —
 * React Navigation matches one level of config per level of navigator, and a
 * config that describes a navigator which is not mounted resolves nothing.
 *
 * App.tsx mounts RootNavigator, so the outer Auth/Main level is required — a
 * config describing a navigator that is not mounted matches nothing, which is
 * how a deep link silently lands on the default screen instead.
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['tabbarblurlab://', 'https://example.com'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
        },
      },
      Main: {
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
    },
  },
};

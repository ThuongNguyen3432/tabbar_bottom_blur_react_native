import type { NavigatorScreenParams } from '@react-navigation/native';

/**
 * Param lists for every navigator.
 *
 * Declared apart from the navigators themselves so screens can type their props
 * without importing the navigator that renders them — which would be a cycle.
 */

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  /** Carries the address forward so the user does not retype it. */
  ForgotPassword: { email?: string } | undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Saved: undefined;
  Add: undefined;
  Search: { query?: string } | undefined;
  Profile: { userId?: string } | undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

/**
 * Lets `navigation.navigate` be typed anywhere without passing generics, by
 * telling React Navigation what the root looks like.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

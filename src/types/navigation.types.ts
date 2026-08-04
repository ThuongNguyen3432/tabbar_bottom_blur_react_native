/**
 * Re-exported from the navigator that owns them.
 *
 * Param lists have to live next to the navigators — they reference screen
 * components — so this file only forwards them, giving the rest of the app a
 * stable `@/types` import that does not reach into `app/`.
 */
export type {
  RootStackParamList,
  AuthStackParamList,
  MainTabParamList,
} from '../app/navigation/navigation.types';

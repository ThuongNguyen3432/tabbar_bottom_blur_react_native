import { env } from './env';

/**
 * Build-time switches.
 *
 * Kept separate from {@link appConfig} because these are meant to be deleted:
 * a flag exists to let a half-finished feature ship dark, and should go once
 * the feature is on everywhere.
 */
export const featureFlags = {
  /** Route API failures through the crash reporter as well as the logger. */
  reportApiErrors: !env.isDev,
  /** Show the language picker in settings. */
  languageSwitcher: true,
  /** Persist the Redux store across launches. */
  persistStore: true,
} as const;

export type FeatureFlag = keyof typeof featureFlags;

/**
 * The one place raw environment values are read.
 *
 * React Native has no `process.env` at runtime beyond what the bundler inlines,
 * so values are declared here and swapped per build rather than loaded from a
 * file. Everything else in the app reads {@link appConfig}, never these.
 */

type Environment = 'development' | 'staging' | 'production';

const ENVIRONMENT: Environment = __DEV__ ? 'development' : 'production';

const API_URLS: Record<Environment, string> = {
  development: 'https://api.dev.example.com',
  staging: 'https://api.staging.example.com',
  production: 'https://api.example.com',
};

export const env = {
  environment: ENVIRONMENT,
  apiUrl: API_URLS[ENVIRONMENT],
  isDev: __DEV__,
} as const;

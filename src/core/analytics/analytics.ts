import { logger } from '../logger';

const log = logger('analytics');

export type AnalyticsEvent = {
  name: string;
  params?: Record<string, string | number | boolean>;
};

/**
 * Analytics behind an interface the app owns.
 *
 * No vendor is wired up. Call sites should not change when one is chosen, so
 * they target this shape and the implementation is swapped here.
 */
export interface AnalyticsClient {
  track(event: AnalyticsEvent): void;
  screen(name: string): void;
  identify(userId: string | null): void;
}

/** Logs in development and drops everything in release. */
export const analytics: AnalyticsClient = {
  track: event => log.debug(`track ${event.name}`, event.params),
  screen: name => log.debug(`screen ${name}`),
  identify: userId => log.debug(`identify ${userId ?? 'anonymous'}`),
};

import { logger } from '../logger';

const log = logger('crash');

export interface CrashReporter {
  recordError(error: unknown, context?: Record<string, unknown>): void;
  setUser(userId: string | null): void;
  leaveBreadcrumb(message: string): void;
}

/**
 * Same shape a real reporter would expose, so swapping one in is a change to
 * this file only. Until then errors go to the log rather than nowhere.
 */
export const crashReporting: CrashReporter = {
  recordError: (error, context) => log.error('recorded', { error, context }),
  setUser: userId => log.debug(`user ${userId ?? 'anonymous'}`),
  leaveBreadcrumb: message => log.debug(`breadcrumb ${message}`),
};

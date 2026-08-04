import { logger } from '../../core/logger';
import type { AppDispatch } from '../store';
import { restoreSession } from './restoreSession';

const log = logger('bootstrap');

/**
 * Everything that must finish before the first screen renders.
 *
 * Never rejects: a failure here would otherwise leave the app on its splash
 * screen forever. Steps that fail are logged and skipped, and the app starts
 * signed out rather than not at all.
 */
export async function bootstrapApp(dispatch: AppDispatch): Promise<void> {
  try {
    await restoreSession(dispatch);
  } catch (error) {
    log.error('bootstrap step failed', error);
  }
}

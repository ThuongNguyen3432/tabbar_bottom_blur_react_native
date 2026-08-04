import { logger } from '../../core/logger';
import { tokenStorage } from '../../core/storage';
import { restoreFinished } from '../../features/auth/redux/authSlice';
import type { AppDispatch } from '../store';

const log = logger('bootstrap');

/**
 * Loads any stored tokens into memory before the first request goes out.
 *
 * Only the tokens are restored, not the user: the profile is fetched, and
 * trusting a persisted copy would show a stale name to someone whose account
 * changed on another device. `isRestored` flips either way so navigation can
 * stop waiting.
 */
export async function restoreSession(dispatch: AppDispatch): Promise<boolean> {
  const tokens = await tokenStorage.load();
  dispatch(restoreFinished());

  if (!tokens) {
    log.debug('no stored session');
    return false;
  }
  log.debug('session restored');
  return true;
}

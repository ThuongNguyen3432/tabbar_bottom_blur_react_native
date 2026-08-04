import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { tokenStorage } from '../../../core/storage';
import { useLogoutMutation } from '../api/authApi';
import { signedOut } from '../redux/authSlice';

/** Who is signed in, and how to stop being signed in. */
export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const isRestored = useAppSelector(state => state.auth.isRestored);
  const [logoutRequest] = useLogoutMutation();

  const logout = useCallback(async () => {
    // Local state clears first so the UI leaves immediately; the server call is
    // best-effort and must not hold the user on a signed-in screen.
    dispatch(signedOut());
    await tokenStorage.clear();
    try {
      await logoutRequest().unwrap();
    } catch {
      // Already signed out locally.
    }
  }, [dispatch, logoutRequest]);

  return { user, isAuthenticated: user !== null, isRestored, logout };
}

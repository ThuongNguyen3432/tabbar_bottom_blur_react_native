import { useDispatch, useSelector, useStore } from 'react-redux';

import type { AppDispatch, AppStore, RootState } from './store';

/**
 * Pre-typed react-redux hooks.
 *
 * Components should use these rather than the plain ones, which type state as
 * `unknown` and lose the thunk overloads on dispatch.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

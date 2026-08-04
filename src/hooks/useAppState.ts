import { useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

/**
 * Foreground/background, plus the transition itself.
 *
 * `justReturned` is the useful signal for refetching: reacting to the state
 * being 'active' fires on mount too, refetching data that was just loaded.
 */
export function useAppState() {
  const [state, setState] = useState<AppStateStatus>(AppState.currentState);
  const previous = useRef(state);
  const [justReturned, setJustReturned] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', next => {
      setJustReturned(previous.current.match(/inactive|background/) !== null && next === 'active');
      previous.current = next;
      setState(next);
    });
    return () => subscription.remove();
  }, []);

  return { state, isActive: state === 'active', justReturned };
}

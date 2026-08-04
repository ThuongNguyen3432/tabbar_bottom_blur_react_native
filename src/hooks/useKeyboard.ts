import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

/**
 * Keyboard height and visibility.
 *
 * iOS reports the frame before the animation starts (`Will`), Android only once
 * it has finished (`Did`) — using one event name on both makes the layout jump
 * on iOS or lag on Android.
 */
export function useKeyboard() {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const show = Keyboard.addListener(showEvent, event =>
      setHeight(event.endCoordinates.height),
    );
    const hide = Keyboard.addListener(hideEvent, () => setHeight(0));

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return { height, isVisible: height > 0, dismiss: Keyboard.dismiss };
}

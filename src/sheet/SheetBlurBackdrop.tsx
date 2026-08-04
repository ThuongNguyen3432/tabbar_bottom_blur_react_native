import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { BlurView } from '@react-native-community/blur';
import {
  useBottomSheet,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';

/**
 * A blurred backdrop in place of the library's flat dark scrim.
 *
 * The blur radius itself is not animated — that would re-run the native blur
 * pass on every frame of the open gesture. Fading the whole layer in gets the
 * same read for a fraction of the cost, and opacity runs on the UI thread.
 */
export function SheetBlurBackdrop({
  animatedIndex,
  style,
}: BottomSheetBackdropProps) {
  // The custom backdrop replaces BottomSheetBackdrop, so tap-to-close has to be
  // wired up by hand.
  const { close } = useBottomSheet();

  const fade = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <Animated.View style={[style, fade]}>
      <Pressable
        style={StyleSheet.absoluteFill}
        // Wrapped: close() takes an optional animation config, so handing it the
        // press event directly would pass a GestureResponderEvent as config.
        onPress={() => close()}
        accessibilityLabel="Close sheet"
      >
        <BlurView
          blurType="dark"
          blurAmount={12}
          overlayColor="rgba(0, 0, 0, 0.25)"
          style={StyleSheet.absoluteFill}
          // On iOS the blur is a UIVisualEffectView, which consumes the touch
          // instead of letting it reach the Pressable above — tapping the
          // backdrop did nothing there while it closed the sheet on Android.
          pointerEvents="none"
        />
      </Pressable>
    </Animated.View>
  );
}

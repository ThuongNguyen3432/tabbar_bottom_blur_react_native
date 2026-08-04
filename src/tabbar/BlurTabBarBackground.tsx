import { StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';

import { useAppTheme } from '../theme';

/**
 * The tab bar's translucent backdrop.
 *
 * On Android this goes through Dimezis BlurView — the same native library expo's
 * `dimezisBlurView` method wraps — so the blur is real rather than a tinted
 * overlay. It binds itself to the activity's content view, which is why no
 * explicit blur target has to be threaded down from the screens.
 *
 * On iOS it maps to UIVisualEffectView.
 */
export function BlurTabBarBackground() {
  const { colors, isDark } = useAppTheme();

  return (
    <BlurView
      blurType={colors.blurTint}
      blurAmount={14}
      // Android draws a scrim under the blur, and the library's default is
      // heavy enough to wash the colours out — so it is set explicitly per
      // palette rather than left to the default.
      overlayColor={
        isDark ? 'rgba(20, 20, 22, 0.35)' : 'rgba(255, 255, 255, 0.25)'
      }
      style={StyleSheet.absoluteFill}
    />
  );
}

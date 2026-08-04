import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

import { useAppTheme } from '../theme';
import { SheetBlurBackdrop } from './SheetBlurBackdrop';

/** How much of the screen a sheet may grow to before it starts scrolling. */
export const MAX_HEIGHT_RATIO = 0.8;

/**
 * Space below a sheet's content — one number for both platforms.
 *
 * Deliberately not `safeAreaBottom + n`. Measured on device, that inset is 34pt
 * on an iPhone but **0** on Android, where the app window already stops above
 * the navigation bar — so adding it made the iOS gap 58 against Android's 24.
 * Neither sheet is occluded at the bottom, so a flat number is what actually
 * renders the same on both.
 */
export const SHEET_CONTENT_BOTTOM_PADDING = 24;

/**
 * The look and behaviour every sheet in the app shares — blurred backdrop,
 * handle, rounded background, and the ceiling on dynamic sizing.
 *
 * Returned as a props object rather than a wrapper component so each variant can
 * own its own `BottomSheetModal`; wrapping instead would mean forwarding refs
 * through an extra layer for no gain.
 */
export function useSheetChrome(maxHeightRatio: number = MAX_HEIGHT_RATIO) {
  const { height } = useWindowDimensions();
  const { colors, radius } = useAppTheme();

  return useMemo(
    () => ({
      // Dynamic sizing is on by default in v5, so the sheet already hugs its
      // content. This only stops tall content from covering the whole screen.
      maxDynamicContentSize: height * maxHeightRatio,
      backdropComponent: SheetBlurBackdrop,
      handleIndicatorStyle: { backgroundColor: colors.border, width: 40 },
      backgroundStyle: {
        backgroundColor: colors.surfaceElevated,
        borderRadius: radius.lg,
      },
      enablePanDownToClose: true,
    }),
    [height, maxHeightRatio, colors, radius],
  );
}

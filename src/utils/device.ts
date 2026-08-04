import { Dimensions, PixelRatio, Platform } from 'react-native';

/**
 * Device facts.
 *
 * Screen size is read on demand rather than captured at module load: it changes
 * on rotation and on foldables, and a cached value would go stale.
 */

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export function screen() {
  return Dimensions.get('window');
}

/** Tablet-ish. Cheap heuristic, not a device database. */
export function isTablet(): boolean {
  const { width, height } = screen();
  const shortest = Math.min(width, height);
  return shortest >= 600;
}

/** Rounds to whole device pixels so hairlines do not blur. */
export function roundToPixel(value: number): number {
  return PixelRatio.roundToNearestPixel(value);
}

export const hairline = roundToPixel(1 / PixelRatio.get());

/** Android API level, or null on iOS. */
export function androidApiLevel(): number | null {
  return Platform.OS === 'android' ? Number(Platform.Version) : null;
}

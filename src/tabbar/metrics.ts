/** Geometry of the floating pill, shared by the tab bar and the screens. */
export const TAB_BAR_HEIGHT = 64;
export const TAB_BAR_SIDE_MARGIN = 16;

/**
 * Distance from the screen's bottom edge to the pill — one number for both
 * platforms.
 *
 * Deliberately not derived from the safe-area inset: that inset is 34pt for an
 * iPhone's home indicator against 24dp for an Android gesture bar, so anchoring
 * to it left the pill sitting visibly higher on iOS. This still clears the bar
 * each platform actually draws, which is shorter than the inset it reserves.
 */
export const TAB_BAR_BOTTOM_OFFSET = 16;

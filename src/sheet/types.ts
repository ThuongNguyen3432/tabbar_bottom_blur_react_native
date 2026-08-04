/**
 * What callers get back from a sheet ref.
 *
 * Deliberately narrower than BottomSheetModal's own `present`/`dismiss` API, so
 * screens depend on this pair rather than on the library's surface.
 */
export type AppSheetRef = {
  open: () => void;
  close: () => void;
};

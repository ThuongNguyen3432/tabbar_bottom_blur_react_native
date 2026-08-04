import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import type { ReactElement, ReactNode, Ref } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetScrollableCreator,
} from '@gorhom/bottom-sheet';
// FlashList ships its own ListRenderItem: its info object has no `separators`,
// so React Native's version is not assignable here.
import { FlashList, type ListRenderItem } from '@shopify/flash-list';

import type { AppSheetRef } from './types';
import {
  MAX_HEIGHT_RATIO,
  SHEET_CONTENT_BOTTOM_PADDING,
  useSheetChrome,
} from './useSheetChrome';

/** Height of one row, used to size the sheet before any row has rendered. */
const DEFAULT_ROW_HEIGHT = 45;
const TITLE_BLOCK_HEIGHT = 38;
const CONTENT_PADDING_TOP = 8;

type BaseProps = {
  title?: string;
  /** Fraction of the screen the sheet may grow to before it scrolls. */
  maxHeightRatio?: number;
};

/** Arbitrary content — the sheet ends up as tall as whatever is passed in. */
type ContentProps = BaseProps & {
  children: ReactNode;
  data?: never;
  renderItem?: never;
  keyExtractor?: never;
  rowHeight?: never;
};

/** A list — rows are virtualised by FlashList. */
type ListProps<T> = BaseProps & {
  data: readonly T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  /**
   * Row height used to size the sheet. Only an approximation is needed — it
   * decides the sheet's height, not the list's layout.
   */
  rowHeight?: number;
  children?: never;
};

type Props<T> = ContentProps | ListProps<T>;

type SheetListProps<T> = {
  data: readonly T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  header: ReactElement | null;
  contentContainerStyle: object;
};

/**
 * Rendered as a child of the sheet so `useBottomSheetScrollableCreator` runs
 * inside the sheet's context.
 *
 * Uses the creator hook rather than `BottomSheetFlashList`, which v5 deprecates
 * — it logs a warning saying so — and whose wiring does not hand scrolling over
 * to FlashList v2.
 */
function SheetList<T>({
  data,
  renderItem,
  keyExtractor,
  header,
  contentContainerStyle,
}: SheetListProps<T>) {
  const renderScrollComponent = useBottomSheetScrollableCreator();

  return (
    <FlashList
      data={data as T[]}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={header}
      contentContainerStyle={contentContainerStyle}
      renderScrollComponent={renderScrollComponent}
    />
  );
}

/**
 * One sheet for both content and lists.
 *
 * The two halves size themselves differently, and they have to:
 *
 * - Content is measured by the library. `enableDynamicSizing` renders the
 *   children and snaps the sheet to whatever height they report.
 * - A list is measured here, from `data.length`. Dynamic sizing and
 *   virtualisation pull against each other — the first wants the content
 *   measured, the second exists precisely to avoid rendering it all — and with
 *   both enabled the sheet opens at the right height but the list will not
 *   scroll. Computing the height instead keeps FlashList scrolling while the
 *   sheet still grows with the number of rows.
 *
 * Everything else — chrome, ref API, safe-area padding — is shared.
 */
function AppBottomSheetInner<T>(props: Props<T>, ref: Ref<AppSheetRef>) {
  const { title, maxHeightRatio = MAX_HEIGHT_RATIO } = props;
  const modalRef = useRef<BottomSheetModal>(null);
  const { height: screenHeight } = useWindowDimensions();
  const chrome = useSheetChrome(maxHeightRatio);
  const bottomPadding = SHEET_CONTENT_BOTTOM_PADDING;

  useImperativeHandle(
    ref,
    () => ({
      open: () => modalRef.current?.present(),
      close: () => modalRef.current?.dismiss(),
    }),
    [],
  );

  const isList = 'data' in props && props.data !== undefined;

  const listSnapPoints = useMemo(() => {
    if (!isList) {
      return undefined;
    }
    const rows = props.data.length * (props.rowHeight ?? DEFAULT_ROW_HEIGHT);
    const content =
      rows +
      (title ? TITLE_BLOCK_HEIGHT : 0) +
      CONTENT_PADDING_TOP +
      bottomPadding;

    return [Math.min(content, screenHeight * maxHeightRatio)];
  }, [
    isList,
    props.data,
    props.rowHeight,
    title,
    bottomPadding,
    screenHeight,
    maxHeightRatio,
  ]);

  const heading = title ? <Text style={styles.title}>{title}</Text> : null;

  return (
    <BottomSheetModal
      ref={modalRef}
      {...chrome}
      // Only the content variant lets the library measure; see the note above.
      enableDynamicSizing={!isList}
      snapPoints={listSnapPoints}
    >
      {isList ? (
        <SheetList
          data={props.data}
          keyExtractor={props.keyExtractor}
          renderItem={props.renderItem}
          header={heading}
          contentContainerStyle={StyleSheet.flatten([
            styles.content,
            { paddingBottom: bottomPadding },
          ])}
        />
      ) : (
        <BottomSheetView
          style={[styles.content, { paddingBottom: bottomPadding }]}
        >
          {heading}
          <View>{props.children}</View>
        </BottomSheetView>
      )}
    </BottomSheetModal>
  );
}

// forwardRef erases generics, so the cast restores `T` for callers.
export const AppBottomSheet = forwardRef(AppBottomSheetInner) as <T = never>(
  props: Props<T> & { ref?: Ref<AppSheetRef> },
) => ReactElement;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: CONTENT_PADDING_TOP,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1c1c1e',
    marginBottom: 12,
  },
});

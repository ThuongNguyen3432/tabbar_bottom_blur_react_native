import { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  DrawerActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { useAppTheme } from '../theme';

import { AppBottomSheet } from '../sheet/AppBottomSheet';
import type { AppSheetRef } from '../sheet/types';
import { TAB_BAR_BOTTOM_OFFSET, TAB_BAR_HEIGHT } from '../tabbar/metrics';

/**
 * Saturated, high-contrast bands. A blur over flat grey looks identical to a
 * plain translucent overlay, which is exactly the false positive this spike has
 * to avoid — strong colour edges make a real blur unmistakable.
 */
const SWATCHES = [
  '#ff3b30',
  '#ff9500',
  '#ffcc00',
  '#34c759',
  '#00c7be',
  '#30b0c7',
  '#007aff',
  '#5856d6',
  '#af52de',
  '#ff2d55',
];

type Row = {
  key: string;
  color: string;
  label: string;
};

function buildRows(prefix: string): Row[] {
  return Array.from({ length: 40 }, (_, index) => ({
    key: `${prefix}-${index}`,
    color: SWATCHES[index % SWATCHES.length],
    label: `${prefix} ${index + 1}`,
  }));
}

export function FeedScreen() {
  // Taken from the route rather than a prop, so each tab can point straight at
  // this component instead of an inline wrapper that remounts on every render.
  const title = useRoute().name;
  const { colors, typography } = useAppTheme();
  const navigation = useNavigation();
  const rows = useMemo(() => buildRows(title), [title]);
  const tabBarHeight = TAB_BAR_BOTTOM_OFFSET + TAB_BAR_HEIGHT;

  const detailSheet = useRef<AppSheetRef>(null);
  const listSheet = useRef<AppSheetRef>(null);
  const [selected, setSelected] = useState<Row | null>(null);

  const openDetail = useCallback((row: Row) => {
    setSelected(row);
    detailSheet.current?.open();
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <FlatList
        data={rows}
        keyExtractor={row => row.key}
        contentContainerStyle={[
          styles.content,
          // Without this the last rows sit permanently under the tab bar and can
          // never be scrolled into view.
          { paddingBottom: tabBarHeight + 24 },
        ]}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Pressable
              style={[styles.menuButton, { backgroundColor: colors.surface }]}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              accessibilityRole="button"
              accessibilityLabel="Mở menu"
            >
              {/* Three bars, drawn rather than pulled from an icon font. */}
              <View style={[styles.bar, { backgroundColor: colors.text }]} />
              <View style={[styles.bar, { backgroundColor: colors.text }]} />
              <View style={[styles.bar, { backgroundColor: colors.text }]} />
            </Pressable>

            <Pressable
              style={[styles.listSheetButton, { backgroundColor: colors.primary }]}
              onPress={() => listSheet.current?.open()}
            >
              <Text
                style={[styles.listSheetButtonText, { color: colors.textOnPrimary }]}
              >
                Open list sheet ({rows.length} items)
              </Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, { backgroundColor: item.color }]}
            onPress={() => openDetail(item)}
          >
            <Text style={styles.cardText}>{item.label}</Text>
          </Pressable>
        )}
      />

      {/* Short content: the sheet ends up only as tall as these few lines. */}
      <AppBottomSheet ref={detailSheet} title={selected?.label ?? ''}>
        <View
          style={[styles.swatch, { backgroundColor: selected?.color ?? '#000' }]}
        />
        <Text style={[typography.body, { color: colors.textMuted, marginTop: 12 }]}>
          {selected?.color}
        </Text>
      </AppBottomSheet>

      {/* Long content: grows to the ceiling, then scrolls inside the sheet. */}
      <AppBottomSheet
        ref={listSheet}
        title={`All ${rows.length} items`}
        data={rows}
        keyExtractor={row => row.key}
        renderItem={({ item }) => (
          <View style={styles.sheetRow}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={[typography.body, { color: colors.text }]}>{item.label}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 64,
  },
  card: {
    height: 96,
    borderRadius: 16,
    marginBottom: 12,
    justifyContent: 'flex-end',
    padding: 16,
  },
  cardText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  bar: {
    width: 18,
    height: 2,
    borderRadius: 1,
  },
  listSheetButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  listSheetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  swatch: {
    height: 72,
    borderRadius: 12,
  },
  detailText: {
    marginTop: 12,
    fontSize: 16,
    color: '#48484a',
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  sheetRowText: {
    fontSize: 16,
    color: '#1c1c1e',
  },
});

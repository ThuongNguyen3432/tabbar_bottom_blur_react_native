import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { THEME_MODES, type ThemeMode } from '../../../constants/app';
import { TAB_BAR_BOTTOM_OFFSET, TAB_BAR_HEIGHT } from '../../../tabbar/metrics';
import { useThemeContext } from '../../../theme';

const MODE_LABELS: Record<ThemeMode, string> = {
  light: 'Sáng',
  dark: 'Tối',
  system: 'Theo hệ thống',
};

const MODE_HINTS: Record<ThemeMode, string> = {
  light: 'Luôn dùng bảng màu sáng',
  dark: 'Luôn dùng bảng màu tối',
  system: 'Đổi theo cài đặt của máy',
};

export function SettingsScreen() {
  const { theme, mode, setMode } = useThemeContext();
  const { colors, spacing, radius, typography } = theme;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.content,
        {
          padding: spacing.md,
          paddingTop: spacing.xxl,
          paddingBottom: TAB_BAR_BOTTOM_OFFSET + TAB_BAR_HEIGHT + spacing.lg,
        },
      ]}
    >
      <Text style={[typography.title, { color: colors.text }]}>Cài đặt</Text>

      <Text
        style={[
          typography.caption,
          { color: colors.textMuted, marginTop: spacing.lg, marginBottom: spacing.sm },
        ]}
      >
        GIAO DIỆN
      </Text>

      <View
        style={[
          styles.group,
          { backgroundColor: colors.surface, borderRadius: radius.md },
        ]}
      >
        {THEME_MODES.map((option, index) => {
          const selected = mode === option;
          return (
            <Pressable
              key={option}
              onPress={() => setMode(option)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              style={[
                styles.row,
                { padding: spacing.md },
                index > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
              ]}
            >
              <View style={styles.rowText}>
                <Text style={[typography.bodyStrong, { color: colors.text }]}>
                  {MODE_LABELS[option]}
                </Text>
                <Text style={[typography.caption, { color: colors.textMuted }]}>
                  {MODE_HINTS[option]}
                </Text>
              </View>

              {/* A dot rather than a Switch: the three options are exclusive. */}
              <View
                style={[
                  styles.radio,
                  { borderColor: selected ? colors.primary : colors.border },
                ]}
              >
                {selected ? (
                  <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Text
        style={[
          typography.caption,
          { color: colors.textMuted, marginTop: spacing.md },
        ]}
      >
        Đang áp dụng: {theme.name === 'dark' ? 'tối' : 'sáng'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
  group: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    flex: 1,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

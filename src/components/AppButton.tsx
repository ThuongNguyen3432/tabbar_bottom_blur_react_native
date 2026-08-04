import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';

import { useAppTheme } from '../theme';
import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = Omit<PressableProps, 'children'> & {
  title: string;
  variant?: Variant;
  loading?: boolean;
};

export function AppButton({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  ...rest
}: Props) {
  const { colors, radius, spacing } = useAppTheme();

  const background: Record<Variant, string> = {
    primary: colors.primary,
    secondary: colors.surfaceElevated,
    ghost: 'transparent',
    danger: colors.danger,
  };
  const label: Record<Variant, keyof typeof colors> = {
    primary: 'textOnPrimary',
    secondary: 'text',
    ghost: 'primary',
    danger: 'textOnPrimary',
  };

  // Disabled while loading as well: a second tap would fire the request again.
  const isDisabled = disabled === true || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={state => [
        styles.base,
        {
          backgroundColor: background[variant],
          borderRadius: radius.md,
          paddingVertical: spacing.md - 2,
          paddingHorizontal: spacing.lg,
          opacity: isDisabled ? 0.5 : state.pressed ? 0.85 : 1,
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={colors[label[variant]] as string} />
      ) : (
        <AppText variant="bodyStrong" color={label[variant]}>
          {title}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    // Keeps the button from collapsing while the spinner replaces the label.
    minHeight: 48,
  },
});

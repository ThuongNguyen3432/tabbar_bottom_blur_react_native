import { Text, type TextProps } from 'react-native';

import { useAppTheme } from '../../theme';
import type { ThemeColors, ThemeTypography } from '../../theme';

type Props = TextProps & {
  variant?: keyof ThemeTypography;
  /** A palette role, not a colour value, so it flips with the theme. */
  color?: keyof ThemeColors;
};

/**
 * Text that reads the theme.
 *
 * Using this instead of RN's Text is what makes a screen respond to a theme
 * change without touching any of its styles.
 */
export function AppText({ variant = 'body', color = 'text', style, ...rest }: Props) {
  const theme = useAppTheme();
  return (
    <Text
      style={[theme.typography[variant], { color: theme.colors[color] as string }, style]}
      {...rest}
    />
  );
}

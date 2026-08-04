import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { useAppTheme } from '../../theme';
import { AppText } from '../AppText';

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export function AppInput({ label, error, style, onFocus, onBlur, ...rest }: Props) {
  const { colors, radius, spacing } = useAppTheme();
  const [focused, setFocused] = useState(false);

  // Error outranks focus: a field that is wrong should look wrong even while
  // the user is fixing it.
  const borderColor = error ? colors.danger : focused ? colors.primary : colors.border;

  return (
    <View style={{ marginBottom: spacing.md }}>
      {label ? (
        <AppText variant="caption" color="textMuted" style={{ marginBottom: spacing.xs }}>
          {label}
        </AppText>
      ) : null}

      <TextInput
        placeholderTextColor={colors.textMuted}
        onFocus={event => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={event => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor,
            borderRadius: radius.md,
            padding: spacing.md,
          },
          style,
        ]}
        {...rest}
      />

      {error ? (
        <AppText variant="caption" color="danger" style={{ marginTop: spacing.xs }}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    minHeight: 48,
  },
});

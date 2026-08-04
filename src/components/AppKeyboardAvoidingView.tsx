import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, type ViewStyle } from 'react-native';

/**
 * The two platforms need different behaviours.
 *
 * iOS has to be told to move ('padding'); Android already resizes the window
 * through windowSoftInputMode="adjustResize", and applying padding on top of
 * that pushes content twice as far.
 */
export function AppKeyboardAvoidingView({
  children,
  style,
  offset = 0,
}: {
  children: ReactNode;
  style?: ViewStyle;
  offset?: number;
}) {
  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={offset}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

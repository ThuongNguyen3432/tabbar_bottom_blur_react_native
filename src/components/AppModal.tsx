import type { ReactNode } from 'react';
import { Modal, Pressable } from 'react-native';

import { useAppTheme } from '../theme';
import { AppText } from './AppText';

/**
 * Centred dialog. For anything the user should be able to drag away, use the
 * bottom sheet instead — a modal is for decisions that need an answer.
 */
export function AppModal({
  visible,
  onClose,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  const { colors, radius, spacing, shadows } = useAppTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      // Android's hardware back must close it, or the user is trapped.
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: colors.scrim,
          alignItems: 'center',
          justifyContent: 'center',
          padding: spacing.lg,
        }}
      >
        {/* Stops a tap inside the card reaching the backdrop behind it. */}
        <Pressable
          onPress={event => event.stopPropagation()}
          style={[
            {
              width: '100%',
              backgroundColor: colors.surfaceElevated,
              borderRadius: radius.lg,
              padding: spacing.lg,
            },
            shadows.lg,
          ]}
        >
          {title ? (
            <AppText variant="heading" style={{ marginBottom: spacing.md }}>
              {title}
            </AppText>
          ) : null}
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

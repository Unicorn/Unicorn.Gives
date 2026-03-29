import { useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useTheme, fonts, fontSize, type ThemeColors } from '@/constants/theme';

interface AdminConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export function AdminConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: AdminConfirmDialogProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal
      visible={visible}
      onClose={onCancel}
      title={title}
      icon={variant === 'danger' ? 'warning' : 'help-outline'}
      iconColor={variant === 'danger' ? colors.error : colors.primary}
      actions={
        <>
          <Button
            label={cancelLabel}
            variant="secondary"
            onPress={onCancel}
            style={{ flex: 1 }}
          />
          <Button
            label={confirmLabel}
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onPress={onConfirm}
            style={{ flex: 1 }}
          />
        </>
      }
    >
      <Text style={styles.message}>{message}</Text>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    message: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutralVariant,
      textAlign: 'center',
      lineHeight: 20,
    },
  });

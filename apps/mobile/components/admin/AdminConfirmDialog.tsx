import { useMemo } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';

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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
          <View style={styles.iconCircle}>
            <MaterialIcons
              name={variant === 'danger' ? 'warning' : 'help-outline'}
              size={24}
              color={variant === 'danger' ? colors.error : colors.primary}
            />
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Pressable style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              style={[styles.confirmBtn, variant === 'danger' && styles.confirmBtnDanger]}
              onPress={onConfirm}
            >
              <Text
                style={[styles.confirmText, variant === 'danger' && styles.confirmTextDanger]}
              >
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dialog: {
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      padding: spacing.xxl,
      maxWidth: 400,
      width: '90%',
      alignItems: 'center',
      gap: 12,
    },
    iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.surfaceContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontFamily: fonts.sansBold,
      fontSize: 17,
      color: colors.neutral,
      textAlign: 'center',
    },
    message: {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: colors.neutralVariant,
      textAlign: 'center',
      lineHeight: 20,
    },
    actions: {
      flexDirection: 'row',
      gap: 10,
      marginTop: spacing.sm,
      width: '100%',
    },
    cancelBtn: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: radii.sm,
      backgroundColor: colors.surfaceContainer,
      alignItems: 'center',
    },
    cancelText: {
      fontFamily: fonts.sansMedium,
      fontSize: 14,
      color: colors.neutral,
    },
    confirmBtn: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: radii.sm,
      backgroundColor: colors.primary,
      alignItems: 'center',
    },
    confirmBtnDanger: {
      backgroundColor: colors.error,
    },
    confirmText: {
      fontFamily: fonts.sansMedium,
      fontSize: 14,
      color: colors.onPrimary,
    },
    confirmTextDanger: {
      color: colors.onError,
    },
  });

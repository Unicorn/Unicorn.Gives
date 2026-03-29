import type { ReactNode } from 'react';
import { useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal as RNModal,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: number;
  style?: ViewStyle;
}

export function Modal({
  visible,
  onClose,
  title,
  icon,
  iconColor,
  children,
  actions,
  maxWidth = 400,
  style,
}: ModalProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.dialog, { maxWidth }, style]}
          onPress={(e) => e.stopPropagation()}
        >
          {icon && (
            <View style={styles.iconCircle}>
              <MaterialIcons
                name={icon}
                size={24}
                color={iconColor ?? colors.primary}
              />
            </View>
          )}
          {title && <Text style={styles.title}>{title}</Text>}
          {children}
          {actions && <View style={styles.actions}>{actions}</View>}
        </Pressable>
      </Pressable>
    </RNModal>
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
      width: '90%',
      alignItems: 'center',
      gap: spacing.md,
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
      fontSize: fontSize.lg + 1, // 17
      color: colors.neutral,
      textAlign: 'center',
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.sm + 2, // 10
      marginTop: spacing.sm,
      width: '100%',
    },
  });

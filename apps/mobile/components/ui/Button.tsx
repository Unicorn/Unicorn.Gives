import { useMemo } from 'react';
import { Text, StyleSheet, ActivityIndicator, type ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { AnimatedPressable } from './AnimatedPressable';
import {
  useTheme,
  fonts,
  fontSize,
  spacing,
  radii,
  shadows,
  type ThemeColors,
} from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: keyof typeof MaterialIcons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled,
  loading,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const containerStyle = [
    styles.base,
    styles[`container_${variant}`],
    styles[`size_${size}`],
    (disabled || loading) && styles.disabled,
    variant === 'primary' && shadows.button,
    style,
  ];

  const textStyle = [styles.text, styles[`text_${variant}`], styles[`textSize_${size}`]];

  const iconColor =
    variant === 'danger'
      ? colors.error
      : variant === 'secondary' || variant === 'ghost'
        ? colors.neutral
        : colors.onPrimary;

  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;

  return (
    <AnimatedPressable
      variant="button"
      style={StyleSheet.flatten(containerStyle)}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : icon ? (
        <MaterialIcons name={icon} size={iconSize} color={iconColor} />
      ) : null}
      <Text style={textStyle}>{label}</Text>
    </AnimatedPressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    base: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs + 2, // 6
      borderRadius: radii.sm,
    },
    disabled: { opacity: 0.5 },

    /* ── Container variants ── */
    container_primary: {
      backgroundColor: colors.primary,
    },
    container_secondary: {
      backgroundColor: colors.surfaceContainer,
      borderWidth: 1,
      borderColor: colors.outline,
    },
    container_danger: {
      backgroundColor: colors.errorContainer,
      borderWidth: 1,
      borderColor: colors.error,
    },
    container_ghost: {
      backgroundColor: 'transparent',
    },

    /* ── Size variants ── */
    size_sm: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2, // 6
    },
    size_md: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm + 1, // 9
    },
    size_lg: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
    },

    /* ── Text ── */
    text: {
      fontFamily: fonts.sansMedium,
    },
    text_primary: { color: colors.onPrimary },
    text_secondary: { color: colors.neutral },
    text_danger: { color: colors.error },
    text_ghost: { color: colors.primary },

    textSize_sm: { fontSize: fontSize.xs },
    textSize_md: { fontSize: fontSize.sm + 1 }, // 13
    textSize_lg: { fontSize: fontSize.base },
  });

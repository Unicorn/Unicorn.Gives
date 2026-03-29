import { useMemo } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

interface AdminPageShellProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function AdminPageShell({
  title,
  subtitle,
  backHref,
  actions,
  children,
}: AdminPageShellProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {backHref && (
            <Pressable
              style={styles.backBtn}
              onPress={() => router.push(toHref(backHref))}
            >
              <MaterialIcons name="arrow-back" size={20} color={colors.neutralVariant} />
            </Pressable>
          )}
          <View>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
        {actions && <View style={styles.actions}>{actions}</View>}
      </View>
      {children}
    </ScrollView>
  );
}

/* ── Reusable button for page-level actions ── */

interface AdminButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: keyof typeof MaterialIcons.glyphMap;
  disabled?: boolean;
}

export function AdminButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
}: AdminButtonProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const btnStyle =
    variant === 'danger'
      ? styles.btnDanger
      : variant === 'secondary'
      ? styles.btnSecondary
      : styles.btnPrimary;

  const textStyle =
    variant === 'danger'
      ? styles.btnDangerText
      : variant === 'secondary'
      ? styles.btnSecondaryText
      : styles.btnPrimaryText;

  return (
    <Pressable
      style={[btnStyle, disabled && { opacity: 0.5 }]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && (
        <MaterialIcons
          name={icon}
          size={16}
          color={
            variant === 'danger'
              ? colors.error
              : variant === 'secondary'
              ? colors.neutral
              : colors.onPrimary
          }
        />
      )}
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
    },
    content: {
      maxWidth: 1000,
      paddingBottom: 40,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: spacing.xl,
      gap: 16,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
    },
    backBtn: {
      width: 32,
      height: 32,
      borderRadius: radii.sm,
      backgroundColor: colors.surfaceContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontFamily: fonts.sansBold,
      fontSize: 22,
      color: colors.neutral,
    },
    subtitle: {
      fontFamily: fonts.sans,
      fontSize: 13,
      color: colors.neutralVariant,
      marginTop: 2,
    },
    actions: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
    },

    /* Buttons */
    btnPrimary: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: 9,
      borderRadius: radii.sm,
    },
    btnPrimaryText: {
      fontFamily: fonts.sansMedium,
      fontSize: 13,
      color: colors.onPrimary,
    },
    btnSecondary: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.surfaceContainer,
      borderWidth: 1,
      borderColor: colors.outline,
      paddingHorizontal: spacing.lg,
      paddingVertical: 8,
      borderRadius: radii.sm,
    },
    btnSecondaryText: {
      fontFamily: fonts.sansMedium,
      fontSize: 13,
      color: colors.neutral,
    },
    btnDanger: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.errorContainer,
      borderWidth: 1,
      borderColor: colors.error,
      paddingHorizontal: spacing.lg,
      paddingVertical: 8,
      borderRadius: radii.sm,
    },
    btnDangerText: {
      fontFamily: fonts.sansMedium,
      fontSize: 13,
      color: colors.error,
    },
  });

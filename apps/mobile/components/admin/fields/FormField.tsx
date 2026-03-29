import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, fonts, fontSize, spacing, type ThemeColors } from '@/constants/theme';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({ label, required, error, hint, children }: FormFieldProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      {children}
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

export const createFieldStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    field: {
      gap: spacing.xs,
      marginBottom: spacing.md,
    },
    label: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.sm + 1,
      color: colors.neutral,
    },
    required: {
      color: colors.error,
    },
    hint: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.neutralVariant,
    },
    error: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.error,
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: 8,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutral,
    },
    inputError: {
      borderColor: colors.error,
    },
  });

const createStyles = createFieldStyles;

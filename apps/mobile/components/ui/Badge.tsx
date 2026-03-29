import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, fonts, fontSize, radii, spacing, type ThemeColors } from '@/constants/theme';

type BadgeVariant = 'status' | 'feature' | 'date' | 'category' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  /** Override status color config (for status variant) */
  status?: 'published' | 'approved' | 'draft' | 'pending' | 'archived';
}

export function Badge({ label, variant = 'neutral', status }: BadgeProps) {
  const { colors, chips } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (variant === 'status') {
    const cfg = STATUS_COLORS[status ?? 'archived'];
    return (
      <View
        style={[styles.pill, { backgroundColor: cfg.bg(colors), borderColor: cfg.border(colors) }]}
      >
        <View style={[styles.dot, { backgroundColor: cfg.dot(colors) }]} />
        <Text style={[styles.statusText, { color: cfg.text(colors) }]}>{label}</Text>
      </View>
    );
  }

  const chipTokens =
    variant === 'feature'
      ? chips.gold
      : variant === 'date'
        ? chips.purple
        : variant === 'category'
          ? chips.filterActive
          : { backgroundColor: colors.surfaceContainer, borderColor: colors.outline, color: colors.neutralVariant };

  return (
    <View style={[styles.chip, { backgroundColor: chipTokens.backgroundColor, borderColor: chipTokens.borderColor }]}>
      <Text style={[styles.chipText, { color: chipTokens.color }]}>{label}</Text>
    </View>
  );
}

/* ── Status color map ── */

const STATUS_COLORS: Record<
  string,
  {
    bg: (c: ThemeColors) => string;
    border: (c: ThemeColors) => string;
    dot: (c: ThemeColors) => string;
    text: (c: ThemeColors) => string;
  }
> = {
  published: {
    bg: (c) => c.primaryContainer,
    border: (c) => c.primary,
    dot: (c) => c.primary,
    text: (c) => c.primary,
  },
  approved: {
    bg: (c) => c.primaryContainer,
    border: (c) => c.primary,
    dot: (c) => c.primary,
    text: (c) => c.primary,
  },
  draft: {
    bg: (c) => c.goldContainer,
    border: (c) => c.gold,
    dot: (c) => c.gold,
    text: (c) => c.gold,
  },
  pending: {
    bg: (c) => c.goldContainer,
    border: (c) => c.gold,
    dot: (c) => c.gold,
    text: (c) => c.gold,
  },
  archived: {
    bg: (c) => c.surfaceContainer,
    border: (c) => c.outline,
    dot: (c) => c.neutralVariant,
    text: (c) => c.neutralVariant,
  },
};

const createStyles = (_colors: ThemeColors) =>
  StyleSheet.create({
    /* ── Status badge (dot + label) ── */
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: radii.pill,
      borderWidth: 1,
      alignSelf: 'flex-start',
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    statusText: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.xs,
      textTransform: 'capitalize',
    },

    /* ── Chip badge (text only) ── */
    chip: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radii.pill,
      borderWidth: 1,
      alignSelf: 'flex-start',
    },
    chipText: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.xs,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
  });

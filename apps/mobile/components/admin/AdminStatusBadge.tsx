import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, fonts, radii, type ThemeColors } from '@/constants/theme';

interface AdminStatusBadgeProps {
  status: string;
}

export function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.default;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg(colors), borderColor: config.border(colors) }]}>
      <View style={[styles.dot, { backgroundColor: config.dot(colors) }]} />
      <Text style={[styles.text, { color: config.text(colors) }]}>
        {config.label}
      </Text>
    </View>
  );
}

const STATUS_CONFIG: Record<string, {
  label: string;
  bg: (c: ThemeColors) => string;
  border: (c: ThemeColors) => string;
  dot: (c: ThemeColors) => string;
  text: (c: ThemeColors) => string;
}> = {
  published: {
    label: 'Published',
    bg: (c) => c.primaryContainer,
    border: (c) => c.primary,
    dot: (c) => c.primary,
    text: (c) => c.primary,
  },
  approved: {
    label: 'Approved',
    bg: (c) => c.primaryContainer,
    border: (c) => c.primary,
    dot: (c) => c.primary,
    text: (c) => c.primary,
  },
  draft: {
    label: 'Draft',
    bg: (c) => c.goldContainer,
    border: (c) => c.gold,
    dot: (c) => c.gold,
    text: (c) => c.gold,
  },
  pending: {
    label: 'Pending',
    bg: (c) => c.goldContainer,
    border: (c) => c.gold,
    dot: (c) => c.gold,
    text: (c) => c.gold,
  },
  archived: {
    label: 'Archived',
    bg: (c) => c.surfaceContainer,
    border: (c) => c.outline,
    dot: (c) => c.neutralVariant,
    text: (c) => c.neutralVariant,
  },
  default: {
    label: 'Unknown',
    bg: (c) => c.surfaceContainer,
    border: (c) => c.outline,
    dot: (c) => c.neutralVariant,
    text: (c) => c.neutralVariant,
  },
};

const createStyles = (_colors: ThemeColors) =>
  StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 8,
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
    text: {
      fontFamily: fonts.sansMedium,
      fontSize: 11,
      textTransform: 'capitalize',
    },
  });

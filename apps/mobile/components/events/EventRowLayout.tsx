import type { ReactNode } from 'react';
import { View, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme, fonts, radii, spacing } from '@/constants/theme';

export interface EventRowBadge {
  label: string;
  bg: string;
  text: string;
}

export interface EventRowLayoutProps {
  title: string;
  description?: string;
  meta?: string;
  badge?: EventRowBadge;
  dateBox?: { month: string; day: number };
  /** Rendered below meta inside the text column (e.g. tags, recurring). */
  footer?: ReactNode;
  variant?: 'default' | 'compact';
  style?: StyleProp<ViewStyle>;
}

export function EventRowLayout({
  title,
  description,
  meta,
  badge,
  dateBox,
  footer,
  variant = 'default',
  style,
}: EventRowLayoutProps) {
  const { colors } = useTheme();
  const hasRail = Boolean(badge || dateBox);
  const v = variant === 'compact' ? compactStyles : defaultStyles;

  return (
    <View style={[v.body, hasRail && v.bodySplit, style]}>
      {hasRail && (
        <View style={v.rail}>
          {badge && (
            <View style={[styles.badge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
            </View>
          )}
          {dateBox && (
            <View style={[v.dateBox, { borderColor: colors.neutral }]}>
              <Text style={[v.dateMonth, { color: colors.neutralVariant }]}>{dateBox.month}</Text>
              <Text style={[v.dateDay, { color: colors.neutral }]}>{dateBox.day}</Text>
            </View>
          )}
        </View>
      )}
      <View style={[v.copy, hasRail && styles.copyWithRail]}>
        <Text style={[v.title, { color: colors.neutral }]}>{title}</Text>
        {description && (
          <Text style={[v.description, { color: colors.neutralVariant }]}>{description}</Text>
        )}
        {meta && <Text style={[v.meta, { color: colors.neutralVariant }]}>{meta}</Text>}
        {footer}
      </View>
    </View>
  );
}

const defaultStyles = StyleSheet.create({
  body: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  bodySplit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  rail: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  copy: {
    gap: spacing.sm,
  },
  dateBox: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    minWidth: 44,
  },
  dateMonth: {
    fontFamily: fonts.sansBold,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dateDay: {
    fontFamily: fonts.sansBold,
    fontSize: 18,
  },
  title: {
    fontFamily: fonts.sansBold,
    fontSize: 16,
    lineHeight: 22,
  },
  description: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 19,
  },
  meta: {
    fontFamily: fonts.sans,
    fontSize: 12,
  },
});

const compactStyles = StyleSheet.create({
  body: {
    padding: 0,
    gap: 0,
  },
  bodySplit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  rail: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  copy: {
    gap: 2,
    flex: 1,
    minWidth: 0,
  },
  dateBox: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignItems: 'center',
    minWidth: 40,
  },
  dateMonth: {
    fontFamily: fonts.sansBold,
    fontSize: 8,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  dateDay: {
    fontFamily: fonts.sansBold,
    fontSize: 15,
  },
  title: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    lineHeight: 20,
  },
  description: {
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 18,
  },
  meta: {
    fontFamily: fonts.sans,
    fontSize: 12,
  },
});

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  badgeText: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  copyWithRail: {
    flex: 1,
    minWidth: 0,
  },
});

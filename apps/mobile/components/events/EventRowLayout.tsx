import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme, fonts, fontSize, letterSpacing, radii, spacing } from '@/constants/theme';
import { resolveAbsoluteAssetUrl } from '@/lib/resolveAssetUrl';

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
  /** Square thumbnail; only rendered when `variant` is `compact` */
  compactThumbnailUrl?: string | null;
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
  compactThumbnailUrl,
}: EventRowLayoutProps) {
  const { colors } = useTheme();
  const hasRail = Boolean(badge || dateBox);
  const v = variant === 'compact' ? compactStyles : defaultStyles;
  const [thumbFailed, setThumbFailed] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: clear load error when the stored URL changes
  useEffect(() => {
    setThumbFailed(false);
  }, [compactThumbnailUrl]);

  const compactThumbUri = useMemo(() => {
    if (variant !== 'compact' || thumbFailed || !compactThumbnailUrl?.trim()) {
      return null;
    }
    return resolveAbsoluteAssetUrl(compactThumbnailUrl);
  }, [variant, compactThumbnailUrl, thumbFailed]);

  const useRowLayout = hasRail || Boolean(compactThumbUri);

  return (
    <View style={[v.body, useRowLayout && v.bodySplit, style]}>
      {compactThumbUri ? (
        <View
          style={[
            styles.compactThumbWrap,
            { borderColor: colors.outline, backgroundColor: colors.surfaceContainer },
          ]}
        >
          <Image
            source={{ uri: compactThumbUri }}
            style={styles.compactThumbImage}
            resizeMode="cover"
            accessibilityLabel={title}
            accessibilityIgnoresInvertColors
            onError={() => setThumbFailed(true)}
          />
        </View>
      ) : null}
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
    borderRadius: spacing.xs + 2,
    borderWidth: 1,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    minWidth: 44,
  },
  dateMonth: {
    fontFamily: fonts.sansBold,
    fontSize: 9,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase',
  },
  dateDay: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.xl,
  },
  title: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.lg,
    lineHeight: 22,
  },
  description: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm + 1,
    lineHeight: 19,
  },
  meta: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm,
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
    gap: spacing.sm + 2,
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
    borderRadius: spacing.xs + 2,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
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
    fontSize: fontSize.base,
  },
  title: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.md,
    lineHeight: 20,
  },
  description: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
  meta: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm,
  },
});

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radii.pill,
  },
  badgeText: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.xs - 1,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase',
  },
  copyWithRail: {
    flex: 1,
    minWidth: 0,
  },
  compactThumbWrap: {
    width: 56,
    height: 56,
    borderRadius: radii.sm,
    borderWidth: 1,
    overflow: 'hidden',
  },
  compactThumbImage: {
    width: '100%',
    height: '100%',
  },
});

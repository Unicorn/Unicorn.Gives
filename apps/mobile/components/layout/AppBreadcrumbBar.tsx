import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { toHref } from '@/lib/navigation';
import { useTheme, breakpoints, fonts, fontSize, spacing } from '@/constants/theme';
import { useHydratedDimensions } from '@/hooks/useHydrated';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export function AppBreadcrumbBar({ items }: { items: BreadcrumbItem[] }) {
  const { colors } = useTheme();
  const { width } = useHydratedDimensions();
  const isTablet = width >= breakpoints.tablet;
  const isDesktop = width >= breakpoints.desktop;

  if (!items.length) return null;

  const trailText = items
    .map((c, i) => (i === 0 ? c.label : ` › ${c.label}`))
    .join('');

  return (
    <View style={[styles.wrap, { backgroundColor: colors.surface, borderBottomColor: colors.outlineVariant }]}>
      <View style={[styles.inner, isTablet && styles.innerTablet, isDesktop && styles.innerDesktop]}>
        {isTablet ? (
          <View style={styles.row}>
            {items.map((crumb, i) => {
              const isLast = i === items.length - 1;
              const itemKey = crumb.href || `trail:${crumb.label}`;
              return (
                <View key={itemKey} style={styles.item}>
                  {i > 0 && (
                    <Text style={[styles.sep, { color: `${colors.neutral}66` }]}>{'›'}</Text>
                  )}
                  {!isLast && crumb.href ? (
                    <Link href={toHref(crumb.href)} asChild>
                      <Pressable>
                        <Text style={[styles.link, { color: colors.primary }]}>{crumb.label}</Text>
                      </Pressable>
                    </Link>
                  ) : (
                    <Text style={[styles.current, { color: colors.neutral }]}>{crumb.label}</Text>
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.mobileTrail, { color: colors.neutral }]}
          >
            {trailText}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: 1,
  },
  inner: {
    width: '100%',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  innerTablet: {
    maxWidth: 960,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  innerDesktop: {
    maxWidth: 1100,
    alignSelf: 'center',
    paddingHorizontal: 28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
  },
  mobileTrail: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.sm + 1,
    textAlign: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  sep: {
    fontSize: fontSize.sm,
  },
  link: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.sm + 1,
  },
  current: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.sm + 1,
  },
});

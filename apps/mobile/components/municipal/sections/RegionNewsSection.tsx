/**
 * Two-column news & updates section: one featured card + a list of compact
 * editorial cards. Mirrors the Stitch comp ("Township News & Updates").
 */
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import {
  breakpoints,
  fonts,
  fontSize,
  letterSpacing,
  spacing,
  useTheme,
} from '@/constants/theme';
import { useHydratedDimensions } from '@/hooks/useHydrated';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { FeaturedContentCard } from '@/components/widgets/FeaturedContentCard';
import { EditorialCard } from '@/components/widgets/EditorialCard';
import { eventDateBoxFromIso } from '@/lib/events/eventDateFormat';
import { routes } from '@/lib/navigation';
import type { RegionNewsItem } from '@/lib/municipal/regionLanding';

interface RegionNewsSectionProps {
  items: RegionNewsItem[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
}

export function RegionNewsSection({
  items,
  title = 'News & Updates',
  subtitle,
  showViewAll = true,
}: RegionNewsSectionProps) {
  const { colors } = useTheme();
  const { width } = useHydratedDimensions();
  const isTablet = width >= breakpoints.tablet;

  if (!items.length) return null;
  const [featured, ...rest] = items;
  const listItems = rest.slice(0, 3);

  return (
    <View
      style={[
        styles.section,
        { backgroundColor: colors.surfaceContainer },
      ]}
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.eyebrow, { color: colors.neutralVariant }]}>
              NEWS & UPDATES
            </Text>
            <Text style={[styles.title, { color: colors.neutral }]}>{title}</Text>
            {subtitle ? (
              <Text style={[styles.subtitle, { color: colors.neutralVariant }]}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          {showViewAll ? (
            <Link href={routes.community.news.index()} asChild>
              <AnimatedPressable style={StyleSheet.flatten(styles.viewAll)}>
                <Text style={[styles.viewAllText, { color: colors.primary }]}>
                  View all
                </Text>
                <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
              </AnimatedPressable>
            </Link>
          ) : null}
        </View>

        <View style={[styles.grid, isTablet && styles.gridTablet]}>
          <View style={[styles.col, isTablet && styles.colTablet]}>
            <FeaturedContentCard
              href={routes.community.news.detail(featured.slug)}
              title={featured.title}
              description={featured.description}
              date={featured.date}
              category={featured.category}
              imageUrl={featured.image_url}
              ctaLabel="Read article"
            />
          </View>

          {listItems.length > 0 && (
            <View style={[styles.col, isTablet && styles.colTablet, styles.list]}>
              {listItems.map((n) => (
                <EditorialCard
                  key={n.id}
                  title={n.title}
                  description={n.description || undefined}
                  href={routes.community.news.detail(n.slug)}
                  dateBox={eventDateBoxFromIso(n.date)}
                  thumbnailUrl={n.image_url}
                  badge={{
                    label: n.category.replace(/-/g, ' '),
                    bg: colors.surfaceContainerHigh,
                    text: colors.neutral,
                  }}
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: spacing.xxxl + spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  inner: {
    maxWidth: 1280,
    width: '100%',
    alignSelf: 'center',
    gap: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  eyebrow: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.xs,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  title: {
    fontFamily: fonts.serifBold,
    fontSize: 32,
    lineHeight: 38,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: fontSize.base,
    lineHeight: 22,
    marginTop: spacing.xs,
    maxWidth: 520,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  viewAllText: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.md,
  },
  grid: {
    gap: spacing.xl,
  },
  gridTablet: {
    flexDirection: 'row',
  },
  col: {
    gap: spacing.md,
  },
  colTablet: {
    flex: 1,
    minWidth: 0,
  },
  list: {
    gap: spacing.md,
  },
});

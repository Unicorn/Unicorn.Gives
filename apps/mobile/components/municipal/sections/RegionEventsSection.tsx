/**
 * Upcoming events section for a region landing page. Renders a title row
 * with optional "View all" link and a responsive grid of EditorialCards.
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
import { EditorialCard } from '@/components/widgets/EditorialCard';
import { eventDateBoxFromIso, eventLongDateLabel } from '@/lib/events/eventDateFormat';
import { routes } from '@/lib/navigation';
import type { RegionEventItem } from '@/lib/municipal/regionLanding';

interface RegionEventsSectionProps {
  items: RegionEventItem[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
}

export function RegionEventsSection({
  items,
  title = 'Upcoming Events',
  subtitle,
  showViewAll = true,
}: RegionEventsSectionProps) {
  const { colors } = useTheme();
  const { width } = useHydratedDimensions();
  const isTablet = width >= breakpoints.tablet;

  if (!items.length) return null;

  return (
    <View style={styles.section}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.eyebrow, { color: colors.neutralVariant }]}>
              WHAT'S HAPPENING
            </Text>
            <Text style={[styles.title, { color: colors.neutral }]}>{title}</Text>
            {subtitle ? (
              <Text style={[styles.subtitle, { color: colors.neutralVariant }]}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          {showViewAll ? (
            <Link href={routes.community.events.index()} asChild>
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
          {items.map((e) => (
            <View key={e.id} style={[styles.cell, isTablet && styles.cellTablet]}>
              <EditorialCard
                title={e.title}
                description={e.location || e.description || undefined}
                href={routes.community.events.detail(e.slug)}
                dateBox={eventDateBoxFromIso(e.date)}
                thumbnailUrl={e.image_url}
                meta={eventLongDateLabel(e.date)}
                badge={{
                  label: e.category.replace(/-/g, ' '),
                  bg: colors.surfaceContainer,
                  text: colors.neutral,
                }}
              />
            </View>
          ))}
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
    gap: spacing.md,
  },
  gridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {},
  cellTablet: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 280,
  },
});

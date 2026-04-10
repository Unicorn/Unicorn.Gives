/**
 * Upcoming events section for a region landing page. Renders a title row
 * with optional "View all" link and a responsive grid of EventGridCards.
 */
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Container } from '@/components/layout/Container';
import {
  fonts,
  fontSize,
  letterSpacing,
  spacing,
  useTheme,
} from '@/constants/theme';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { EventGridCard } from '@/components/events/EventGridCard';
import { EventsGrid } from '@/components/events/EventsGrid';
import { eventDateBoxFromIso } from '@/lib/events/eventDateFormat';
import { routes } from '@/lib/navigation';
import type { RegionEventItem } from '@/lib/municipal/regionLanding';

interface RegionEventsSectionProps {
  items: RegionEventItem[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  /** Override the "View all" destination. Defaults to the global community events route. */
  viewAllHref?: Href;
}

export function RegionEventsSection({
  items,
  title = 'Upcoming Events',
  subtitle,
  showViewAll = true,
  viewAllHref,
}: RegionEventsSectionProps) {
  const { colors } = useTheme();

  if (!items.length) return null;

  const resolvedHref = viewAllHref ?? routes.community.events.index();

  return (
    <Container style={styles.section}>
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
            <Link href={resolvedHref} asChild>
              <AnimatedPressable style={StyleSheet.flatten(styles.viewAll)}>
                <Text style={[styles.viewAllText, { color: colors.primary }]}>
                  View all
                </Text>
                <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
              </AnimatedPressable>
            </Link>
          ) : null}
        </View>

        <EventsGrid>
          {items.map((e) => {
            const db = eventDateBoxFromIso(e.date);
            return (
              <EventGridCard
                key={e.id}
                title={e.title}
                description={e.location || e.description || undefined}
                location={e.location || undefined}
                imageUrl={e.image_url}
                dateLabel={`${db.month} ${db.day}`}
                href={routes.community.events.detail(e.slug)}
              />
            );
          })}
        </EventsGrid>
    </Container>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: spacing.xxxl + spacing.lg,
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
});

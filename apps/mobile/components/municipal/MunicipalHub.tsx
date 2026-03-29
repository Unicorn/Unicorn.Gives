import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useRegion } from '@/lib/hooks/useRegion';
import { supabase } from '@/lib/supabase';
import { useMunicipalRoute } from '@/lib/useMunicipalRoute';
import { useTheme, fonts, spacing, radii, shadows } from '@/constants/theme';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { BentoGrid, type BentoItem } from '@/components/widgets';
import { EditorialCard } from '@/components/widgets/EditorialCard';
import { toHref } from '@/lib/navigation/paths';

interface UpcomingEvent {
  id: string;
  slug: string;
  title: string;
  date: string;
  location?: string;
}

export function MunicipalHub() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const { municipalitySlug, basePath } = useMunicipalRoute();
  const { region, isLoading } = useRegion(municipalitySlug);
  const [stats, setStats] = useState({ minutes: 0, ordinances: 0, contacts: 0, events: 0 });
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);

  useEffect(() => {
    if (!region) return;
    Promise.all([
      supabase.from('minutes').select('*', { count: 'exact', head: true }).eq('region_id', region.id),
      supabase.from('ordinances').select('*', { count: 'exact', head: true }).eq('region_id', region.id),
      supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('region_id', region.id),
      supabase.from('events').select('*', { count: 'exact', head: true }).eq('region_id', region.id).eq('status', 'published'),
    ]).then(([m, o, c, e]) => {
      setStats({ minutes: m.count || 0, ordinances: o.count || 0, contacts: c.count || 0, events: e.count || 0 });
    });

    // Fetch upcoming events for preview
    supabase
      .from('events')
      .select('id, slug, title, date, location')
      .eq('region_id', region.id)
      .eq('status', 'published')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(3)
      .then(({ data }) => {
        if (data) setUpcomingEvents(data);
      });
  }, [region]);

  if (isLoading) return <View style={{ flex: 1, backgroundColor: colors.background }}><Text style={{ padding: spacing.xxl, color: colors.neutralVariant, textAlign: 'center' }}>Loading...</Text></View>;
  if (!region) return <View style={{ flex: 1, backgroundColor: colors.background }}><Text style={{ padding: spacing.xxl, color: colors.neutralVariant, textAlign: 'center' }}>Municipality not found</Text></View>;

  /* ── Bento grid items ───────────────────────── */
  const bentoItems: BentoItem[] = [
    {
      key: 'minutes',
      icon: 'assignment',
      title: 'Meeting Minutes',
      description: stats.minutes > 0 ? `${stats.minutes} published records` : 'Board & commission meetings',
      span: 'full',
      colorScheme: 'surface',
      href: toHref(`${basePath}/minutes`),
    },
    {
      key: 'ordinances',
      icon: 'gavel',
      title: 'Ordinances',
      description: stats.ordinances > 0 ? `${stats.ordinances} active ordinances` : 'Local laws & resolutions',
      span: 'half',
      colorScheme: 'surface',
      href: toHref(`${basePath}/ordinances`),
    },
    {
      key: 'contacts',
      icon: 'contacts',
      title: 'Contact Directory',
      description: stats.contacts > 0 ? `${stats.contacts} officials & staff` : 'Township officials & departments',
      span: 'half',
      colorScheme: 'surface',
      href: toHref(`${basePath}/contacts`),
    },
    {
      key: 'events',
      icon: 'event',
      title: 'Events',
      description: stats.events > 0 ? `${stats.events} upcoming events` : 'Community calendar',
      span: 'half',
      colorScheme: 'surface',
      href: toHref(`${basePath}/events`),
    },
    {
      key: 'elections',
      icon: 'how-to-vote',
      title: 'Elections',
      description: 'Polling locations & deadlines',
      span: 'half',
      colorScheme: 'muted',
      href: toHref(`${basePath}/elections`),
    },
  ];

  /* ── Planning docs ──────────────────────────── */
  const planningDocs = [
    { label: 'Master Plan 2040', subtitle: 'Adopted March 2024', href: `${basePath}/master-plan`, icon: 'architecture' as const },
    { label: 'Recreation Plan 2026\u20132030', subtitle: 'Adopted January 2026', href: `${basePath}/recreation-plan`, icon: 'park' as const },
    { label: 'Zoning Ordinance', subtitle: 'Ordinance No. 44', href: `${basePath}/zoning`, icon: 'map' as const },
  ];

  /* ── Stats badges ───────────────────────────── */
  const statBadges = [
    { label: 'Minutes', count: stats.minutes },
    { label: 'Ordinances', count: stats.ordinances },
    { label: 'Contacts', count: stats.contacts },
    { label: 'Events', count: stats.events },
  ].filter((s) => s.count > 0);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ paddingBottom: 48 }}>
      {/* ── 1. Hero Section ─────────────────────── */}
      <View style={[styles.hero, { backgroundColor: colors.heroBar }]}>
        <Text style={[styles.heroEyebrow, { color: colors.gold }]}>
          {region.type.toUpperCase()}
        </Text>
        <Text style={[styles.heroTitle, { color: colors.onHeroBar }]}>
          {region.name}
        </Text>
        {region.description && (
          <Text style={[styles.heroDescription, { color: colors.outline }]}>
            {region.description}
          </Text>
        )}
        {statBadges.length > 0 && (
          <View style={styles.statsRow}>
            {statBadges.map((s, i) => (
              <View key={s.label} style={styles.statBadgeRow}>
                {i > 0 && <Text style={[styles.statDivider, { color: colors.outline }]}>{'\u00B7'}</Text>}
                <Text style={[styles.statBadgeText, { color: colors.onHeroBar }]}>
                  {s.count} {s.label}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* ── 2. Quick Access Bento Grid ─────────── */}
      <View style={styles.section}>
        <BentoGrid
          eyebrow="Quick Access"
          title="Township Resources"
          items={bentoItems}
        />
      </View>

      {/* ── 3. Upcoming Events Preview ─────────── */}
      {upcomingEvents.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionEyebrow, { color: colors.neutralVariant }]}>
              WHAT'S HAPPENING
            </Text>
            <Text style={[styles.sectionTitle, { color: colors.neutral }]}>
              Upcoming Events
            </Text>
          </View>
          <View style={[styles.eventsGrid, isTablet && styles.eventsGridTablet]}>
            {upcomingEvents.map((evt) => {
              const d = new Date(evt.date + 'T00:00:00');
              const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
              const day = d.getDate();
              return (
                <EditorialCard
                  key={evt.id}
                  title={evt.title}
                  description={evt.location || undefined}
                  dateBox={{ month, day }}
                  href={toHref(`${basePath}/events/${evt.slug}`)}
                  meta={d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                />
              );
            })}
          </View>
          <Link href={toHref(`${basePath}/events`)} asChild>
            <AnimatedPressable style={StyleSheet.flatten(styles.seeAllRow)}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                See all events
              </Text>
              <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
            </AnimatedPressable>
          </Link>
        </View>
      )}

      {/* ── 4. Planning Documents ──────────────── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionEyebrow, { color: colors.neutralVariant }]}>
            OFFICIAL DOCUMENTS
          </Text>
          <Text style={[styles.sectionTitle, { color: colors.neutral }]}>
            Planning & Zoning
          </Text>
        </View>
        {planningDocs.map((doc) => (
          <Link key={doc.label} href={doc.href as any} asChild>
            <AnimatedPressable
              variant="card"
              style={StyleSheet.flatten([styles.docCard, { backgroundColor: colors.surface }, shadows.cardElevated])}
            >
              <View style={[styles.docIconBox, { backgroundColor: colors.surfaceContainer }]}>
                <MaterialIcons name={doc.icon as any} size={24} color={colors.primary} />
              </View>
              <View style={styles.docText}>
                <Text style={[styles.docTitle, { color: colors.neutral }]}>{doc.label}</Text>
                <Text style={[styles.docSubtitle, { color: colors.neutralVariant }]}>{doc.subtitle}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={22} color={colors.neutralVariant} />
            </AnimatedPressable>
          </Link>
        ))}
      </View>

      {/* ── 5. Visit Website CTA ──────────────── */}
      {region.website && (
        <View style={styles.section}>
          <AnimatedPressable
            variant="card"
            onPress={() => Linking.openURL(region.website!)}
            style={[styles.ctaCard, { backgroundColor: colors.primaryContainer }]}
          >
            <MaterialIcons name="language" size={28} color={colors.primary} />
            <View style={styles.ctaText}>
              <Text style={[styles.ctaTitle, { color: colors.neutral }]}>
                Visit Official Website
              </Text>
              <Text style={[styles.ctaSubtitle, { color: colors.neutralVariant }]} numberOfLines={1}>
                {region.website.replace(/^https?:\/\//, '')}
              </Text>
            </View>
            <MaterialIcons name="open-in-new" size={18} color={colors.primary} />
          </AnimatedPressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  /* Hero */
  hero: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl + 4,
    gap: spacing.sm,
  },
  heroEyebrow: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontFamily: fonts.serifBold,
    fontSize: 32,
    lineHeight: 38,
  },
  heroDescription: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 22,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  statBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statBadgeText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    opacity: 0.85,
  },
  statDivider: {
    fontSize: 14,
    opacity: 0.5,
  },

  /* Sections */
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + 4,
    gap: spacing.md,
  },
  sectionHeader: {
    gap: 4,
    marginBottom: spacing.xs,
  },
  sectionEyebrow: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1.5,
  },
  sectionTitle: {
    fontFamily: fonts.serifItalic,
    fontSize: 28,
  },

  /* Events grid */
  eventsGrid: {
    gap: spacing.md,
  },
  eventsGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  seeAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  seeAllText: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
  },

  /* Planning doc cards */
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    padding: spacing.lg,
    gap: spacing.md,
  },
  docIconBox: {
    width: 44,
    height: 44,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docText: {
    flex: 1,
    gap: 2,
  },
  docTitle: {
    fontFamily: fonts.sansBold,
    fontSize: 15,
  },
  docSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 13,
  },

  /* CTA card */
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.md,
    padding: spacing.xl,
    gap: spacing.md,
  },
  ctaText: {
    flex: 1,
    gap: 2,
  },
  ctaTitle: {
    fontFamily: fonts.sansBold,
    fontSize: 15,
  },
  ctaSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 13,
  },
});

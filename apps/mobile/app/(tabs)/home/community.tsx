import { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { routes } from '@/lib/navigation';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, fonts, spacing, radii, shadows } from '@/constants/theme';
import { ContentContainer } from '@/components/layout/ContentContainer';
import {
  HORN_HERO,
  HORN_MISSION,
  HORN_PERKS,
  HORN_INFO,
  HORN_QUOTE,
} from '@/constants/hornContent';
import { HeroFeature, BentoGrid, QuoteCallout, InfoRowGroup } from '@/components/widgets';

export default function CommunityTab() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ContentContainer>
      {/* Hero: The Horn */}
      <HeroFeature
        eyebrow={HORN_HERO.eyebrow}
        title={HORN_HERO.title}
        description={HORN_HERO.description}
        ctaLabel={HORN_HERO.ctaLabel}
        ctaHref={routes.partners.index('the-horn')}
        secondaryCta={{
          label: HORN_HERO.secondaryCtaLabel,
          href: routes.partners.index('the-horn'),
        }}
      />

      {/* Mission Quote */}
      <QuoteCallout quote={HORN_MISSION} variant="centered" />

      {/* Member Perks Bento */}
      <BentoGrid
        eyebrow="Member Benefits"
        title="Member Perks"
        subtitle="Designed for the modern Northern resident — balancing professional needs with the ultimate comfort."
        items={HORN_PERKS}
      />

      {/* Visit Info */}
      <InfoRowGroup title={HORN_INFO.title} rows={[...HORN_INFO.rows]} />

      {/* Decorative quote */}
      <QuoteCallout
        quote={HORN_QUOTE.quote}
        attribution={HORN_QUOTE.attribution}
        variant="aside"
      />

      {/* Existing navigation links */}
      <View style={styles.navSection}>
        <Text style={styles.navSectionTitle}>Explore Community</Text>
        <Link href={routes.community.events.index()} asChild>
          <TouchableOpacity style={styles.navCard}>
            <MaterialIcons name="event" size={24} color={colors.neutralVariant} />
            <View style={styles.navCardText}>
              <Text style={styles.navCardTitle}>Events</Text>
              <Text style={styles.navCardDesc}>Upcoming and past community events</Text>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href={routes.community.opinions.index()} asChild>
          <TouchableOpacity style={styles.navCard}>
            <MaterialIcons name="forum" size={24} color={colors.neutralVariant} />
            <View style={styles.navCardText}>
              <Text style={styles.navCardTitle}>Opinions</Text>
              <Text style={styles.navCardDesc}>
                Community posts, discussions, and perspectives
              </Text>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href={routes.community.calendar()} asChild>
          <TouchableOpacity style={styles.navCard}>
            <MaterialIcons name="calendar-today" size={24} color={colors.neutralVariant} />
            <View style={styles.navCardText}>
              <Text style={styles.navCardTitle}>Calendar</Text>
              <Text style={styles.navCardDesc}>Calendar view of all community events</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
      </ContentContainer>
    </ScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40, gap: 24 },
  navSection: { gap: 10 },
  navSectionTitle: {
    fontFamily: fonts.serifItalic,
    fontSize: 24,
    color: colors.primary,
    marginBottom: 4,
  },
  navCard: {
    flexDirection: 'row',
    borderRadius: radii.md,
    padding: 16,
    backgroundColor: colors.surface,
    ...shadows.card,
    gap: 14,
    alignItems: 'center',
  },
  navCardIcon: { fontSize: 24, width: 36, textAlign: 'center' },
  navCardText: { flex: 1, gap: 2 },
  navCardTitle: {
    fontFamily: fonts.sansBold,
    fontSize: 16,
    color: colors.neutral,
  },
  navCardDesc: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.neutralVariant,
    lineHeight: 19,
  },
});

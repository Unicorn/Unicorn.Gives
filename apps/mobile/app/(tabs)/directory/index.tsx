import { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { routes } from '@/lib/navigation';
import { supabase } from '@/lib/supabase';
import { useTheme, fonts, fontSize, spacing, radii, shadows, type ThemeColors } from '@/constants/theme';
import { Wrapper } from '@/components/layout/Wrapper';
import { Container } from '@/components/layout/Container';
import { RegionHeroSection } from '@/components/municipal/sections/RegionHeroSection';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

interface Partner {
  slug: string;
  name: string;
  description: string | null;
}

export default function PartnersDirectory() {
  const { colors } = useTheme();
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    supabase
      .from('partners')
      .select('slug, name, description')
      .eq('is_active', true)
      .then(({ data }) => { if (data) setPartners(data); });
  }, []);

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Wrapper style={styles.container} contentContainerStyle={styles.content}>
      <RegionHeroSection
        eyebrow="Directory"
        headline="Community"
        headlineAccent="Partners"
        subheadline="Organizations serving Clare County and northern Michigan."
      />
      <Container style={styles.section}>
      {partners.map(p => (
        <Link key={p.slug} href={routes.partners.index(p.slug)} asChild>
          <AnimatedPressable variant="card" style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{p.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.name}>{p.name}</Text>
              {p.description && <Text style={styles.desc} numberOfLines={2}>{p.description}</Text>}
            </View>
          </AnimatedPressable>
        </Link>
      ))}
      {partners.length === 0 && <Text style={styles.empty}>Loading partners...</Text>}
      </Container>
    </Wrapper>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: spacing.xxxl + spacing.sm },
  section: { paddingTop: spacing.xxl },
  card: { flexDirection: 'row', borderRadius: radii.md, padding: spacing.lg, marginBottom: spacing.sm + 2, backgroundColor: colors.surface, ...shadows.card, gap: spacing.lg - 2, alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.neutral, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontFamily: fonts.sansBold, fontSize: fontSize.xl + 2, color: colors.background },
  body: { flex: 1 },
  name: { fontFamily: fonts.sansBold, fontSize: fontSize.lg, color: colors.neutral, marginBottom: spacing.xs },
  desc: { fontFamily: fonts.sans, fontSize: fontSize.md, color: colors.neutral, lineHeight: 20 },
  empty: { fontFamily: fonts.sans, textAlign: 'center', color: colors.neutralVariant, marginTop: spacing.xxxl + spacing.sm },
});

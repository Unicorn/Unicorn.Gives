import { useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { routes } from '@/lib/navigation';
import { LORE_ORDER, getLoreDoc } from '@/lib/lore';
import { useTheme, fonts, spacing, radii, shadows } from '@/constants/theme';
import { Wrapper } from '@/components/layout/Wrapper';
import { Container } from '@/components/layout/Container';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

export default function HistoryTab() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Wrapper style={styles.container} contentContainerStyle={styles.content}>
      <Container>
      <Text style={styles.intro}>
        Tier 0 of unicorn.gives — the stories, traditions, and histories that sit beneath the county lines.
        Read as folklore and teaching, not as a substitute for science or tribal authority.
      </Text>
      {LORE_ORDER.map((slug) => {
        const doc = getLoreDoc(slug);
        if (!doc) return null;
        return (
          <Link key={slug} href={routes.history.detail(slug)} asChild>
            <AnimatedPressable variant="card" style={styles.card}>
              <Text style={styles.eyebrow}>{doc.eyebrow}</Text>
              <Text style={styles.title}>{doc.title}</Text>
              <Text style={styles.blurb} numberOfLines={3}>
                {doc.intro}
              </Text>
            </AnimatedPressable>
          </Link>
        );
      })}
      </Container>
    </Wrapper>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  intro: {
    fontSize: 15,
    color: colors.neutralVariant,
    lineHeight: 24,
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: 18,
    marginBottom: 14,
    ...shadows.card,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutralVariant,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.neutral,
    marginBottom: 10,
    fontFamily: fonts.serif,
  },
  blurb: { fontSize: 14, color: colors.neutralVariant, lineHeight: 21 },
});

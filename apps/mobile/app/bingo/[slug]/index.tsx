import { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { Wrapper } from '@/components/layout/Wrapper';
import { Container } from '@/components/layout/Container';
import { RegionHeroSection } from '@/components/municipal/sections/RegionHeroSection';
import { Button } from '@/components/ui/Button';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { SeoHead } from '@/components/SeoHead';
import { AgeGateModal } from '@/components/bingo/AgeGateModal';
import { getAgeAccepted, setAgeAccepted } from '@/lib/bingo/ageGate';
import { useTheme, fonts, fontSize, spacing, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

interface GameDetail {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  body: string | null;
  rules_md: string | null;
  disclaimer_md: string | null;
  age_gate_required: boolean;
  age_gate_min: number;
}

export default function BingoGameLandingPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('bingo_games')
      .select(
        'id, slug, title, subtitle, description, body, rules_md, disclaimer_md, age_gate_required, age_gate_min',
      )
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
      .then(({ data }) => {
        setGame(data as GameDetail);
        setLoading(false);
      });
  }, [slug]);

  async function handlePlay() {
    if (!game) return;
    if (game.age_gate_required && !(await getAgeAccepted(game.id))) {
      setShowGate(true);
      return;
    }
    router.push(toHref(`/bingo/${game.slug}/play`));
  }

  async function acceptAge() {
    if (!game) return;
    await setAgeAccepted(game.id);
    setShowGate(false);
    router.push(toHref(`/bingo/${game.slug}/play`));
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!game) {
    return (
      <Wrapper>
        <Container style={styles.section}>
          <Text style={styles.notFound}>This game isn’t available.</Text>
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <SeoHead title={game.title} description={game.description ?? game.subtitle ?? 'Community bingo'} />
      <RegionHeroSection
        eyebrow={game.subtitle ?? 'Bingo'}
        headline={game.title}
        subheadline={game.description ?? undefined}
        primaryCta={{ label: 'Play now', url: `/bingo/${game.slug}/play` }}
      />
      <Container style={styles.section}>
        <View style={styles.actions}>
          <Button label="Play now" variant="primary" onPress={handlePlay} />
          <Button
            label="How to play"
            variant="secondary"
            onPress={() => router.push(toHref(`/bingo/${game.slug}/about`))}
          />
        </View>

        {game.body ? (
          <View style={styles.block}>
            <MarkdownRenderer content={game.body} />
          </View>
        ) : null}

        {game.rules_md ? (
          <View style={styles.block}>
            <Text style={styles.blockHeading}>How to play</Text>
            <MarkdownRenderer content={game.rules_md} />
          </View>
        ) : null}
      </Container>

      <AgeGateModal
        visible={showGate}
        minAge={game.age_gate_min}
        disclaimerMd={game.disclaimer_md}
        onAccept={acceptAge}
        onDecline={() => setShowGate(false)}
      />
    </Wrapper>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxxl },
    section: { paddingVertical: spacing.xxl, gap: spacing.xl },
    actions: { flexDirection: 'row', gap: spacing.md, flexWrap: 'wrap' },
    block: { gap: spacing.sm },
    blockHeading: { fontFamily: fonts.serifBold, fontSize: fontSize.xl, color: colors.neutral, marginBottom: spacing.xs },
    notFound: { fontFamily: fonts.sans, fontSize: fontSize.md, color: colors.neutralVariant },
  });

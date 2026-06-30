import { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { Wrapper } from '@/components/layout/Wrapper';
import { Container } from '@/components/layout/Container';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { SeoHead } from '@/components/SeoHead';
import { useTheme, fonts, fontSize, spacing, type ThemeColors } from '@/constants/theme';

interface GameAbout {
  title: string;
  rules_md: string | null;
  disclaimer_md: string | null;
}

export default function BingoAboutPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [game, setGame] = useState<GameAbout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('bingo_games')
      .select('title, rules_md, disclaimer_md')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
      .then(({ data }) => {
        setGame(data as GameAbout);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <Wrapper>
      <SeoHead title={game ? `${game.title} — How to Play` : 'How to Play'} description="Rules and terms." />
      <Container style={styles.section}>
        <Text style={styles.pageTitle}>How to play</Text>
        {game?.rules_md ? <MarkdownRenderer content={game.rules_md} /> : <Text style={styles.muted}>No rules provided.</Text>}

        <View style={styles.divider} />

        <Text style={styles.pageTitle}>Terms &amp; disclaimer</Text>
        {game?.disclaimer_md ? (
          <MarkdownRenderer content={game.disclaimer_md} />
        ) : (
          <Text style={styles.muted}>No disclaimer provided.</Text>
        )}
      </Container>
    </Wrapper>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxxl },
    section: { paddingVertical: spacing.xxl, gap: spacing.md },
    pageTitle: { fontFamily: fonts.serifBold, fontSize: fontSize['2xl'], color: colors.neutral, marginBottom: spacing.sm },
    muted: { fontFamily: fonts.sans, fontSize: fontSize.md, color: colors.neutralVariant },
    divider: { height: 1, backgroundColor: colors.outlineVariant, marginVertical: spacing.xl },
  });

import { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { supabase } from '@/lib/supabase';
import { Wrapper } from '@/components/layout/Wrapper';
import { Container } from '@/components/layout/Container';
import { RegionHeroSection } from '@/components/municipal/sections/RegionHeroSection';
import { Card } from '@/components/ui/Card';
import { SeoHead } from '@/components/SeoHead';
import { resolveAbsoluteAssetUrl } from '@/lib/resolveAssetUrl';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

interface GameCard {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  cover_image_url: string | null;
  featured: boolean;
  starts_on: string | null;
  ends_on: string | null;
}

export default function BingoIndexPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [games, setGames] = useState<GameCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('bingo_games')
      .select('id, slug, title, subtitle, description, cover_image_url, featured, starts_on, ends_on')
      .eq('status', 'published')
      .order('featured', { ascending: false })
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setGames((data as GameCard[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <Wrapper>
      <SeoHead title="Bingo" description="Community bingo games — get a board and play all season." />
      <RegionHeroSection
        eyebrow="Play"
        headline="Community Bingo"
        subheadline="Grab a board, knock out squares all season, and bring your stories to the party."
      />
      <Container style={styles.section}>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xxl }} />
        ) : games.length === 0 ? (
          <Text style={styles.empty}>No games are running right now. Check back soon.</Text>
        ) : (
          <View style={styles.grid}>
            {games.map((g) => {
              const cover = resolveAbsoluteAssetUrl(g.cover_image_url ?? '');
              return (
                <Pressable
                  key={g.id}
                  style={styles.cardWrap}
                  onPress={() => router.push(toHref(`/bingo/${g.slug}`))}
                >
                  <Card variant="flat" hoverable style={styles.card}>
                    {cover ? (
                      <Image source={{ uri: cover }} style={styles.cover} resizeMode="cover" />
                    ) : (
                      <View style={[styles.cover, styles.coverFallback]}>
                        <MaterialIcons name="grid-view" size={40} color={colors.onPrimary} />
                      </View>
                    )}
                    <View style={styles.cardBody}>
                      {g.featured ? (
                        <View style={styles.featuredChip}>
                          <Text style={styles.featuredChipText}>Featured</Text>
                        </View>
                      ) : null}
                      <Text style={styles.cardTitle}>{g.title}</Text>
                      {g.subtitle ? <Text style={styles.cardSubtitle}>{g.subtitle}</Text> : null}
                      {g.description ? (
                        <Text style={styles.cardDesc} numberOfLines={3}>
                          {g.description}
                        </Text>
                      ) : null}
                    </View>
                  </Card>
                </Pressable>
              );
            })}
          </View>
        )}
      </Container>
    </Wrapper>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    section: { paddingVertical: spacing.xxl },
    empty: { fontFamily: fonts.sans, fontSize: fontSize.md, color: colors.neutralVariant, textAlign: 'center', marginTop: spacing.xxl },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
    cardWrap: { flexGrow: 1, flexBasis: 300, maxWidth: 420 },
    card: { overflow: 'hidden', padding: 0 },
    cover: { width: '100%', height: 160 },
    coverFallback: { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
    cardBody: { padding: spacing.lg, gap: spacing.xs },
    featuredChip: {
      alignSelf: 'flex-start',
      backgroundColor: colors.goldContainer,
      borderWidth: 1,
      borderColor: colors.gold,
      borderRadius: radii.pill,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      marginBottom: spacing.xs,
    },
    featuredChipText: { fontFamily: fonts.sansMedium, fontSize: fontSize.sm - 1, color: colors.gold },
    cardTitle: { fontFamily: fonts.serifBold, fontSize: fontSize.lg, color: colors.neutral },
    cardSubtitle: { fontFamily: fonts.sansMedium, fontSize: fontSize.sm, color: colors.primary },
    cardDesc: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant, marginTop: spacing.xs },
  });

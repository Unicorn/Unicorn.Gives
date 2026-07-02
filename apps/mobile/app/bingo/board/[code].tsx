import { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { supabase } from '@/lib/supabase';
import { Wrapper } from '@/components/layout/Wrapper';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { SeoHead } from '@/components/SeoHead';
import { BingoGrid } from '@/components/bingo/BingoGrid';
import { detectWins, type BingoCategory, type BoardCell, type WinTier } from '@/lib/bingo/engine';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

interface PublicBoard {
  board_code: string;
  cells: BoardCell[];
  marked: number[] | null;
  highest_tier: string | null;
  is_saved: boolean;
  created_at: string;
  game_slug: string;
  game_title: string;
  board_size: number;
  categories: BingoCategory[];
  win_tiers: WinTier[];
}

export default function SharedBoardPage() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [board, setBoard] = useState<PublicBoard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    supabase
      .rpc('get_bingo_board', { p_code: code })
      .then(({ data }) => {
        const row = Array.isArray(data) ? data[0] : data;
        setBoard((row as PublicBoard) ?? null);
        setLoading(false);
      });
  }, [code]);

  const win = useMemo(() => {
    if (!board) return null;
    const size = board.board_size;
    const marked = Array.isArray(board.marked) ? board.marked : [];
    const bool = Array.from({ length: size * size }, (_, i) => marked.includes(i));
    return detectWins(bool, board.win_tiers ?? [], size).highestTier;
  }, [board]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!board) {
    return (
      <Wrapper>
        <SeoHead title="Board not found" description="This bingo board could not be found." />
        <Container style={styles.section}>
          <Text style={styles.notFound}>We couldn’t find a board with that code.</Text>
          <Button label="Browse bingo games" variant="primary" onPress={() => router.push(toHref('/bingo'))} />
        </Container>
      </Wrapper>
    );
  }

  const size = board.board_size;
  const markedCount = board.marked?.length ?? 0;

  return (
    <Wrapper>
      <SeoHead
        title={`${board.game_title} — Board ${board.board_code}`}
        description={`A shared ${board.game_title} bingo board.`}
      />
      <Container style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>{board.game_title}</Text>
          <Text style={styles.title}>Board {board.board_code}</Text>
          <Text style={styles.meta}>
            {markedCount} / {size * size - 1} squares marked
          </Text>
        </View>

        {win ? (
          <View style={styles.winBanner}>
            <MaterialIcons name="emoji-events" size={20} color={colors.onPrimary} />
            <Text style={styles.winText}>
              {win.label}
              {win.prize ? ` — ${win.prize}` : ''}
            </Text>
          </View>
        ) : null}

        <View style={styles.boardWrap}>
          <BingoGrid
            cells={board.cells}
            boardSize={size}
            marked={Array.isArray(board.marked) ? board.marked : []}
            categories={board.categories ?? []}
            readOnly
          />
        </View>

        <Text style={styles.readonlyNote}>This is a read-only view of someone’s board.</Text>

        <View style={styles.actions}>
          <Button
            label="Play your own"
            variant="primary"
            onPress={() => router.push(toHref(`/bingo/${board.game_slug}`))}
          />
        </View>
      </Container>
    </Wrapper>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxxl },
    section: { paddingVertical: spacing.xxl, gap: spacing.lg, maxWidth: 640, width: '100%', alignSelf: 'center' },
    header: { gap: spacing.xs },
    eyebrow: { fontFamily: fonts.sansMedium, fontSize: fontSize.sm, color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
    title: { fontFamily: fonts.serifBold, fontSize: fontSize['2xl'], color: colors.neutral },
    meta: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant },
    winBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.primary,
      borderRadius: radii.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    winText: { fontFamily: fonts.sansBold, fontSize: fontSize.md, color: colors.onPrimary },
    boardWrap: { width: '100%' },
    readonlyNote: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant, fontStyle: 'italic' },
    actions: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
    notFound: { fontFamily: fonts.sans, fontSize: fontSize.md, color: colors.neutralVariant, marginBottom: spacing.md },
  });

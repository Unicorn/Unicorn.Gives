import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, Platform, Share, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { supabase } from '@/lib/supabase';
import { Wrapper } from '@/components/layout/Wrapper';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { SeoHead } from '@/components/SeoHead';
import { RequireAuth } from '@/lib/routeGuards';
import { BingoGrid } from '@/components/bingo/BingoGrid';
import { AgeGateModal } from '@/components/bingo/AgeGateModal';
import { getAgeAccepted, setAgeAccepted } from '@/lib/bingo/ageGate';
import { detectWins, type BingoCategory, type BoardCell, type WinTier } from '@/lib/bingo/engine';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

interface GameInfo {
  id: string;
  slug: string;
  title: string;
  board_size: number;
  allow_reroll: boolean;
  age_gate_required: boolean;
  age_gate_min: number;
  disclaimer_md: string | null;
  categories: BingoCategory[];
  win_tiers: WinTier[];
}

interface BoardRow {
  id: string;
  board_code: string;
  cells: BoardCell[];
  marked: number[];
  highest_tier: string | null;
}

function PlayScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [game, setGame] = useState<GameInfo | null>(null);
  const [board, setBoard] = useState<BoardRow | null>(null);
  const [marked, setMarked] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGate, setShowGate] = useState(false);
  const [issuing, setIssuing] = useState(false);

  const issueBoard = useCallback(
    async (gameRow: GameInfo, ageConfirmed: boolean) => {
      setIssuing(true);
      const { data, error: fnErr } = await supabase.functions.invoke('bingo-issue-board', {
        body: { game_id: gameRow.id, age_confirmed: ageConfirmed },
      });
      setIssuing(false);
      if (fnErr || !data?.board) {
        setError(data?.error ?? fnErr?.message ?? 'Could not load your board.');
        return;
      }
      const b = data.board as BoardRow;
      setBoard(b);
      setMarked(Array.isArray(b.marked) ? b.marked : []);
    },
    [],
  );

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('bingo_games')
        .select(
          'id, slug, title, board_size, allow_reroll, age_gate_required, age_gate_min, disclaimer_md, categories, win_tiers',
        )
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      if (cancelled) return;
      if (!data) {
        setError('This game isn’t available.');
        setLoading(false);
        return;
      }
      const g: GameInfo = {
        ...data,
        categories: Array.isArray(data.categories) ? data.categories : [],
        win_tiers: Array.isArray(data.win_tiers) ? data.win_tiers : [],
      } as GameInfo;
      setGame(g);
      setLoading(false);

      const accepted = !g.age_gate_required || (await getAgeAccepted(g.id));
      if (!accepted) {
        setShowGate(true);
      } else {
        await issueBoard(g, true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, issueBoard]);

  const win = useMemo(() => {
    if (!game || !board) return null;
    const total = game.board_size * game.board_size;
    const boolMarked = Array.from({ length: total }, (_, i) => marked.includes(i));
    return detectWins(boolMarked, game.win_tiers, game.board_size);
  }, [game, board, marked]);

  const persist = useCallback(
    async (nextMarked: number[], tierKey: string | null) => {
      if (!board) return;
      await supabase
        .from('bingo_boards')
        .update({ marked: nextMarked, highest_tier: tierKey })
        .eq('id', board.id);
    },
    [board],
  );

  function toggle(index: number) {
    if (!game || !board) return;
    const center = Math.floor((game.board_size * game.board_size) / 2);
    if (index === center) return; // FREE space
    const cell = board.cells[index];
    if (cell?.free || !cell?.text) return;
    const next = marked.includes(index) ? marked.filter((i) => i !== index) : [...marked, index];
    setMarked(next);
    const total = game.board_size * game.board_size;
    const boolMarked = Array.from({ length: total }, (_, i) => next.includes(i));
    const tier = detectWins(boolMarked, game.win_tiers, game.board_size).highestTier?.key ?? null;
    void persist(next, tier);
  }

  async function acceptAge() {
    if (!game) return;
    await setAgeAccepted(game.id);
    setShowGate(false);
    await issueBoard(game, true);
  }

  async function reroll() {
    if (!game) return;
    await issueBoard(game, true);
  }

  async function share() {
    if (!game || !board) return;
    const origin = Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.origin : 'https://unicorn.gives';
    const url = `${origin}/bingo/${game.slug}`;
    const message = `My ${game.title} board: ${board.board_code} — ${url}`;
    if (Platform.OS === 'web') {
      const nav = typeof navigator !== 'undefined' ? navigator : undefined;
      if (nav?.share) {
        await nav.share({ title: game.title, text: message, url }).catch(() => {});
      } else if (nav?.clipboard) {
        await nav.clipboard.writeText(message);
        window.alert('Board link copied to clipboard.');
      }
    } else {
      await Share.share({ message }).catch(() => {});
    }
  }

  function print() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') window.print();
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <Wrapper>
      <SeoHead title={game ? `Play ${game.title}` : 'Play'} description="Your bingo board." />
      <Container style={styles.section}>
        {game ? (
          <View style={styles.header}>
            <Text style={styles.title}>{game.title}</Text>
            {board ? <Text style={styles.code}>Board {board.board_code}</Text> : null}
          </View>
        ) : null}

        {win?.highestTier ? (
          <View style={styles.winBanner}>
            <MaterialIcons name="emoji-events" size={20} color={colors.onPrimary} />
            <Text style={styles.winText}>
              {win.highestTier.label}
              {win.highestTier.prize ? ` — ${win.highestTier.prize}` : ''}
            </Text>
          </View>
        ) : null}

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : issuing ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : game && board ? (
          <View style={styles.boardWrap}>
            <BingoGrid
              cells={board.cells}
              boardSize={game.board_size}
              marked={marked}
              categories={game.categories}
              onToggle={toggle}
            />
          </View>
        ) : null}

        {game && board ? (
          <View style={styles.actions}>
            <Button label="Share" variant="secondary" onPress={share} />
            {Platform.OS === 'web' ? <Button label="Print" variant="secondary" onPress={print} /> : null}
            <Button
              label="How to play"
              variant="secondary"
              onPress={() => router.push(toHref(`/bingo/${game.slug}/about`))}
            />
            {game.allow_reroll ? <Button label="New board" variant="secondary" onPress={reroll} /> : null}
          </View>
        ) : null}

        <Text style={styles.honor}>
          Mark a square only after you actually do it. Bring your stories to claim a win.
        </Text>
      </Container>

      {game ? (
        <AgeGateModal
          visible={showGate}
          minAge={game.age_gate_min}
          disclaimerMd={game.disclaimer_md}
          onAccept={acceptAge}
          onDecline={() => router.replace(toHref(`/bingo/${game.slug}`))}
        />
      ) : null}
    </Wrapper>
  );
}

export default function BingoPlayPage() {
  return (
    <RequireAuth>
      <PlayScreen />
    </RequireAuth>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxxl },
    section: { paddingVertical: spacing.xxl, gap: spacing.lg, maxWidth: 640, width: '100%', alignSelf: 'center' },
    header: { gap: spacing.xs },
    title: { fontFamily: fonts.serifBold, fontSize: fontSize['2xl'], color: colors.neutral },
    code: { fontFamily: 'monospace', fontSize: fontSize.sm, color: colors.neutralVariant },
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
    actions: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
    error: { fontFamily: fonts.sans, fontSize: fontSize.md, color: colors.error },
    honor: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant, fontStyle: 'italic' },
  });

import { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { BingoGrid } from '@/components/bingo/BingoGrid';
import { detectWins, type BingoCategory, type BoardCell, type WinTier } from '@/lib/bingo/engine';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

interface BoardDetail {
  id: string;
  board_code: string;
  cells: BoardCell[];
  marked: number[] | null;
  is_saved: boolean;
  saved_at: string | null;
  created_at: string;
  bingo_games: {
    title: string;
    board_size: number;
    categories: BingoCategory[];
    win_tiers: WinTier[];
  } | null;
  profiles: { email: string | null; display_name: string | null } | null;
}

export default function BingoBoardDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [board, setBoard] = useState<BoardDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase
      .from('bingo_boards')
      .select(
        'id, board_code, cells, marked, is_saved, saved_at, created_at, bingo_games(title, board_size, categories, win_tiers), profiles(email, display_name)',
      )
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setBoard(data as unknown as BoardDetail);
        setLoading(false);
      });
  }, [id]);

  const win = useMemo(() => {
    if (!board?.bingo_games) return null;
    const size = board.bingo_games.board_size;
    const marked = Array.isArray(board.marked) ? board.marked : [];
    const bool = Array.from({ length: size * size }, (_, i) => marked.includes(i));
    return detectWins(bool, board.bingo_games.win_tiers ?? [], size).highestTier;
  }, [board]);

  async function handleDelete() {
    if (!board) return;
    await supabase.from('bingo_boards').delete().eq('id', board.id);
    router.replace(toHref('/admin/bingo-boards'));
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!board) {
    return (
      <AdminPageShell title="Board" backHref="/admin/bingo-boards">
        <Text style={styles.meta}>Board not found.</Text>
      </AdminPageShell>
    );
  }

  const size = board.bingo_games?.board_size ?? 5;
  const markedCount = board.marked?.length ?? 0;
  const player = board.profiles?.display_name || board.profiles?.email || 'Unknown player';

  return (
    <AdminPageShell
      title={`Board ${board.board_code}`}
      subtitle={board.bingo_games?.title ?? undefined}
      backHref="/admin/bingo-boards"
      actions={
        <AdminButton label="Delete" variant="danger" icon="delete" onPress={() => setShowDelete(true)} />
      }
    >
      <View style={styles.metaGrid}>
        <Stat label="Player" value={player} colors={colors} />
        <Stat label="Progress" value={`${markedCount} / ${size * size - 1} marked`} colors={colors} />
        <Stat label="Highest win" value={win ? `${win.label}${win.prize ? ` — ${win.prize}` : ''}` : 'None yet'} colors={colors} />
        <Stat label="Saved" value={board.is_saved ? 'Yes' : 'No'} colors={colors} />
      </View>

      <View style={styles.boardWrap}>
        <BingoGrid
          cells={board.cells}
          boardSize={size}
          marked={Array.isArray(board.marked) ? board.marked : []}
          categories={board.bingo_games?.categories ?? []}
          readOnly
        />
      </View>

      <AdminConfirmDialog
        visible={showDelete}
        title="Delete board"
        message={`Delete board ${board.board_code}? ${player} would be issued a fresh board next time they play.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </AdminPageShell>
  );
}

function Stat({ label, value, colors }: { label: string; value: string; colors: ThemeColors }) {
  return (
    <View style={{ gap: 2 }}>
      <Text style={{ fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant }}>{label}</Text>
      <Text style={{ fontFamily: fonts.sansMedium, fontSize: fontSize.md, color: colors.neutral }}>{value}</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxxl },
    metaGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xl,
      marginBottom: spacing.xl,
      backgroundColor: colors.surfaceContainer,
      padding: spacing.lg,
      borderRadius: radii.md,
    },
    boardWrap: { maxWidth: 520, width: '100%' },
    meta: { fontFamily: fonts.sans, fontSize: fontSize.md, color: colors.neutralVariant },
  });

import { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { supabase } from '@/lib/supabase';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { AdminDataTable, type Column } from '@/components/admin/AdminDataTable';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

interface BoardRow {
  id: string;
  board_code: string;
  marked: number[] | null;
  highest_tier: string | null;
  is_saved: boolean;
  created_at: string;
  game_id: string;
  user_id: string;
  bingo_games: { title: string; board_size: number } | null;
  profiles: { email: string | null; display_name: string | null } | null;
}

const SAVED_OPTIONS = [
  { label: 'All boards', value: '' },
  { label: 'Saved', value: 'true' },
  { label: 'Unsaved', value: 'false' },
];

export default function BingoBoardsListPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState('');
  const [savedFilter, setSavedFilter] = useState('');
  const [sortKey, setSortKey] = useState('created_at');
  const [sortAsc, setSortAsc] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BoardRow | null>(null);
  const [games, setGames] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    supabase
      .from('bingo_games')
      .select('id, title')
      .order('title')
      .then(({ data }) => {
        if (data) setGames([{ label: 'All games', value: '' }, ...data.map((g) => ({ label: g.title, value: g.id }))]);
      });
  }, []);

  const filters: Record<string, string | boolean> = {};
  if (gameFilter) filters.game_id = gameFilter;
  if (savedFilter) filters.is_saved = savedFilter === 'true';

  const { data, loading, error, total, pageSize, refresh } = useAdminQuery<BoardRow>('bingo_boards', {
    select:
      'id, board_code, marked, highest_tier, is_saved, created_at, game_id, user_id, bingo_games(title, board_size), profiles(email, display_name)',
    orderBy: sortKey,
    ascending: sortAsc,
    page,
    pageSize: 25,
    filters,
    search: search ? { board_code: search } : {},
  });

  async function handleDelete() {
    if (!deleteTarget) return;
    await supabase.from('bingo_boards').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    refresh();
  }

  const columns: Column<BoardRow>[] = [
    {
      key: 'board_code',
      label: 'Board',
      width: 110,
      sortKey: 'board_code',
      render: (row) => <Text style={styles.code}>{row.board_code}</Text>,
    },
    {
      key: 'game',
      label: 'Game',
      render: (row) => (
        <Text style={styles.cell} numberOfLines={1}>
          {row.bingo_games?.title ?? '—'}
        </Text>
      ),
    },
    {
      key: 'player',
      label: 'Player',
      render: (row) => (
        <Text style={styles.meta} numberOfLines={1}>
          {row.profiles?.display_name || row.profiles?.email || '—'}
        </Text>
      ),
    },
    {
      key: 'progress',
      label: 'Progress',
      width: 90,
      render: (row) => {
        const total = row.bingo_games ? row.bingo_games.board_size * row.bingo_games.board_size - 1 : 24;
        return <Text style={styles.meta}>{(row.marked?.length ?? 0)}/{total}</Text>;
      },
    },
    {
      key: 'highest_tier',
      label: 'Win',
      width: 90,
      render: (row) =>
        row.highest_tier ? (
          <View style={styles.winChip}>
            <Text style={styles.winChipText}>{row.highest_tier}</Text>
          </View>
        ) : (
          <Text style={styles.meta}>—</Text>
        ),
    },
    {
      key: 'is_saved',
      label: 'Saved',
      width: 70,
      render: (row) =>
        row.is_saved ? (
          <MaterialIcons name="bookmark" size={16} color={colors.primary} />
        ) : (
          <Text style={styles.meta}>—</Text>
        ),
    },
    {
      key: 'actions',
      label: '',
      width: 40,
      render: (row) => (
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            setDeleteTarget(row);
          }}
        >
          <MaterialIcons name="delete-outline" size={18} color={colors.error} />
        </Pressable>
      ),
    },
  ];

  return (
    <AdminPageShell title="Bingo Boards" subtitle={`${total} issued boards`}>
      <View style={styles.filtersRow}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={(t) => {
            setSearch(t);
            setPage(1);
          }}
          placeholder="Search by board code..."
          placeholderTextColor={colors.outlineVariant}
        />
        <View style={styles.selectWrap}>
          <select value={gameFilter} onChange={(e: any) => { setGameFilter(e.target.value); setPage(1); }} style={selectStyle(colors)}>
            {games.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </View>
        <View style={styles.selectWrap}>
          <select value={savedFilter} onChange={(e: any) => { setSavedFilter(e.target.value); setPage(1); }} style={selectStyle(colors)}>
            {SAVED_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </View>
      </View>

      <AdminDataTable
        columns={columns}
        data={data}
        loading={loading}
        error={error}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onRowPress={(row) => router.push(toHref(`/admin/bingo-boards/${row.id}`))}
        emptyMessage="No boards issued yet"
        sortKey={sortKey}
        sortDirection={sortAsc ? 'asc' : 'desc'}
        onSort={(key, dir) => {
          setSortKey(key);
          setSortAsc(dir === 'asc');
          setPage(1);
        }}
      />

      <AdminConfirmDialog
        visible={!!deleteTarget}
        title="Delete board"
        message={`Delete board ${deleteTarget?.board_code}? The player would be issued a fresh board next time they play.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminPageShell>
  );
}

function selectStyle(colors: ThemeColors) {
  return {
    padding: '8px 12px',
    fontSize: 13,
    fontFamily: 'inherit',
    border: 'none',
    backgroundColor: 'transparent',
    color: colors.neutral,
    outline: 'none',
    cursor: 'pointer',
    width: '100%',
  } as const;
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    filtersRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg, flexWrap: 'wrap' },
    searchInput: {
      flex: 1,
      minWidth: 200,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: 8,
      fontFamily: fonts.sans,
      fontSize: 13,
      color: colors.neutral,
    },
    selectWrap: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.sm,
      overflow: 'hidden',
      minWidth: 150,
    },
    code: { fontFamily: 'monospace', fontSize: 13, color: colors.neutral },
    cell: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.neutral },
    meta: { fontFamily: fonts.sans, fontSize: 13, color: colors.neutralVariant },
    winChip: {
      backgroundColor: colors.primaryContainer,
      borderRadius: radii.pill,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      alignSelf: 'flex-start',
    },
    winChipText: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.primary },
  });

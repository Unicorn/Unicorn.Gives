import { useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { useAdminQuery } from '@/hooks/useAdminQuery';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { useRegions } from '@/hooks/useRegions';
import { AdminDataTable, type Column } from '@/components/admin/AdminDataTable';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

interface BingoGameRow {
  id: string;
  title: string;
  slug: string;
  featured: boolean;
  starts_on: string | null;
  region_id: string | null;
  partner_id: string | null;
  regions: { name: string } | null;
  partners: { name: string } | null;
  status: string;
}

const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
];

export default function BingoGamesListPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { regionOptions } = useRegions();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortKey, setSortKey] = useState('created_at');
  const [sortAsc, setSortAsc] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BingoGameRow | null>(null);

  const filters: Record<string, string> = {};
  if (regionFilter) filters.region_id = regionFilter;

  const { data, loading, error, total, pageSize, refresh } = useAdminQuery<BingoGameRow>('bingo_games', {
    select:
      'id, title, slug, featured, starts_on, region_id, partner_id, regions(name), partners(name), status',
    orderBy: sortKey,
    ascending: sortAsc,
    page,
    pageSize: 25,
    filters,
    status: statusFilter || undefined,
    search: search ? { title: search } : {},
  });

  const { remove } = useAdminMutation('bingo_games');

  const columns: Column<BingoGameRow>[] = [
    {
      key: 'title',
      label: 'Title',
      sortKey: 'title',
      render: (row) => (
        <Text style={styles.titleCell} numberOfLines={1}>
          {row.title}
        </Text>
      ),
    },
    {
      key: 'scope',
      label: 'Scope',
      width: 160,
      render: (row) => (
        <Text style={styles.metaCell} numberOfLines={1}>
          {row.partners?.name ?? row.regions?.name ?? 'Global'}
        </Text>
      ),
    },
    {
      key: 'starts_on',
      label: 'Starts',
      width: 110,
      sortKey: 'starts_on',
      render: (row) => (
        <Text style={styles.metaCell}>{row.starts_on ?? '—'}</Text>
      ),
    },
    {
      key: 'featured',
      label: 'Featured',
      width: 90,
      render: (row) =>
        row.featured ? (
          <MaterialIcons name="star" size={16} color={colors.gold} />
        ) : (
          <Text style={styles.metaCell}>{'—'}</Text>
        ),
    },
    { key: 'status', label: 'Status', width: 100, isStatus: true },
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

  async function handleDelete() {
    if (!deleteTarget) return;
    const success = await remove(deleteTarget.id);
    if (success) refresh();
    setDeleteTarget(null);
  }

  return (
    <AdminPageShell
      title="Bingo Games"
      subtitle={`${total} total games`}
      actions={
        <AdminButton
          label="New Game"
          icon="add"
          onPress={() => router.push(toHref('/admin/bingo-games/new'))}
        />
      }
    >
      <View style={styles.filtersRow}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            setPage(1);
          }}
          placeholder="Search games..."
          placeholderTextColor={colors.outlineVariant}
        />
        <View style={styles.selectWrap}>
          <select
            value={regionFilter}
            onChange={(e: any) => {
              setRegionFilter(e.target.value);
              setPage(1);
            }}
            style={selectStyle(colors)}
          >
            {regionOptions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </View>
        <View style={styles.selectWrap}>
          <select
            value={statusFilter}
            onChange={(e: any) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            style={selectStyle(colors)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
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
        onRowPress={(row) => router.push(toHref(`/admin/bingo-games/${row.id}`))}
        emptyMessage="No bingo games found"
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
        title="Delete bingo game"
        message={`Delete "${deleteTarget?.title}"? This removes its squares and issued boards too. This cannot be undone.`}
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
      minWidth: 140,
    },
    titleCell: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.neutral },
    metaCell: { fontFamily: fonts.sans, fontSize: 13, color: colors.neutralVariant },
  });

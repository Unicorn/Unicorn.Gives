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

interface ElectionRow {
  id: string;
  slug: string;
  title: string;
  election_date: string;
  type: string;
  status: string;
  region_id: string | null;
  regions: { name: string } | null;
  created_at: string;
}

const ELECTION_TYPES = [
  { label: 'All Types', value: '' },
  { label: 'General', value: 'general' },
  { label: 'Primary', value: 'primary' },
  { label: 'Special', value: 'special' },
  { label: 'Local', value: 'local' },
];

const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
];

export default function ElectionsListPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { regionOptions } = useRegions();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortKey, setSortKey] = useState('election_date');
  const [sortAsc, setSortAsc] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ElectionRow | null>(null);

  const filters: Record<string, string> = {};
  if (typeFilter) filters.type = typeFilter;
  if (regionFilter) filters.region_id = regionFilter;

  const { data, loading, error, total, pageSize, refresh } = useAdminQuery<ElectionRow>(
    'elections',
    {
      select: 'id, slug, title, election_date, type, status, region_id, regions(name), created_at',
      orderBy: sortKey,
      ascending: sortAsc,
      page,
      pageSize: 25,
      filters,
      status: statusFilter || undefined,
      search: search ? { title: search } : {},
    },
  );

  const { remove } = useAdminMutation('elections');

  const columns: Column<ElectionRow>[] = [
    {
      key: 'title',
      label: 'Title',
      sortKey: 'title',
      render: (row) => <Text style={styles.titleCell} numberOfLines={1}>{row.title}</Text>,
    },
    {
      key: 'election_date',
      label: 'Election Date',
      width: 120,
      sortKey: 'election_date',
      render: (row) => (
        <Text style={styles.dateCell}>
          {new Date(row.election_date + 'T00:00:00').toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          })}
        </Text>
      ),
    },
    { key: 'type', label: 'Type', width: 100 },
    {
      key: 'region_id',
      label: 'Municipality',
      width: 150,
      render: (row) => (
        <Text style={styles.dateCell} numberOfLines={1}>
          {row.regions?.name ?? '—'}
        </Text>
      ),
    },
    { key: 'status', label: 'Status', width: 100, isStatus: true },
    {
      key: 'actions',
      label: '',
      width: 40,
      render: (row) => (
        <Pressable onPress={(e) => { e.stopPropagation(); setDeleteTarget(row); }}>
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
      title="Elections"
      subtitle={`${total} total elections`}
      actions={
        <AdminButton label="New Election" icon="add" onPress={() => router.push(toHref('/admin/elections/new'))} />
      }
    >
      <View style={styles.filtersRow}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={(text) => { setSearch(text); setPage(1); }}
          placeholder="Search elections..."
          placeholderTextColor={colors.outlineVariant}
        />
        <View style={styles.selectWrap}>
          <select value={typeFilter} onChange={(e: any) => { setTypeFilter(e.target.value); setPage(1); }} style={selectStyle(colors)}>
            {ELECTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </View>
        <View style={styles.selectWrap}>
          <select value={regionFilter} onChange={(e: any) => { setRegionFilter(e.target.value); setPage(1); }} style={selectStyle(colors)}>
            {regionOptions.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </View>
        <View style={styles.selectWrap}>
          <select value={statusFilter} onChange={(e: any) => { setStatusFilter(e.target.value); setPage(1); }} style={selectStyle(colors)}>
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
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
        onRowPress={(row) => router.push(toHref(`/admin/elections/${row.id}`))}
        emptyMessage="No elections found"
        sortKey={sortKey}
        sortDirection={sortAsc ? 'asc' : 'desc'}
        onSort={(key, dir) => { setSortKey(key); setSortAsc(dir === 'asc'); setPage(1); }}
      />

      <AdminConfirmDialog
        visible={!!deleteTarget}
        title="Delete Election"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
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
    padding: '8px 12px', fontSize: 13, fontFamily: 'inherit', border: 'none',
    backgroundColor: 'transparent', color: colors.neutral, outline: 'none',
    cursor: 'pointer', width: '100%',
  };
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    filtersRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg, flexWrap: 'wrap' },
    searchInput: {
      flex: 1, minWidth: 200, backgroundColor: colors.surface, borderWidth: 1,
      borderColor: colors.outline, borderRadius: radii.sm, paddingHorizontal: spacing.md,
      paddingVertical: 8, fontFamily: fonts.sans, fontSize: 13, color: colors.neutral,
    },
    selectWrap: {
      backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.outline,
      borderRadius: radii.sm, overflow: 'hidden', minWidth: 140,
    },
    titleCell: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.neutral },
    dateCell: { fontFamily: fonts.sans, fontSize: 13, color: colors.neutralVariant },
  });

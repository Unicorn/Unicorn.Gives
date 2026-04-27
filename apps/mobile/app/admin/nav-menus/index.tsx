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

interface NavMenuRow {
  id: string;
  name: string;
  slug: string;
  location: string;
  is_active: boolean;
  region_id: string | null;
  regions: { name: string } | null;
}

const LOCATION_OPTIONS = [
  { label: 'All Locations', value: '' },
  { label: 'Header', value: 'header' },
  { label: 'Footer', value: 'footer' },
  { label: 'Sidebar', value: 'sidebar' },
  { label: 'Utility Bar', value: 'utility_bar' },
  { label: 'Mobile', value: 'mobile' },
];

export default function NavMenusListPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { regionOptions } = useRegions();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<NavMenuRow | null>(null);

  const filters: Record<string, string> = {};
  if (locationFilter) filters.location = locationFilter;
  if (regionFilter) filters.region_id = regionFilter;

  const { data, loading, error, total, pageSize, refresh } = useAdminQuery<NavMenuRow>(
    'nav_menus',
    {
      select: 'id, name, slug, location, is_active, region_id, regions(name)',
      orderBy: sortKey,
      ascending: sortAsc,
      page,
      pageSize: 50,
      filters,
      search: search ? { name: search } : {},
    },
  );

  const { remove } = useAdminMutation('nav_menus');

  const columns: Column<NavMenuRow>[] = [
    {
      key: 'name', label: 'Name', sortKey: 'name',
      render: (row) => <Text style={styles.titleCell} numberOfLines={1}>{row.name}</Text>,
    },
    {
      key: 'slug', label: 'Slug', width: 140,
      render: (row) => <Text style={styles.slugCell}>{row.slug}</Text>,
    },
    { key: 'location', label: 'Location', width: 120 },
    {
      key: 'region_id', label: 'Municipality', width: 150,
      render: (row) => <Text style={styles.metaCell} numberOfLines={1}>{row.regions?.name ?? '—'}</Text>,
    },
    {
      key: 'is_active', label: 'Active', width: 80,
      render: (row) => <Text style={styles.metaCell}>{row.is_active ? 'Yes' : 'No'}</Text>,
    },
    {
      key: 'actions', label: '', width: 40,
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
      title="Navigation Menus"
      subtitle={`${total} menus`}
      actions={<AdminButton label="New Menu" icon="add" onPress={() => router.push(toHref('/admin/nav-menus/new'))} />}
    >
      <View style={styles.filtersRow}>
        <TextInput style={styles.searchInput} value={search}
          onChangeText={(text) => { setSearch(text); setPage(1); }}
          placeholder="Search menus..." placeholderTextColor={colors.outlineVariant} />
        <View style={styles.selectWrap}>
          <select value={locationFilter} onChange={(e: any) => { setLocationFilter(e.target.value); setPage(1); }} style={selectStyle(colors)}>
            {LOCATION_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </View>
        <View style={styles.selectWrap}>
          <select value={regionFilter} onChange={(e: any) => { setRegionFilter(e.target.value); setPage(1); }} style={selectStyle(colors)}>
            {regionOptions.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </View>
      </View>

      <AdminDataTable
        columns={columns} data={data} loading={loading} error={error}
        total={total} page={page} pageSize={pageSize} onPageChange={setPage}
        onRowPress={(row) => router.push(toHref(`/admin/nav-menus/${row.id}`))}
        emptyMessage="No nav menus found"
        sortKey={sortKey} sortDirection={sortAsc ? 'asc' : 'desc'}
        onSort={(key, dir) => { setSortKey(key); setSortAsc(dir === 'asc'); setPage(1); }}
      />

      <AdminConfirmDialog
        visible={!!deleteTarget} title="Delete Nav Menu"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete" variant="danger" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)}
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
    slugCell: { fontFamily: 'monospace', fontSize: 12, color: colors.neutralVariant },
    metaCell: { fontFamily: fonts.sans, fontSize: 13, color: colors.neutralVariant },
  });

import { useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { useAdminQuery } from '@/hooks/useAdminQuery';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { useCategories } from '@/hooks/useCategories';
import { AdminDataTable, type Column } from '@/components/admin/AdminDataTable';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

interface GuideRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  jurisdiction: string | null;
  icon: string | null;
  status: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
];

export default function GuidesListPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<GuideRow | null>(null);
  const { categories: guideCategories } = useCategories('guides');
  const categoryFilterOptions = [{ label: 'All Categories', value: '' }, ...guideCategories];

  const filters: Record<string, string> = {};
  if (categoryFilter) filters.category = categoryFilter;

  const { data, loading, error, total, pageSize, refresh } = useAdminQuery<GuideRow>(
    'guides',
    {
      select: 'id, slug, title, category, jurisdiction, icon, status, created_at',
      orderBy: 'created_at',
      ascending: false,
      page,
      pageSize: 25,
      filters,
      status: statusFilter || undefined,
      search: search ? { title: search } : {},
    },
  );

  const { remove } = useAdminMutation('guides');

  const columns: Column<GuideRow>[] = [
    {
      key: 'icon',
      label: '',
      width: 40,
      render: (row) => <Text style={{ fontSize: 18 }}>{row.icon || '📄'}</Text>,
    },
    {
      key: 'title',
      label: 'Title',
      render: (row) => <Text style={styles.titleCell} numberOfLines={1}>{row.title}</Text>,
    },
    { key: 'category', label: 'Category', width: 140 },
    {
      key: 'jurisdiction',
      label: 'Jurisdiction',
      width: 100,
      render: (row) => (
        <Text style={styles.metaCell}>{row.jurisdiction || '—'}</Text>
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
    await remove(deleteTarget.id);
    refresh();
    setDeleteTarget(null);
  }

  return (
    <AdminPageShell
      title="Guides"
      subtitle={`${total} total guides`}
      actions={
        <AdminButton
          label="New Guide"
          icon="add"
          onPress={() => router.push(toHref('/admin/guides/new'))}
        />
      }
    >
      <View style={styles.filtersRow}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={(text) => { setSearch(text); setPage(1); }}
          placeholder="Search guides..."
          placeholderTextColor={colors.outlineVariant}
        />
        <View style={styles.selectWrap}>
          <select value={categoryFilter} onChange={(e: any) => { setCategoryFilter(e.target.value); setPage(1); }}
            style={selectStyle(colors)}>
            {categoryFilterOptions.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </View>
        <View style={styles.selectWrap}>
          <select value={statusFilter} onChange={(e: any) => { setStatusFilter(e.target.value); setPage(1); }}
            style={selectStyle(colors)}>
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
        onRowPress={(row) => router.push(toHref(`/admin/guides/${row.id}`))}
        emptyMessage="No guides found"
      />

      <AdminConfirmDialog
        visible={!!deleteTarget}
        title="Delete Guide"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This will also remove its contacts and forms.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminPageShell>
  );
}

function selectStyle(colors: ThemeColors) {
  return { padding: '8px 12px', fontSize: 13, fontFamily: 'inherit', border: 'none', backgroundColor: 'transparent', color: colors.neutral, outline: 'none', cursor: 'pointer', width: '100%' };
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    filtersRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg, flexWrap: 'wrap' },
    searchInput: { flex: 1, minWidth: 200, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.outline, borderRadius: radii.sm, paddingHorizontal: spacing.md, paddingVertical: 8, fontFamily: fonts.sans, fontSize: 13, color: colors.neutral },
    selectWrap: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.outline, borderRadius: radii.sm, overflow: 'hidden', minWidth: 140 },
    titleCell: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.neutral },
    metaCell: { fontFamily: fonts.sans, fontSize: 13, color: colors.neutralVariant, textTransform: 'capitalize' },
  });

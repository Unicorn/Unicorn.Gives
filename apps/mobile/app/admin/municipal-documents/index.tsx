import { useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { useAdminQuery } from '@/hooks/useAdminQuery';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminDataTable, type Column } from '@/components/admin/AdminDataTable';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

interface DocRow {
  id: string;
  slug: string;
  title: string;
  kind: string;
  adopted_date: string;
  status: string;
  display_order: number;
}

const KIND_OPTIONS = [
  { label: 'All Kinds', value: '' },
  { label: 'Master Plan', value: 'master_plan' },
  { label: 'Zoning Ordinance', value: 'zoning_ordinance' },
  { label: 'Recreation Plan', value: 'recreation_plan' },
  { label: 'Other', value: 'other' },
];

const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
];

export default function MunicipalDocumentsListPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [kindFilter, setKindFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<DocRow | null>(null);

  const filters: Record<string, string> = {};
  if (kindFilter) filters.kind = kindFilter;

  const { data, loading, error, total, pageSize, refresh } = useAdminQuery<DocRow>(
    'municipal_documents',
    {
      select: 'id, slug, title, kind, adopted_date, status, display_order',
      orderBy: 'display_order',
      ascending: true,
      page,
      pageSize: 25,
      filters,
      status: statusFilter || undefined,
      search: search ? { title: search } : {},
    },
  );

  const { remove } = useAdminMutation('municipal_documents');

  const columns: Column<DocRow>[] = [
    { key: 'title', label: 'Title', render: (row) => <Text style={styles.titleCell} numberOfLines={1}>{row.title}</Text> },
    { key: 'kind', label: 'Kind', width: 140, render: (row) => <Text style={styles.metaCell}>{row.kind.replace(/_/g, ' ')}</Text> },
    { key: 'adopted_date', label: 'Adopted', width: 120 },
    { key: 'display_order', label: 'Order', width: 60 },
    { key: 'status', label: 'Status', width: 100, isStatus: true },
    { key: 'actions', label: '', width: 40, render: (row) => (
      <Pressable onPress={(e) => { e.stopPropagation(); setDeleteTarget(row); }}>
        <MaterialIcons name="delete-outline" size={18} color={colors.error} />
      </Pressable>
    )},
  ];

  async function handleDelete() {
    if (!deleteTarget) return;
    await remove(deleteTarget.id);
    refresh();
    setDeleteTarget(null);
  }

  return (
    <AdminPageShell title="Documents" subtitle={`${total} total documents`}
      actions={<AdminButton label="New Document" icon="add" onPress={() => router.push(toHref('/admin/municipal-documents/new'))} />}>
      <View style={styles.filtersRow}>
        <TextInput style={styles.searchInput} value={search} onChangeText={(t) => { setSearch(t); setPage(1); }} placeholder="Search documents..." placeholderTextColor={colors.outlineVariant} />
        <View style={styles.selectWrap}>
          <select value={kindFilter} onChange={(e: any) => { setKindFilter(e.target.value); setPage(1); }} style={selectStyle(colors)}>
            {KIND_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </View>
        <View style={styles.selectWrap}>
          <select value={statusFilter} onChange={(e: any) => { setStatusFilter(e.target.value); setPage(1); }} style={selectStyle(colors)}>
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </View>
      </View>
      <AdminDataTable columns={columns} data={data} loading={loading} error={error} total={total} page={page} pageSize={pageSize} onPageChange={setPage}
        onRowPress={(row) => router.push(toHref(`/admin/municipal-documents/${row.id}`))} emptyMessage="No municipal documents found" />
      <AdminConfirmDialog visible={!!deleteTarget} title="Delete Document"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`} confirmLabel="Delete" variant="danger"
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </AdminPageShell>
  );
}

function selectStyle(colors: ThemeColors) {
  return { padding: '8px 12px', fontSize: 13, fontFamily: 'inherit', border: 'none', backgroundColor: 'transparent', color: colors.neutral, outline: 'none', cursor: 'pointer', width: '100%' };
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  filtersRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg, flexWrap: 'wrap' },
  searchInput: { flex: 1, minWidth: 200, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.outline, borderRadius: radii.sm, paddingHorizontal: spacing.md, paddingVertical: 8, fontFamily: fonts.sans, fontSize: 13, color: colors.neutral },
  selectWrap: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.outline, borderRadius: radii.sm, overflow: 'hidden', minWidth: 140 },
  titleCell: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.neutral },
  metaCell: { fontFamily: fonts.sans, fontSize: 13, color: colors.neutralVariant, textTransform: 'capitalize' },
});

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

interface MeetingRow {
  id: string;
  title: string;
  meeting_type: string;
  meeting_date: string;
  start_time: string | null;
  location: string | null;
  is_cancelled: boolean;
  status: string;
}

const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
];

export default function MeetingsListPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<MeetingRow | null>(null);

  const { data, loading, error, total, pageSize, refresh } = useAdminQuery<MeetingRow>(
    'meetings',
    {
      select: 'id, title, meeting_type, meeting_date, start_time, location, is_cancelled, status',
      orderBy: 'meeting_date',
      ascending: false,
      page,
      pageSize: 25,
      status: statusFilter || undefined,
      search: search ? { title: search } : {},
    },
  );

  const { remove } = useAdminMutation('meetings');

  const columns: Column<MeetingRow>[] = [
    { key: 'title', label: 'Meeting', render: (row) => <Text style={styles.nameCell} numberOfLines={1}>{row.title}</Text> },
    { key: 'meeting_date', label: 'Date', width: 110 },
    { key: 'start_time', label: 'Time', width: 90 },
    { key: 'meeting_type', label: 'Type', width: 120 },
    { key: 'location', label: 'Location', width: 180 },
    {
      key: 'is_cancelled', label: 'Cancelled', width: 90,
      render: (row) => <Text style={{ color: row.is_cancelled ? colors.error : colors.neutralVariant, fontSize: 13 }}>{row.is_cancelled ? 'Yes' : 'No'}</Text>,
    },
    { key: 'status', label: 'Status', width: 100, isStatus: true },
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
      title="Meetings & Agendas"
      subtitle={`${total} total meetings`}
      actions={<AdminButton label="New Meeting" icon="add" onPress={() => router.push(toHref('/admin/meetings/new'))} />}
    >
      <View style={styles.filtersRow}>
        <TextInput style={styles.searchInput} value={search} onChangeText={(t) => { setSearch(t); setPage(1); }} placeholder="Search meetings..." placeholderTextColor={colors.outlineVariant} />
        <View style={styles.selectWrap}>
          <select value={statusFilter} onChange={(e: any) => { setStatusFilter(e.target.value); setPage(1); }} style={selectStyle(colors)}>
            {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </View>
      </View>

      <AdminDataTable columns={columns} data={data} loading={loading} error={error} total={total} page={page} pageSize={pageSize} onPageChange={setPage} onRowPress={(row) => router.push(toHref(`/admin/meetings/${row.id}`))} emptyMessage="No meetings found" />

      <AdminConfirmDialog visible={!!deleteTarget} title="Delete Meeting" message={`Are you sure you want to delete "${deleteTarget?.title}"?`} confirmLabel="Delete" variant="danger" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
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
    nameCell: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.neutral },
  });

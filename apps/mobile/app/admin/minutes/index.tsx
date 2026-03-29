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

interface MinutesRow {
  id: string;
  slug: string;
  title: string;
  date: string;
  meeting_type: string;
  status: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
];

export default function MinutesListPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<MinutesRow | null>(null);

  const { data, loading, error, total, pageSize, refresh } = useAdminQuery<MinutesRow>(
    'minutes',
    {
      select: 'id, slug, title, date, meeting_type, status, created_at',
      orderBy: 'date',
      ascending: false,
      page,
      pageSize: 25,
      status: statusFilter || undefined,
      search: search ? { title: search } : {},
    },
  );

  const { remove } = useAdminMutation('minutes');

  const columns: Column<MinutesRow>[] = [
    {
      key: 'title',
      label: 'Title',
      render: (row) => (
        <Text style={styles.titleCell} numberOfLines={1}>{row.title}</Text>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      width: 110,
      render: (row) => (
        <Text style={styles.dateCell}>
          {new Date(row.date + 'T00:00:00').toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </Text>
      ),
    },
    { key: 'meeting_type', label: 'Type', width: 130 },
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
    if (success) {
      refresh();
    }
    setDeleteTarget(null);
  }

  return (
    <AdminPageShell
      title="Minutes"
      subtitle={`${total} total minutes`}
      actions={
        <AdminButton
          label="New Minutes"
          icon="add"
          onPress={() => router.push(toHref('/admin/minutes/new'))}
        />
      }
    >
      {/* Filters row */}
      <View style={styles.filtersRow}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={(text) => { setSearch(text); setPage(1); }}
          placeholder="Search minutes..."
          placeholderTextColor={colors.outlineVariant}
        />
        <View style={styles.selectWrap}>
          <select
            value={statusFilter}
            onChange={(e: any) => { setStatusFilter(e.target.value); setPage(1); }}
            style={selectStyle(colors)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </View>
      </View>

      {/* Data table */}
      <AdminDataTable
        columns={columns}
        data={data}
        loading={loading}
        error={error}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onRowPress={(row) => router.push(toHref(`/admin/minutes/${row.id}`))}
        emptyMessage="No minutes found"
      />

      {/* Delete confirmation */}
      <AdminConfirmDialog
        visible={!!deleteTarget}
        title="Delete Minutes"
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
    padding: '8px 12px',
    fontSize: 13,
    fontFamily: 'inherit',
    border: 'none',
    backgroundColor: 'transparent',
    color: colors.neutral,
    outline: 'none',
    cursor: 'pointer',
    width: '100%',
  };
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    filtersRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.lg,
      flexWrap: 'wrap',
    },
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
    titleCell: {
      fontFamily: fonts.sansMedium,
      fontSize: 13,
      color: colors.neutral,
    },
    dateCell: {
      fontFamily: fonts.sans,
      fontSize: 13,
      color: colors.neutralVariant,
    },
  });

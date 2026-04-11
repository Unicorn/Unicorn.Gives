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

interface AudienceRow {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export default function AudiencesListPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AudienceRow | null>(null);

  const { data, loading, error, total, pageSize, refresh } = useAdminQuery<AudienceRow>(
    'audiences',
    {
      select: 'id, slug, label, description, display_order, is_active, created_at',
      orderBy: 'display_order',
      ascending: true,
      page,
      pageSize: 50,
      search: search ? { label: search } : {},
    },
  );

  const { remove } = useAdminMutation('audiences');

  const columns: Column<AudienceRow>[] = [
    {
      key: 'label',
      label: 'Label',
      render: (row) => (
        <Text style={styles.titleCell} numberOfLines={1}>{row.label}</Text>
      ),
    },
    { key: 'slug', label: 'Slug', width: 140 },
    {
      key: 'display_order',
      label: 'Order',
      width: 70,
    },
    {
      key: 'is_active',
      label: 'Active',
      width: 70,
      render: (row) => (
        <MaterialIcons
          name={row.is_active ? 'check-circle' : 'cancel'}
          size={18}
          color={row.is_active ? colors.primary : colors.outlineVariant}
        />
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

  async function handleDelete() {
    if (!deleteTarget) return;
    const success = await remove(deleteTarget.id);
    if (success) refresh();
    setDeleteTarget(null);
  }

  return (
    <AdminPageShell
      title="Audiences"
      subtitle={`${total} audiences`}
      actions={
        <AdminButton
          label="New Audience"
          icon="add"
          onPress={() => router.push(toHref('/admin/audiences/new'))}
        />
      }
    >
      {/* Search */}
      <View style={styles.filtersRow}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={(text) => { setSearch(text); setPage(1); }}
          placeholder="Search audiences..."
          placeholderTextColor={colors.outlineVariant}
        />
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
        onRowPress={(row) => router.push(toHref(`/admin/audiences/${row.id}`))}
        emptyMessage="No audiences found"
      />

      {/* Delete confirmation */}
      <AdminConfirmDialog
        visible={!!deleteTarget}
        title="Delete Audience"
        message={`Are you sure you want to delete "${deleteTarget?.label}"? Content linked to this audience will lose the association.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminPageShell>
  );
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
    titleCell: {
      fontFamily: fonts.sansMedium,
      fontSize: 13,
      color: colors.neutral,
    },
  });

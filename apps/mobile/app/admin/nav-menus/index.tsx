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

interface NavMenuRow {
  id: string;
  name: string;
  slug: string;
  location: string;
  is_active: boolean;
}

export default function NavMenusListPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<NavMenuRow | null>(null);

  const { data, loading, error, total, pageSize, refresh } = useAdminQuery<NavMenuRow>(
    'nav_menus',
    {
      select: 'id, name, slug, location, is_active',
      orderBy: 'name',
      ascending: true,
      page,
      pageSize: 50,
      search: search ? { name: search } : {},
    },
  );

  const { remove } = useAdminMutation('nav_menus');

  const columns: Column<NavMenuRow>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (row) => (
        <Text style={styles.nameCell} numberOfLines={1}>{row.name}</Text>
      ),
    },
    { key: 'slug', label: 'Slug', width: 140 },
    { key: 'location', label: 'Location', width: 120 },
    {
      key: 'is_active',
      label: 'Active',
      width: 80,
      render: (row) => (
        <Text style={styles.boolCell}>{row.is_active ? 'Yes' : 'No'}</Text>
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
      title="Nav Menus"
      subtitle={`${total} menus`}
      actions={
        <AdminButton
          label="New Menu"
          icon="add"
          onPress={() => router.push(toHref('/admin/nav-menus/new'))}
        />
      }
    >
      <View style={styles.filtersRow}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={(text) => { setSearch(text); setPage(1); }}
          placeholder="Search menus..."
          placeholderTextColor={colors.outlineVariant}
        />
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
        onRowPress={(row) => router.push(toHref(`/admin/nav-menus/${row.id}`))}
        emptyMessage="No nav menus found"
      />

      <AdminConfirmDialog
        visible={!!deleteTarget}
        title="Delete Nav Menu"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
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
    nameCell: {
      fontFamily: fonts.sansMedium,
      fontSize: 13,
      color: colors.neutral,
    },
    boolCell: {
      fontFamily: fonts.sans,
      fontSize: 13,
      color: colors.neutralVariant,
    },
  });

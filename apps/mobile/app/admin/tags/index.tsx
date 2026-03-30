import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { supabase } from '@/lib/supabase';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminDataTable, type Column } from '@/components/admin/AdminDataTable';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

interface TagRow {
  id: string;
  slug: string;
  label: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export default function TagsListPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<TagRow | null>(null);
  const [usageCounts, setUsageCounts] = useState<Record<string, number>>({});

  // Fetch tag usage counts from events
  const fetchUsageCounts = useCallback(async () => {
    const { data: rows } = await supabase
      .from('events')
      .select('tags');

    if (!rows) return;
    const counts: Record<string, number> = {};
    for (const row of rows) {
      const tags = (row as { tags: string[] | null }).tags;
      if (tags) {
        for (const tag of tags) {
          counts[tag] = (counts[tag] || 0) + 1;
        }
      }
    }
    setUsageCounts(counts);
  }, []);

  useEffect(() => {
    fetchUsageCounts();
  }, [fetchUsageCounts]);

  const { data, loading, error, total, pageSize, refresh } = useAdminQuery<TagRow>(
    'tags',
    {
      select: 'id, slug, label, description, is_active, created_at',
      orderBy: 'label',
      ascending: true,
      page,
      pageSize: 50,
      search: search ? { label: search } : {},
    },
  );

  const { remove } = useAdminMutation('tags');

  const columns: Column<TagRow>[] = [
    {
      key: 'label',
      label: 'Label',
      render: (row) => (
        <Text style={styles.titleCell} numberOfLines={1}>{row.label}</Text>
      ),
    },
    { key: 'slug', label: 'Slug', width: 160 },
    {
      key: 'usage' as any,
      label: 'Used',
      width: 70,
      render: (row) => (
        <Text style={styles.usageCell}>{usageCounts[row.slug] ?? 0}</Text>
      ),
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
    if (success) {
      refresh();
      fetchUsageCounts();
    }
    setDeleteTarget(null);
  }

  return (
    <AdminPageShell
      title="Tags"
      subtitle={`${total} total tags`}
      actions={
        <AdminButton
          label="New Tag"
          icon="add"
          onPress={() => router.push(toHref('/admin/tags/new'))}
        />
      }
    >
      {/* Search */}
      <View style={styles.filtersRow}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={(text) => { setSearch(text); setPage(1); }}
          placeholder="Search tags..."
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
        onRowPress={(row) => router.push(toHref(`/admin/tags/${row.id}`))}
        emptyMessage="No tags found"
      />

      {/* Delete confirmation */}
      <AdminConfirmDialog
        visible={!!deleteTarget}
        title="Delete Tag"
        message={`Are you sure you want to delete "${deleteTarget?.label}"? Events using this tag will keep it, but it won't appear in suggestions.`}
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
    usageCell: {
      fontFamily: fonts.sans,
      fontSize: 13,
      color: colors.neutralVariant,
      textAlign: 'center',
    },
  });

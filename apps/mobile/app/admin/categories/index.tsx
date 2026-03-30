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

interface CategoryRow {
  id: string;
  content_type: string;
  slug: string;
  label: string;
  description: string | null;
  color: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

const CONTENT_TYPES = [
  { label: 'Events', value: 'events' },
  { label: 'News', value: 'news' },
  { label: 'Guides', value: 'guides' },
  { label: 'Ordinances', value: 'ordinances' },
];

/** Map content_type to the table that uses it */
const CONTENT_TABLE: Record<string, string> = {
  events: 'events',
  news: 'news',
  guides: 'guides',
  ordinances: 'ordinances',
};

export default function CategoriesListPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('events');
  const [deleteTarget, setDeleteTarget] = useState<CategoryRow | null>(null);
  const [usageCounts, setUsageCounts] = useState<Record<string, number>>({});

  const { data, loading, error, total, pageSize, refresh } = useAdminQuery<CategoryRow>(
    'categories',
    {
      select: 'id, content_type, slug, label, description, color, display_order, is_active, created_at',
      orderBy: 'display_order',
      ascending: true,
      page,
      pageSize: 50,
      filters: { content_type: typeFilter },
      search: search ? { label: search } : {},
    },
  );

  // Fetch usage counts for the active content type
  const fetchUsageCounts = useCallback(async () => {
    const table = CONTENT_TABLE[typeFilter];
    if (!table) return;

    const { data: rows } = await supabase
      .from(table)
      .select('category');

    if (!rows) return;
    const counts: Record<string, number> = {};
    for (const row of rows) {
      const cat = (row as { category: string }).category;
      counts[cat] = (counts[cat] || 0) + 1;
    }
    setUsageCounts(counts);
  }, [typeFilter]);

  useEffect(() => {
    fetchUsageCounts();
  }, [fetchUsageCounts]);

  const { remove } = useAdminMutation('categories');

  const columns: Column<CategoryRow>[] = [
    {
      key: 'label',
      label: 'Label',
      render: (row) => (
        <View style={styles.labelCell}>
          {row.color && <View style={[styles.colorDot, { backgroundColor: row.color }]} />}
          <Text style={styles.titleCell} numberOfLines={1}>{row.label}</Text>
        </View>
      ),
    },
    { key: 'slug', label: 'Slug', width: 140 },
    {
      key: 'display_order',
      label: 'Order',
      width: 70,
    },
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
      title="Categories"
      subtitle={`${total} categories in ${typeFilter}`}
      actions={
        <AdminButton
          label="New Category"
          icon="add"
          onPress={() => router.push(toHref('/admin/categories/new'))}
        />
      }
    >
      {/* Content type tabs */}
      <View style={styles.tabsRow}>
        {CONTENT_TYPES.map((ct) => {
          const active = typeFilter === ct.value;
          return (
            <Pressable
              key={ct.value}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => { setTypeFilter(ct.value); setPage(1); }}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {ct.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Search */}
      <View style={styles.filtersRow}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={(text) => { setSearch(text); setPage(1); }}
          placeholder={`Search ${typeFilter} categories...`}
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
        onRowPress={(row) => router.push(toHref(`/admin/categories/${row.id}`))}
        emptyMessage="No categories found"
      />

      {/* Delete confirmation */}
      <AdminConfirmDialog
        visible={!!deleteTarget}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.label}"? Content using this category will keep its current value but it won't appear in dropdowns.`}
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
    tabsRow: {
      flexDirection: 'row',
      gap: 0,
      marginBottom: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    tab: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm + 2,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    tabActive: {
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontFamily: fonts.sans,
      fontSize: 13,
      color: colors.neutralVariant,
    },
    tabTextActive: {
      fontFamily: fonts.sansMedium,
      color: colors.primary,
    },
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
    labelCell: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    colorDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
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

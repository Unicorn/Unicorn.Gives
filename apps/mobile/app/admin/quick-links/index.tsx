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

interface QuickLinkRow {
  id: string;
  slug: string;
  title: string;
  url: string;
  link_group: string;
  display_order: number;
  status: string;
  is_external: boolean;
  created_at: string;
}

const LINK_GROUPS = [
  { label: 'All', value: '' },
  { label: 'Homepage Tiles', value: 'homepage_tiles' },
  { label: 'I Want To...', value: 'i_want_to' },
  { label: 'Footer', value: 'footer' },
  { label: 'Utility Bar', value: 'utility_bar' },
];

export default function QuickLinksListPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<QuickLinkRow | null>(null);

  const { data, loading, error, total, pageSize, refresh } = useAdminQuery<QuickLinkRow>(
    'quick_links',
    {
      select: 'id, slug, title, url, link_group, display_order, status, is_external, created_at',
      orderBy: 'display_order',
      ascending: true,
      page,
      pageSize: 50,
      filters: groupFilter ? { link_group: groupFilter } : {},
      search: search ? { title: search } : {},
    },
  );

  const { remove } = useAdminMutation('quick_links');

  const columns: Column<QuickLinkRow>[] = [
    {
      key: 'title',
      label: 'Title',
      render: (row) => (
        <View style={styles.titleRow}>
          <Text style={styles.titleCell} numberOfLines={1}>{row.title}</Text>
          {row.is_external && (
            <MaterialIcons name="open-in-new" size={14} color={colors.outlineVariant} />
          )}
        </View>
      ),
    },
    { key: 'link_group', label: 'Group', width: 130 },
    { key: 'display_order', label: 'Order', width: 70 },
    {
      key: 'status',
      label: 'Status',
      width: 90,
      render: (row) => (
        <Text style={[styles.statusChip,
          row.status === 'published' && { color: colors.primary },
          row.status === 'archived' && { color: colors.outlineVariant },
        ]}>
          {row.status}
        </Text>
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
      title="Quick Links"
      subtitle={`${total} links`}
      actions={
        <AdminButton
          label="New Quick Link"
          icon="add"
          onPress={() => router.push(toHref('/admin/quick-links/new'))}
        />
      }
    >
      {/* Group tabs */}
      <View style={styles.tabsRow}>
        {LINK_GROUPS.map((g) => {
          const active = groupFilter === g.value;
          return (
            <Pressable
              key={g.value}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => { setGroupFilter(g.value); setPage(1); }}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {g.label}
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
          placeholder="Search quick links..."
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
        onRowPress={(row) => router.push(toHref(`/admin/quick-links/${row.id}`))}
        emptyMessage="No quick links found"
      />

      {/* Delete confirmation */}
      <AdminConfirmDialog
        visible={!!deleteTarget}
        title="Delete Quick Link"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
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
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    titleCell: {
      fontFamily: fonts.sansMedium,
      fontSize: 13,
      color: colors.neutral,
    },
    statusChip: {
      fontFamily: fonts.sans,
      fontSize: 12,
      color: colors.neutral,
      textTransform: 'capitalize',
    },
  });

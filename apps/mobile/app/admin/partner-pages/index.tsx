import { useEffect, useMemo, useState } from 'react';
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

interface PartnerPageRow {
  id: string;
  title: string;
  slug: string;
  tab_slug: string | null;
  display_order: number;
  status: string;
  partner_id: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
];

export default function PartnerPagesListPage() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<PartnerPageRow | null>(null);

  // Partner lookup for display
  const [partnerMap, setPartnerMap] = useState<Record<string, string>>({});
  useEffect(() => {
    supabase
      .from('partners')
      .select('id, name')
      .then(({ data }) => {
        if (data) {
          const map: Record<string, string> = {};
          data.forEach((p) => { map[p.id] = p.name; });
          setPartnerMap(map);
        }
      });
  }, []);

  const { data, loading, error, total, pageSize, refresh } = useAdminQuery<PartnerPageRow>(
    'partner_pages',
    {
      select: 'id, title, slug, tab_slug, display_order, status, partner_id, created_at',
      orderBy: 'display_order',
      ascending: true,
      page,
      pageSize: 25,
      status: statusFilter || undefined,
      search: search ? { title: search } : {},
    },
  );

  const { remove } = useAdminMutation('partner_pages');

  const columns: Column<PartnerPageRow>[] = [
    {
      key: 'title',
      label: 'Title',
      render: (row) => (
        <Text style={styles.titleCell} numberOfLines={1}>{row.title}</Text>
      ),
    },
    {
      key: 'tab_slug',
      label: 'Tab',
      width: 120,
      render: (row) => (
        <Text style={styles.dateCell} numberOfLines={1}>
          {row.tab_slug || '-'}
        </Text>
      ),
    },
    {
      key: 'partner_id',
      label: 'Partner',
      width: 140,
      render: (row) => (
        <Text style={styles.dateCell} numberOfLines={1}>
          {partnerMap[row.partner_id] ?? 'Unknown'}
        </Text>
      ),
    },
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
      title="Partner Pages"
      subtitle={`${total} total pages`}
      actions={
        <AdminButton
          label="New Partner Page"
          icon="add"
          onPress={() => router.push(toHref('/admin/partner-pages/new'))}
        />
      }
    >
      {/* Filters row */}
      <View style={styles.filtersRow}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={(text) => { setSearch(text); setPage(1); }}
          placeholder="Search partner pages..."
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
        onRowPress={(row) => router.push(toHref(`/admin/partner-pages/${row.id}`))}
        emptyMessage="No partner pages found"
      />

      {/* Delete confirmation */}
      <AdminConfirmDialog
        visible={!!deleteTarget}
        title="Delete Partner Page"
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

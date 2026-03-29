import { useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import { useAdminQuery } from '@/hooks/useAdminQuery';
import { AdminDataTable, type Column } from '@/components/admin/AdminDataTable';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';

interface AuditRow {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  created_at: string;
  user_id: string | null;
  actor_display_name: string | null;
  actor_email: string | null;
  changes: Record<string, unknown> | null;
}

const RESOURCE_TYPES = [
  { label: 'All Types', value: '' },
  { label: 'Events', value: 'events' },
  { label: 'News', value: 'news' },
  { label: 'Guides', value: 'guides' },
  { label: 'Pages', value: 'pages' },
  { label: 'Minutes', value: 'minutes' },
  { label: 'Ordinances', value: 'ordinances' },
  { label: 'Contacts', value: 'contacts' },
  { label: 'Elections', value: 'elections' },
  { label: 'Municipal Docs', value: 'municipal_documents' },
  { label: 'Region Pages', value: 'region_pages' },
  { label: 'Partner Pages', value: 'partner_pages' },
];

export default function AuditLogAdminPage() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filters: Record<string, string> = {};
  if (typeFilter) filters.resource_type = typeFilter;

  const { data, loading, error, total, pageSize } = useAdminQuery<AuditRow>(
    'audit_log',
    {
      select: 'id, action, resource_type, resource_id, created_at, user_id, actor_display_name, actor_email, changes',
      orderBy: 'created_at',
      ascending: false,
      page,
      pageSize: 50,
      filters,
      search: search ? { action: search } : {},
    },
  );

  const columns: Column<AuditRow>[] = [
    {
      key: 'action',
      label: 'Action',
      width: 130,
      render: (row) => <Text style={styles.actionCell}>{row.action}</Text>,
    },
    {
      key: 'actor',
      label: 'User',
      width: 150,
      render: (row) => (
        <View>
          <Text style={styles.actorName}>{row.actor_display_name || '—'}</Text>
          {row.actor_email && <Text style={styles.actorEmail}>{row.actor_email}</Text>}
        </View>
      ),
    },
    {
      key: 'resource_type',
      label: 'Type',
      width: 130,
      render: (row) => <Text style={styles.typeCell}>{row.resource_type.replace(/_/g, ' ')}</Text>,
    },
    {
      key: 'resource_id',
      label: 'Resource ID',
      width: 200,
      render: (row) => <Text style={styles.idCell} numberOfLines={1}>{row.resource_id}</Text>,
    },
    {
      key: 'changes',
      label: 'Changes',
      render: (row) => {
        if (!row.changes) return <Text style={styles.noChanges}>—</Text>;
        const keys = Object.keys(row.changes);
        if (keys.length === 0) return <Text style={styles.noChanges}>—</Text>;
        return <Text style={styles.changesCell} numberOfLines={2}>{keys.join(', ')}</Text>;
      },
    },
    {
      key: 'created_at',
      label: 'When',
      width: 140,
      render: (row) => (
        <Text style={styles.dateCell}>
          {new Date(row.created_at).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
          })}
        </Text>
      ),
    },
  ];

  return (
    <AdminPageShell title="Audit Log" subtitle={`${total} entries`}>
      <Text style={styles.hint}>Read-only log of all admin actions. Filter by action type or resource.</Text>

      <View style={styles.filtersRow}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={(t) => { setSearch(t); setPage(1); }}
          placeholder="Search by action..."
          placeholderTextColor={colors.outlineVariant}
        />
        <View style={styles.selectWrap}>
          <select value={typeFilter} onChange={(e: any) => { setTypeFilter(e.target.value); setPage(1); }}
            style={selectStyle(colors)}>
            {RESOURCE_TYPES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
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
        emptyMessage="No audit log entries"
      />
    </AdminPageShell>
  );
}

function selectStyle(colors: ThemeColors) {
  return { padding: '8px 12px', fontSize: 13, fontFamily: 'inherit', border: 'none', backgroundColor: 'transparent', color: colors.neutral, outline: 'none', cursor: 'pointer', width: '100%' };
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  hint: { fontFamily: fonts.sans, fontSize: 13, color: colors.neutralVariant, marginBottom: spacing.lg },
  filtersRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg, flexWrap: 'wrap' },
  searchInput: { flex: 1, minWidth: 200, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.outline, borderRadius: radii.sm, paddingHorizontal: spacing.md, paddingVertical: 8, fontFamily: fonts.sans, fontSize: 13, color: colors.neutral },
  selectWrap: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.outline, borderRadius: radii.sm, overflow: 'hidden', minWidth: 140 },
  actionCell: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.neutral, textTransform: 'capitalize' },
  actorName: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.neutral },
  actorEmail: { fontFamily: fonts.sans, fontSize: 11, color: colors.neutralVariant },
  typeCell: { fontFamily: fonts.sans, fontSize: 12, color: colors.neutralVariant, textTransform: 'capitalize' },
  idCell: { fontFamily: 'monospace', fontSize: 11, color: colors.neutralVariant },
  changesCell: { fontFamily: fonts.sans, fontSize: 12, color: colors.neutralVariant },
  noChanges: { fontFamily: fonts.sans, fontSize: 12, color: colors.outlineVariant },
  dateCell: { fontFamily: fonts.sans, fontSize: 12, color: colors.neutralVariant },
});

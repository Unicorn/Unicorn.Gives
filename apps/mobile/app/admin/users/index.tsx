import { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { supabase } from '@/lib/supabase';
import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';

interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  region_ids: string[] | null;
  partner_id: string | null;
}

const ROLES = [
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Municipal Editor', value: 'municipal_editor' },
  { label: 'Partner Editor', value: 'partner_editor' },
  { label: 'Community Contributor', value: 'community_contributor' },
  { label: 'Public', value: 'public' },
];

export default function UsersAdminPage() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadProfiles() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setProfiles(data);
    setLoading(false);
  }

  useEffect(() => { loadProfiles(); }, []);

  async function saveRole(id: string) {
    setSaving(true);
    await supabase.from('profiles').update({ role: editRole }).eq('id', id);
    setSaving(false);
    setEditingId(null);
    loadProfiles();
    if (Platform.OS === 'web') window.alert('Role updated.');
  }

  const filtered = profiles.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (p.email?.toLowerCase().includes(s)) || (p.display_name?.toLowerCase().includes(s));
  });

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>;
  }

  return (
    <AdminPageShell title="Users" subtitle={`${profiles.length} registered users`}>
      <Text style={styles.hint}>Users register themselves. You can change their role here to grant admin access.</Text>

      <TextInput
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
        placeholder="Search by name or email..."
        placeholderTextColor={colors.outlineVariant}
      />

      <View style={styles.table}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, { flex: 2 }]}>User</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>Role</Text>
          <Text style={[styles.headerCell, { width: 80 }]}>Status</Text>
          <Text style={[styles.headerCell, { width: 110 }]}>Joined</Text>
          <Text style={[styles.headerCell, { width: 50 }]}></Text>
        </View>

        {filtered.map((p) => (
          <View key={p.id} style={styles.row}>
            <View style={{ flex: 2 }}>
              <Text style={styles.userName}>{p.display_name || '(no name)'}</Text>
              <Text style={styles.userEmail}>{p.email}</Text>
            </View>

            <View style={{ flex: 1 }}>
              {editingId === p.id ? (
                <View style={styles.roleEditRow}>
                  <View style={styles.selectWrap}>
                    <select value={editRole} onChange={(e: any) => setEditRole(e.target.value)}
                      style={{ padding: '6px 8px', fontSize: 12, border: 'none', backgroundColor: 'transparent', color: colors.neutral, outline: 'none', width: '100%', cursor: 'pointer' }}>
                      {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </View>
                  <Pressable style={styles.miniSave} onPress={() => saveRole(p.id)} disabled={saving}>
                    <MaterialIcons name="check" size={16} color={colors.onPrimary} />
                  </Pressable>
                  <Pressable style={styles.miniCancel} onPress={() => setEditingId(null)}>
                    <MaterialIcons name="close" size={16} color={colors.neutralVariant} />
                  </Pressable>
                </View>
              ) : (
                <Text style={styles.roleText}>{p.role.replace(/_/g, ' ')}</Text>
              )}
            </View>

            <View style={{ width: 80 }}>
              <AdminStatusBadge status={p.is_active ? 'published' : 'archived'} />
            </View>

            <View style={{ width: 110 }}>
              <Text style={styles.dateText}>
                {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
            </View>

            <View style={{ width: 50, alignItems: 'center' }}>
              {editingId !== p.id && (
                <Pressable onPress={() => { setEditingId(p.id); setEditRole(p.role); }}>
                  <MaterialIcons name="edit" size={16} color={colors.neutralVariant} />
                </Pressable>
              )}
            </View>
          </View>
        ))}
      </View>
    </AdminPageShell>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hint: { fontFamily: fonts.sans, fontSize: 13, color: colors.neutralVariant, marginBottom: spacing.lg },
  searchInput: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.outline, borderRadius: radii.sm, paddingHorizontal: spacing.md, paddingVertical: 8, fontFamily: fonts.sans, fontSize: 13, color: colors.neutral, marginBottom: spacing.lg },
  table: { backgroundColor: colors.surface, borderRadius: radii.md, borderWidth: 1, borderColor: colors.outlineVariant, overflow: 'hidden' },
  headerRow: { flexDirection: 'row', backgroundColor: colors.surfaceContainer, paddingHorizontal: spacing.md, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.outlineVariant },
  headerCell: { fontFamily: fonts.sansBold, fontSize: 11, color: colors.neutralVariant, textTransform: 'uppercase', letterSpacing: 0.5, paddingHorizontal: 4 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.outlineVariant },
  userName: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.neutral },
  userEmail: { fontFamily: fonts.sans, fontSize: 12, color: colors.neutralVariant },
  roleText: { fontFamily: fonts.sans, fontSize: 13, color: colors.neutral, textTransform: 'capitalize' },
  roleEditRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  selectWrap: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.outline, borderRadius: radii.sm, overflow: 'hidden', flex: 1 },
  miniSave: { width: 26, height: 26, borderRadius: radii.sm, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  miniCancel: { width: 26, height: 26, borderRadius: radii.sm, backgroundColor: colors.surfaceContainer, alignItems: 'center', justifyContent: 'center' },
  dateText: { fontFamily: fonts.sans, fontSize: 12, color: colors.neutralVariant },
});

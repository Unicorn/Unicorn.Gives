import { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, ActivityIndicator, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { supabase } from '@/lib/supabase';
import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';
import { AdminPageShell } from '@/components/admin/AdminPageShell';

interface Partner {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  is_active: boolean;
  tabs: { label: string; slug: string; order: number }[] | null;
}

export default function PartnersAdminPage() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Partner>>({});
  const [saving, setSaving] = useState(false);

  async function loadPartners() {
    const { data } = await supabase.from('partners').select('*').order('name');
    if (data) setPartners(data);
    setLoading(false);
  }

  useEffect(() => { loadPartners(); }, []);

  function startEdit(partner: Partner) {
    setEditingId(partner.id);
    setEditForm({ name: partner.name, description: partner.description ?? '', website: partner.website ?? '', logo_url: partner.logo_url ?? '', is_active: partner.is_active });
  }

  async function saveEdit() {
    if (!editingId) return;
    setSaving(true);
    await supabase.from('partners').update({
      name: editForm.name,
      description: editForm.description || null,
      website: editForm.website || null,
      logo_url: editForm.logo_url || null,
      is_active: editForm.is_active,
    }).eq('id', editingId);
    setSaving(false);
    setEditingId(null);
    loadPartners();
  }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>;
  }

  return (
    <AdminPageShell title="Partners" subtitle={`${partners.length} partners configured`}>
      <Text style={styles.hint}>Community partners with their own content sections. Edit inline below.</Text>

      {partners.map((p) => {
        const editing = editingId === p.id;
        if (editing) {
          return (
            <View key={p.id} style={styles.card}>
              <View style={styles.editRow}>
                <View style={styles.editField}><Text style={styles.editLabel}>Name</Text>
                  <TextInput style={styles.editInput} value={editForm.name} onChangeText={(v) => setEditForm({ ...editForm, name: v })} /></View>
                <View style={styles.editField}><Text style={styles.editLabel}>Description</Text>
                  <TextInput style={styles.editInput} value={editForm.description ?? ''} onChangeText={(v) => setEditForm({ ...editForm, description: v })} multiline /></View>
              </View>
              <View style={styles.editRow}>
                <View style={styles.editField}><Text style={styles.editLabel}>Website</Text>
                  <TextInput style={styles.editInput} value={editForm.website ?? ''} onChangeText={(v) => setEditForm({ ...editForm, website: v })} placeholder="https://..." placeholderTextColor={colors.outlineVariant} /></View>
                <View style={styles.editField}><Text style={styles.editLabel}>Logo URL</Text>
                  <TextInput style={styles.editInput} value={editForm.logo_url ?? ''} onChangeText={(v) => setEditForm({ ...editForm, logo_url: v })} placeholder="https://..." placeholderTextColor={colors.outlineVariant} /></View>
                <View style={styles.editFieldSmall}><Text style={styles.editLabel}>Active</Text>
                  <Switch value={editForm.is_active} onValueChange={(v) => setEditForm({ ...editForm, is_active: v })} trackColor={{ false: colors.outline, true: colors.primary }} /></View>
              </View>
              {p.tabs && p.tabs.length > 0 && (
                <View style={styles.tabsInfo}><Text style={styles.editLabel}>Tabs</Text>
                  <Text style={styles.tabsList}>{p.tabs.map((t) => t.label).join(' → ')}</Text></View>
              )}
              <View style={styles.editActions}>
                <Pressable style={styles.saveBtn} onPress={saveEdit} disabled={saving}><Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save'}</Text></Pressable>
                <Pressable style={styles.cancelBtn} onPress={() => setEditingId(null)}><Text style={styles.cancelBtnText}>Cancel</Text></Pressable>
              </View>
            </View>
          );
        }

        return (
          <Pressable key={p.id} style={[styles.card, !p.is_active && styles.cardInactive]} onPress={() => startEdit(p)}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardName}>{p.name}</Text>
                <Text style={styles.cardMeta}>{p.slug}{!p.is_active ? ' · inactive' : ''}</Text>
                {p.description && <Text style={styles.cardDesc} numberOfLines={1}>{p.description}</Text>}
                {p.tabs && <Text style={styles.cardTabs}>{p.tabs.length} tabs: {p.tabs.map((t) => t.label).join(', ')}</Text>}
              </View>
              <MaterialIcons name="edit" size={16} color={colors.neutralVariant} />
            </View>
          </Pressable>
        );
      })}
    </AdminPageShell>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hint: { fontFamily: fonts.sans, fontSize: 13, color: colors.neutralVariant, marginBottom: spacing.xl },
  card: { backgroundColor: colors.surface, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.outlineVariant, padding: spacing.md, marginBottom: spacing.sm },
  cardInactive: { opacity: 0.5 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  cardName: { fontFamily: fonts.sansBold, fontSize: 15, color: colors.neutral },
  cardMeta: { fontFamily: fonts.sans, fontSize: 12, color: colors.neutralVariant, marginTop: 2 },
  cardDesc: { fontFamily: fonts.sans, fontSize: 13, color: colors.neutralVariant, marginTop: 4 },
  cardTabs: { fontFamily: fonts.sans, fontSize: 12, color: colors.primary, marginTop: 4 },
  editRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.sm, flexWrap: 'wrap' },
  editField: { flex: 1, minWidth: 150 },
  editFieldSmall: { width: 80, alignItems: 'center' },
  editLabel: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.neutralVariant, marginBottom: 4 },
  editInput: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.outline, borderRadius: radii.sm, padding: 8, fontFamily: fonts.sans, fontSize: 13, color: colors.neutral },
  tabsInfo: { marginBottom: spacing.sm },
  tabsList: { fontFamily: fonts.sans, fontSize: 12, color: colors.neutralVariant },
  editActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  saveBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingVertical: 8, borderRadius: radii.sm },
  saveBtnText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.onPrimary },
  cancelBtn: { backgroundColor: colors.surfaceContainer, paddingHorizontal: spacing.lg, paddingVertical: 8, borderRadius: radii.sm },
  cancelBtnText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.neutral },
});

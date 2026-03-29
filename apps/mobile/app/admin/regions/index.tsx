import { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, ActivityIndicator, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { supabase } from '@/lib/supabase';
import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';
import { AdminPageShell } from '@/components/admin/AdminPageShell';

interface Region {
  id: string;
  slug: string;
  name: string;
  type: string;
  parent_id: string | null;
  description: string | null;
  website: string | null;
  is_active: boolean;
  display_order: number;
}

export default function RegionsAdminPage() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Region>>({});
  const [saving, setSaving] = useState(false);

  async function loadRegions() {
    const { data } = await supabase.from('regions').select('*').order('display_order');
    if (data) setRegions(data);
    setLoading(false);
  }

  useEffect(() => { loadRegions(); }, []);

  function startEdit(region: Region) {
    setEditingId(region.id);
    setEditForm({ name: region.name, description: region.description ?? '', website: region.website ?? '', is_active: region.is_active, display_order: region.display_order });
  }

  async function saveEdit() {
    if (!editingId) return;
    setSaving(true);
    await supabase.from('regions').update({
      name: editForm.name,
      description: editForm.description || null,
      website: editForm.website || null,
      is_active: editForm.is_active,
      display_order: editForm.display_order,
    }).eq('id', editingId);
    setSaving(false);
    setEditingId(null);
    loadRegions();
  }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>;
  }

  const county = regions.find((r) => r.type === 'county');
  const children = regions.filter((r) => r.type !== 'county').sort((a, b) => a.display_order - b.display_order);

  return (
    <AdminPageShell title="Regions" subtitle={`${regions.length} regions configured`}>
      <Text style={styles.hint}>Regions define the geographic scope for content. Edit inline below.</Text>

      {/* County */}
      {county && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>County</Text>
          <RegionRow region={county} editing={editingId === county.id} editForm={editForm} setEditForm={setEditForm}
            onEdit={() => startEdit(county)} onSave={saveEdit} onCancel={() => setEditingId(null)} saving={saving} colors={colors} styles={styles} />
        </View>
      )}

      {/* Municipalities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Municipalities</Text>
        {children.map((r) => (
          <RegionRow key={r.id} region={r} editing={editingId === r.id} editForm={editForm} setEditForm={setEditForm}
            onEdit={() => startEdit(r)} onSave={saveEdit} onCancel={() => setEditingId(null)} saving={saving} colors={colors} styles={styles} />
        ))}
      </View>
    </AdminPageShell>
  );
}

function RegionRow({ region, editing, editForm, setEditForm, onEdit, onSave, onCancel, saving, colors, styles }: {
  region: Region; editing: boolean; editForm: Partial<Region>; setEditForm: (f: Partial<Region>) => void;
  onEdit: () => void; onSave: () => void; onCancel: () => void; saving: boolean; colors: ThemeColors; styles: any;
}) {
  if (editing) {
    return (
      <View style={styles.card}>
        <View style={styles.editRow}>
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Name</Text>
            <TextInput style={styles.editInput} value={editForm.name} onChangeText={(v) => setEditForm({ ...editForm, name: v })} />
          </View>
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Description</Text>
            <TextInput style={styles.editInput} value={editForm.description ?? ''} onChangeText={(v) => setEditForm({ ...editForm, description: v })} />
          </View>
        </View>
        <View style={styles.editRow}>
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Website</Text>
            <TextInput style={styles.editInput} value={editForm.website ?? ''} onChangeText={(v) => setEditForm({ ...editForm, website: v })} placeholder="https://..." placeholderTextColor={colors.outlineVariant} />
          </View>
          <View style={styles.editField}>
            <Text style={styles.editLabel}>Order</Text>
            <TextInput style={[styles.editInput, { width: 60 }]} value={String(editForm.display_order ?? 0)} onChangeText={(v) => setEditForm({ ...editForm, display_order: parseInt(v, 10) || 0 })} />
          </View>
          <View style={styles.editFieldSmall}>
            <Text style={styles.editLabel}>Active</Text>
            <Switch value={editForm.is_active} onValueChange={(v) => setEditForm({ ...editForm, is_active: v })} trackColor={{ false: colors.outline, true: colors.primary }} />
          </View>
        </View>
        <View style={styles.editActions}>
          <Pressable style={styles.saveBtn} onPress={onSave} disabled={saving}>
            <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save'}</Text>
          </Pressable>
          <Pressable style={styles.cancelBtn} onPress={onCancel}><Text style={styles.cancelBtnText}>Cancel</Text></Pressable>
        </View>
      </View>
    );
  }

  return (
    <Pressable style={[styles.card, !region.is_active && styles.cardInactive]} onPress={onEdit}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardName}>{region.name}</Text>
          <Text style={styles.cardMeta}>{region.slug} · {region.type}{!region.is_active ? ' · inactive' : ''}</Text>
          {region.description && <Text style={styles.cardDesc} numberOfLines={1}>{region.description}</Text>}
        </View>
        <MaterialIcons name="edit" size={16} color={colors.neutralVariant} />
      </View>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hint: { fontFamily: fonts.sans, fontSize: 13, color: colors.neutralVariant, marginBottom: spacing.xl },
  section: { marginBottom: spacing.xxl },
  sectionTitle: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.neutral, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 1 },
  card: { backgroundColor: colors.surface, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.outlineVariant, padding: spacing.md, marginBottom: spacing.sm },
  cardInactive: { opacity: 0.5 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  cardName: { fontFamily: fonts.sansBold, fontSize: 15, color: colors.neutral },
  cardMeta: { fontFamily: fonts.sans, fontSize: 12, color: colors.neutralVariant, marginTop: 2 },
  cardDesc: { fontFamily: fonts.sans, fontSize: 13, color: colors.neutralVariant, marginTop: 4 },
  editRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.sm, flexWrap: 'wrap' },
  editField: { flex: 1, minWidth: 150 },
  editFieldSmall: { width: 80, alignItems: 'center' },
  editLabel: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.neutralVariant, marginBottom: 4 },
  editInput: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.outline, borderRadius: radii.sm, padding: 8, fontFamily: fonts.sans, fontSize: 13, color: colors.neutral },
  editActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  saveBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingVertical: 8, borderRadius: radii.sm },
  saveBtnText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.onPrimary },
  cancelBtn: { backgroundColor: colors.surfaceContainer, paddingHorizontal: spacing.lg, paddingVertical: 8, borderRadius: radii.sm },
  cancelBtnText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.neutral },
});

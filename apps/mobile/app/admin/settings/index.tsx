import { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';

interface Setting {
  key: string;
  value: unknown;
  updated_at: string | null;
}

export default function SiteSettingsAdminPage() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  async function loadSettings() {
    const { data } = await supabase.from('site_settings').select('*').order('key');
    if (data) setSettings(data.map((s) => ({ key: s.key, value: s.value, updated_at: s.updated_at })));
    setLoading(false);
  }

  useEffect(() => { loadSettings(); }, []);

  function startEdit(setting: Setting) {
    setEditingKey(setting.key);
    setEditValue(typeof setting.value === 'string' ? setting.value : JSON.stringify(setting.value, null, 2));
  }

  async function saveEdit() {
    if (!editingKey) return;
    setSaving(true);
    let parsed: unknown;
    try {
      parsed = JSON.parse(editValue);
    } catch {
      parsed = editValue;
    }
    await supabase.from('site_settings').update({ value: parsed, updated_at: new Date().toISOString(), updated_by: user?.id }).eq('key', editingKey);
    setSaving(false);
    setEditingKey(null);
    loadSettings();
  }

  async function addSetting() {
    if (!newKey.trim()) return;
    setSaving(true);
    let parsed: unknown;
    try {
      parsed = JSON.parse(newValue);
    } catch {
      parsed = newValue;
    }
    await supabase.from('site_settings').insert({ key: newKey.trim(), value: parsed, updated_by: user?.id });
    setSaving(false);
    setShowAdd(false);
    setNewKey('');
    setNewValue('');
    loadSettings();
  }

  async function deleteSetting(key: string) {
    if (Platform.OS === 'web' && !window.confirm(`Delete setting "${key}"?`)) return;
    await supabase.from('site_settings').delete().eq('key', key);
    loadSettings();
  }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>;
  }

  return (
    <AdminPageShell title="Site Settings" subtitle={`${settings.length} settings`}
      actions={<AdminButton label="Add Setting" icon="add" onPress={() => setShowAdd(true)} />}>
      <Text style={styles.hint}>Key-value configuration for the site. Values are stored as JSON.</Text>

      {showAdd && (
        <View style={styles.addCard}>
          <Text style={styles.addTitle}>New Setting</Text>
          <View style={styles.addRow}>
            <View style={{ flex: 1 }}><Text style={styles.editLabel}>Key</Text>
              <TextInput style={styles.editInput} value={newKey} onChangeText={setNewKey} placeholder="setting.key" placeholderTextColor={colors.outlineVariant} /></View>
          </View>
          <View style={styles.addRow}>
            <View style={{ flex: 1 }}><Text style={styles.editLabel}>Value (JSON)</Text>
              <TextInput style={[styles.editInput, { minHeight: 60 }]} value={newValue} onChangeText={setNewValue} placeholder='{"enabled": true}' placeholderTextColor={colors.outlineVariant} multiline /></View>
          </View>
          <View style={styles.editActions}>
            <Pressable style={styles.saveBtn} onPress={addSetting} disabled={saving}><Text style={styles.saveBtnText}>Add</Text></Pressable>
            <Pressable style={styles.cancelBtn} onPress={() => setShowAdd(false)}><Text style={styles.cancelBtnText}>Cancel</Text></Pressable>
          </View>
        </View>
      )}

      {settings.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="settings" size={32} color={colors.outlineVariant} />
          <Text style={styles.emptyText}>No settings configured yet.</Text>
        </View>
      ) : (
        settings.map((s) => {
          const editing = editingKey === s.key;
          const valueStr = typeof s.value === 'string' ? s.value : JSON.stringify(s.value, null, 2);

          if (editing) {
            return (
              <View key={s.key} style={styles.card}>
                <Text style={styles.cardKey}>{s.key}</Text>
                <TextInput style={[styles.editInput, { minHeight: 80, fontFamily: 'monospace', marginTop: spacing.sm }]} value={editValue} onChangeText={setEditValue} multiline />
                <View style={styles.editActions}>
                  <Pressable style={styles.saveBtn} onPress={saveEdit} disabled={saving}><Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save'}</Text></Pressable>
                  <Pressable style={styles.cancelBtn} onPress={() => setEditingKey(null)}><Text style={styles.cancelBtnText}>Cancel</Text></Pressable>
                </View>
              </View>
            );
          }

          return (
            <View key={s.key} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardKey}>{s.key}</Text>
                <View style={styles.cardActions}>
                  <Pressable onPress={() => startEdit(s)}><MaterialIcons name="edit" size={16} color={colors.neutralVariant} /></Pressable>
                  <Pressable onPress={() => deleteSetting(s.key)}><MaterialIcons name="delete-outline" size={16} color={colors.error} /></Pressable>
                </View>
              </View>
              <Text style={styles.cardValue} numberOfLines={4}>{valueStr}</Text>
              {s.updated_at && <Text style={styles.cardMeta}>Updated {new Date(s.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>}
            </View>
          );
        })
      )}
    </AdminPageShell>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hint: { fontFamily: fonts.sans, fontSize: 13, color: colors.neutralVariant, marginBottom: spacing.xl },
  addCard: { backgroundColor: colors.primaryContainer, borderRadius: radii.sm, padding: spacing.md, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.primary },
  addTitle: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.primary, marginBottom: spacing.sm },
  addRow: { marginBottom: spacing.sm },
  card: { backgroundColor: colors.surface, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.outlineVariant, padding: spacing.md, marginBottom: spacing.sm },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardActions: { flexDirection: 'row', gap: spacing.md },
  cardKey: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.neutral },
  cardValue: { fontFamily: 'monospace', fontSize: 12, color: colors.neutralVariant, marginTop: spacing.xs, lineHeight: 18 },
  cardMeta: { fontFamily: fonts.sans, fontSize: 11, color: colors.outlineVariant, marginTop: spacing.xs },
  editLabel: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.neutralVariant, marginBottom: 4 },
  editInput: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.outline, borderRadius: radii.sm, padding: 8, fontFamily: fonts.sans, fontSize: 13, color: colors.neutral },
  editActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  saveBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.lg, paddingVertical: 8, borderRadius: radii.sm },
  saveBtnText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.onPrimary },
  cancelBtn: { backgroundColor: colors.surfaceContainer, paddingHorizontal: spacing.lg, paddingVertical: 8, borderRadius: radii.sm },
  cancelBtnText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.neutral },
  emptyState: { backgroundColor: colors.surface, borderRadius: radii.md, borderWidth: 1, borderColor: colors.outlineVariant, padding: spacing.xxxl, alignItems: 'center', gap: 8 },
  emptyText: { fontFamily: fonts.sans, fontSize: 14, color: colors.neutralVariant },
});

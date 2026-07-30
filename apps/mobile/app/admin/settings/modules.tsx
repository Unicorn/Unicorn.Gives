import { useMemo, useState } from 'react';
import { View, Text, Switch, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useFeatureModules } from '@/lib/featureModules';
import {
  FEATURE_MODULES,
  MODULE_KEYS,
  SITE_SETTINGS_KEY,
  normalizeFlags,
  type ModuleFlags,
  type ModuleKey,
} from '@/constants/featureModules';
import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';
import { AdminPageShell } from '@/components/admin/AdminPageShell';

export default function FeatureModulesAdminPage() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { flags: liveFlags, loaded, refresh } = useFeatureModules();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [draft, setDraft] = useState<ModuleFlags | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const flags = draft ?? liveFlags;

  async function toggle(key: ModuleKey, value: boolean) {
    setDraft({ ...flags, [key]: value });
    setSaving(true);
    setError(null);
    // Merge onto the server's current value so a concurrent edit to another
    // module isn't clobbered by this whole-object write.
    const { data: current } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', SITE_SETTINGS_KEY)
      .maybeSingle();
    const next = { ...normalizeFlags(current?.value), [key]: value };
    const { error: saveError } = await supabase.from('site_settings').upsert({
      key: SITE_SETTINGS_KEY,
      value: next,
      updated_at: new Date().toISOString(),
      updated_by: user?.id,
    });
    setSaving(false);
    if (saveError) {
      setDraft(null);
      setError(`Could not save: ${saveError.message}`);
      return;
    }
    await refresh();
    setDraft(null);
  }

  if (!loaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const enabledCount = MODULE_KEYS.filter((k) => flags[k]).length;

  return (
    <AdminPageShell
      title="Feature Modules"
      subtitle={`${enabledCount} of ${MODULE_KEYS.length} modules enabled`}
    >
      <Text style={styles.hint}>
        Turn site feature areas on or off for this deployment. Disabled modules are hidden from
        navigation and their pages redirect home. Content is preserved — nothing is deleted.
      </Text>

      {error && <Text style={styles.error}>{error}</Text>}

      {MODULE_KEYS.map((key) => {
        const meta = FEATURE_MODULES[key];
        const enabled = flags[key];
        return (
          <View key={key} style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons
                name={meta.icon}
                size={20}
                color={enabled ? colors.primary : colors.neutralVariant}
              />
              <View style={styles.cardTitleWrap}>
                <Text style={styles.cardTitle}>{meta.label}</Text>
                <Text style={styles.cardDescription}>{meta.description}</Text>
              </View>
              <Switch
                value={enabled}
                disabled={saving}
                onValueChange={(v) => toggle(key, v)}
                trackColor={{ false: colors.outline, true: colors.primary }}
              />
            </View>
            <View style={styles.featureChips}>
              {meta.features.map((f) => (
                <Text key={f} style={styles.chip}>
                  {f}
                </Text>
              ))}
            </View>
          </View>
        );
      })}
    </AdminPageShell>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    hint: {
      fontFamily: fonts.sans,
      fontSize: 13,
      color: colors.neutralVariant,
      marginBottom: spacing.xl,
      lineHeight: 19,
    },
    error: {
      fontFamily: fonts.sansMedium,
      fontSize: 13,
      color: colors.error,
      marginBottom: spacing.md,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radii.sm,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      padding: spacing.md,
      marginBottom: spacing.sm,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    cardTitleWrap: { flex: 1 },
    cardTitle: {
      fontFamily: fonts.sansBold,
      fontSize: 14,
      color: colors.neutral,
    },
    cardDescription: {
      fontFamily: fonts.sans,
      fontSize: 12,
      color: colors.neutralVariant,
      marginTop: 2,
    },
    featureChips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
      marginTop: spacing.md,
    },
    chip: {
      fontFamily: fonts.sans,
      fontSize: 11,
      color: colors.neutralVariant,
      backgroundColor: colors.surfaceContainer,
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: radii.pill,
    },
  });

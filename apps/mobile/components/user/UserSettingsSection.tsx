import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useTheme, fonts, spacing, radii } from '@/constants/theme';
import { useThemePreference, type ThemePreference } from '@/lib/themePreference';

type Channel = 'push' | 'email';

type NotifRow = {
  topic: string;
  channel: Channel;
  label: string;
};

const NOTIFICATION_ROWS: NotifRow[] = [
  { topic: 'community_events', channel: 'push', label: 'Community events — push' },
  { topic: 'community_events', channel: 'email', label: 'Community events — email' },
  { topic: 'news', channel: 'push', label: 'News — push' },
  { topic: 'news', channel: 'email', label: 'News — email' },
];

function keyFor(row: NotifRow) {
  return `${row.topic}:${row.channel}`;
}

interface UserSettingsSectionProps {
  /** When false, omit the inner "Settings" heading (use a page-level title instead). */
  showSectionTitle?: boolean;
}

export function UserSettingsSection({ showSectionTitle = true }: UserSettingsSectionProps) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { preference, setPreference } = useThemePreference();

  const [subIds, setSubIds] = useState<Record<string, string>>({});
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [subError, setSubError] = useState<string | null>(null);

  const loadSubscriptions = useCallback(async () => {
    if (!user) {
      setSubIds({});
      setLoadingSubs(false);
      return;
    }
    setLoadingSubs(true);
    setSubError(null);
    const { data, error } = await supabase
      .from('notification_subscriptions')
      .select('id, topic, channel, region_id, partner_id')
      .eq('user_id', user.id);

    if (error) {
      setSubError(error.message);
      setLoadingSubs(false);
      return;
    }

    const next: Record<string, string> = {};
    for (const row of data ?? []) {
      if (row.region_id != null || row.partner_id != null) continue;
      const ch = row.channel as Channel;
      if (ch !== 'push' && ch !== 'email') continue;
      next[`${row.topic}:${ch}`] = row.id;
    }
    setSubIds(next);
    setLoadingSubs(false);
  }, [user]);

  useEffect(() => {
    void loadSubscriptions();
  }, [loadSubscriptions]);

  const toggleSubscription = useCallback(
    async (row: NotifRow, enabled: boolean) => {
      if (!user) return;
      const k = keyFor(row);
      setSubError(null);
      if (enabled) {
        const { data, error } = await supabase
          .from('notification_subscriptions')
          .insert({
            user_id: user.id,
            topic: row.topic,
            channel: row.channel,
            region_id: null,
            partner_id: null,
          })
          .select('id')
          .single();
        if (error) {
          setSubError(error.message);
          void loadSubscriptions();
          return;
        }
        if (data?.id) setSubIds((prev) => ({ ...prev, [k]: data.id }));
      } else {
        const { error } = await supabase
          .from('notification_subscriptions')
          .delete()
          .eq('user_id', user.id)
          .eq('topic', row.topic)
          .eq('channel', row.channel)
          .is('region_id', null)
          .is('partner_id', null);
        if (error) {
          setSubError(error.message);
          return;
        }
        setSubIds((prev) => {
          const next = { ...prev };
          delete next[k];
          return next;
        });
      }
    },
    [user, loadSubscriptions],
  );

  const styles = useMemo(() => createStyles(colors, !showSectionTitle), [colors, showSectionTitle]);

  const themeOptions: { value: ThemePreference; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'Match system' },
  ];

  return (
    <View style={styles.section}>
      {showSectionTitle ? <Text style={styles.sectionTitle}>Settings</Text> : null}

      <Text style={styles.subsection}>Appearance</Text>
      <View style={styles.card}>
        {themeOptions.map((opt) => {
          const selected = preference === opt.value;
          return (
            <Pressable
              key={opt.value}
              style={[styles.themeRow, selected && { borderLeftWidth: 3, borderLeftColor: colors.primary }]}
              onPress={() => setPreference(opt.value)}
            >
              <Text style={[styles.themeLabel, { color: colors.neutral }]}>{opt.label}</Text>
              {selected ? <Text style={{ color: colors.primary, fontFamily: fonts.sansBold }}>✓</Text> : null}
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.subsection}>Notifications</Text>
      <Text style={styles.hint}>
        Choose what you want to hear about. Delivery depends on device and account setup.
      </Text>

      {loadingSubs ? (
        <View style={styles.subLoading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <View style={styles.card}>
          {NOTIFICATION_ROWS.map((row) => {
            const on = Boolean(subIds[keyFor(row)]);
            return (
              <View key={keyFor(row)} style={styles.switchRow}>
                <Text style={[styles.switchLabel, { color: colors.neutral }]}>{row.label}</Text>
                <Switch
                  value={on}
                  onValueChange={(v) => void toggleSubscription(row, v)}
                  trackColor={{ false: colors.outlineVariant, true: colors.primary }}
                  thumbColor={colors.surface}
                />
              </View>
            );
          })}
        </View>
      )}

      {subError ? <Text style={styles.error}>{subError}</Text> : null}
    </View>
  );
}

const createStyles = (
  colors: ReturnType<typeof useTheme>['colors'],
  pageMode: boolean,
) =>
  StyleSheet.create({
    section: { gap: spacing.sm, marginTop: pageMode ? 0 : spacing.xxxl },
    sectionTitle: {
      fontFamily: fonts.sansBold,
      fontSize: 20,
      color: colors.neutral,
      marginBottom: spacing.sm,
    },
    subsection: {
      fontFamily: fonts.sansBold,
      fontSize: 15,
      color: colors.neutral,
      marginTop: spacing.lg,
    },
    hint: {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: colors.neutralVariant,
      lineHeight: 20,
    },
    card: {
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.md,
      backgroundColor: colors.surface,
      overflow: 'hidden',
    },
    themeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.outlineVariant,
    },
    themeLabel: {
      fontFamily: fonts.sans,
      fontSize: 16,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      gap: spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.outlineVariant,
    },
    switchLabel: {
      fontFamily: fonts.sans,
      fontSize: 15,
      flex: 1,
    },
    subLoading: { paddingVertical: spacing.xl, alignItems: 'center' },
    error: {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: colors.error,
      marginTop: spacing.sm,
    },
  });

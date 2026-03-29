import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { useTheme, fonts, spacing, radii } from '@/constants/theme';

function formatRole(role: string) {
  return role.replace(/_/g, ' ');
}

interface UserProfileSectionProps {
  /** When false, omit the inner "Profile" heading (use a page-level title instead). */
  showSectionTitle?: boolean;
}

export function UserProfileSection({ showSectionTitle = true }: UserProfileSectionProps) {
  const { colors } = useTheme();
  const { user, profile, refreshProfile } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedHint, setSavedHint] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.display_name ?? '');
    setAvatarUrl(profile.avatar_url ?? '');
  }, [profile]);

  const onSave = useCallback(async () => {
    if (!user) return;
    setError(null);
    setSavedHint(false);
    setSaving(true);
    try {
      const trimmedName = displayName.trim() || null;
      const trimmedAvatar = avatarUrl.trim() || null;
      const { error: upErr } = await supabase
        .from('profiles')
        .update({
          display_name: trimmedName,
          avatar_url: trimmedAvatar,
        })
        .eq('id', user.id);
      if (upErr) throw upErr;
      await refreshProfile();
      setSavedHint(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save profile.');
    } finally {
      setSaving(false);
    }
  }, [user, displayName, avatarUrl, refreshProfile]);

  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.center, { paddingHorizontal: spacing.xl }]}>
        <Text style={[styles.error, { textAlign: 'center' }]}>
          We could not load your profile. Try signing out and back in.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      {showSectionTitle ? <Text style={styles.sectionTitle}>Profile</Text> : null}

      <Text style={styles.label}>Email</Text>
      <Text style={styles.readOnly}>{profile.email}</Text>

      <Text style={styles.label}>Role</Text>
      <View style={styles.roleChip}>
        <Text style={styles.roleChipText}>{formatRole(profile.role)}</Text>
      </View>

      <Text style={styles.label}>Display name</Text>
      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Your name"
        placeholderTextColor={colors.neutralVariant}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Avatar URL</Text>
      <TextInput
        style={styles.input}
        value={avatarUrl}
        onChangeText={setAvatarUrl}
        placeholder="https://…"
        placeholderTextColor={colors.neutralVariant}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {savedHint ? <Text style={styles.saved}>Saved.</Text> : null}

      <Pressable
        style={[styles.button, saving && styles.buttonDisabled]}
        onPress={() => void onSave()}
        disabled={saving}
      >
        <Text style={styles.buttonText}>{saving ? 'Saving…' : 'Save profile'}</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    section: { gap: spacing.sm },
    sectionTitle: {
      fontFamily: fonts.sansBold,
      fontSize: 20,
      color: colors.neutral,
      marginBottom: spacing.sm,
    },
    center: { minHeight: 80, justifyContent: 'center', alignItems: 'center' },
    label: {
      fontFamily: fonts.sansMedium,
      fontSize: 13,
      color: colors.neutralVariant,
      marginTop: spacing.sm,
    },
    readOnly: {
      fontFamily: fonts.sans,
      fontSize: 16,
      color: colors.neutral,
      paddingVertical: spacing.sm,
    },
    roleChip: {
      alignSelf: 'flex-start',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radii.pill,
      borderWidth: 1,
      borderColor: colors.outline,
      backgroundColor: colors.surface,
    },
    roleChipText: {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: colors.neutralVariant,
      textTransform: 'capitalize',
    },
    input: {
      fontFamily: fonts.sans,
      fontSize: 16,
      color: colors.neutral,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.md,
      padding: spacing.md,
    },
    error: {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: colors.error,
      marginTop: spacing.sm,
    },
    saved: {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: colors.primary,
      marginTop: spacing.xs,
    },
    button: {
      marginTop: spacing.lg,
      backgroundColor: colors.primary,
      borderRadius: radii.md,
      paddingVertical: spacing.md,
      alignItems: 'center',
    },
    buttonDisabled: { opacity: 0.6 },
    buttonText: {
      fontFamily: fonts.sansBold,
      fontSize: 16,
      color: colors.onPrimary,
    },
  });

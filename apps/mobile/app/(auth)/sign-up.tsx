import { useEffect, useState, useMemo } from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { isSafeRedirect } from '@/lib/authRedirect';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';
import { Button } from '@/components/ui';

/** Turn a redirect path into an absolute URL for the confirmation email link. */
function absoluteUrl(path: string): string {
  const origin =
    Platform.OS === 'web' && typeof window !== 'undefined'
      ? window.location.origin
      : 'https://unicorn.gives';
  if (!path) return origin;
  return path.startsWith('http') ? path : `${origin}${path.startsWith('/') ? '' : '/'}${path}`;
}

export default function SignUpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ redirect?: string }>();
  const { user, role, loading } = useAuth();
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  // Only honor a safe, in-app redirect target (never an auth page → no loop).
  const redirect = isSafeRedirect(params.redirect) ? params.redirect : null;
  const destination = redirect || (role === 'super_admin' ? '/admin' : '/');

  // If a session already exists (e.g. email confirmation was not required, or
  // the user is already signed in), go straight to the destination.
  useEffect(() => {
    if (loading || !user) return;
    router.replace(destination as any);
  }, [loading, user, destination, router]);

  async function onSignUp() {
    setError(null);
    if (!email.trim() || !password) {
      setError('Enter an email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: absoluteUrl(redirect || '/') },
      });

      if (res.error) throw res.error;

      // Confirmation off → session is live now; the effect above redirects.
      // Confirmation on → no session yet; tell the user to check their email.
      if (!res.data.session) {
        setSentTo(email.trim());
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-up failed.');
    } finally {
      setSubmitting(false);
    }
  }

  const styles = useMemo(() => createStyles(colors), [colors]);

  if (sentTo) {
    return (
      <View style={styles.page}>
        <View style={styles.form}>
          <View style={styles.header}>
            <MaterialIcons name="mark-email-unread" size={32} color={colors.primary} />
            <Text style={styles.brand}>UNI Gives</Text>
          </View>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.body}>
            We sent a confirmation link to <Text style={styles.bodyStrong}>{sentTo}</Text>. Open it to
            finish creating your account — it’ll bring you right back to where you left off.
          </Text>
          <Button
            label="Back to sign-in"
            variant="ghost"
            size="lg"
            onPress={() =>
              router.replace(
                (redirect
                  ? `/sign-in?redirect=${encodeURIComponent(redirect)}`
                  : '/sign-in') as any,
              )
            }
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <View style={styles.form}>
        <View style={styles.header}>
          <MaterialIcons name="eco" size={32} color={colors.primary} />
          <Text style={styles.brand}>UNI Gives</Text>
        </View>

        <Text style={styles.title}>Create an account</Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Email"
          placeholderTextColor={colors.neutralVariant}
        />

        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor={colors.neutralVariant}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          label={submitting ? 'Creating\u2026' : 'Create account'}
          onPress={onSignUp}
          size="lg"
          disabled={submitting}
          loading={submitting}
        />

        <Button
          label="Back to sign-in"
          variant="ghost"
          onPress={() => router.replace((redirect ? `/sign-in?redirect=${encodeURIComponent(redirect)}` : '/sign-in') as any)}
          size="lg"
          disabled={submitting}
        />
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    form: {
      width: '100%',
      maxWidth: 400,
      gap: spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    brand: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.xl,
      color: colors.neutral,
    },
    title: {
      fontFamily: fonts.serifBold,
      fontSize: fontSize['5xl'],
      lineHeight: 36,
      color: colors.neutral,
      marginBottom: spacing.sm,
    },
    body: {
      fontFamily: fonts.sans,
      fontSize: fontSize.lg,
      lineHeight: 26,
      color: colors.neutralVariant,
      marginBottom: spacing.sm,
    },
    bodyStrong: {
      fontFamily: fonts.sansBold,
      color: colors.neutral,
    },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.md,
      padding: spacing.md,
      fontFamily: fonts.sans,
      fontSize: fontSize.lg,
      color: colors.neutral,
    },
    error: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.error,
      backgroundColor: colors.errorContainer,
      borderRadius: radii.sm,
      padding: spacing.md,
    },
  });

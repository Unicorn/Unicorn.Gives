import { useEffect, useState, useMemo } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useTheme, fonts, spacing, radii } from '@/constants/theme';

export default function SignInScreen() {
  const router = useRouter();
  const { user, role, loading } = useAuth();
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (role === 'super_admin') router.replace('/admin');
    else router.replace('/' as any);
  }, [loading, role, user, router]);

  async function onSignIn() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (res.error) throw res.error;
      // Redirect handled by the useEffect once role/user load.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed.');
    } finally {
      setSubmitting(false);
    }
  }

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Sign in</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
      />

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={onSignIn} disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? 'Signing in\u2026' : 'Sign in'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.replace('/sign-up')}
        disabled={submitting}
      >
        <Text style={styles.secondaryButtonText}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background, padding: 20, gap: 12, justifyContent: 'center' },
  title: { fontSize: 30, fontWeight: '900', color: colors.neutral, marginBottom: 10 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.outline, borderRadius: radii.md, padding: 12, fontSize: 16 },
  error: { color: colors.error, backgroundColor: colors.surface, borderRadius: radii.md, padding: 10, borderWidth: 1, borderColor: colors.errorContainer },
  button: { backgroundColor: colors.primary, borderRadius: radii.md, paddingVertical: 12, alignItems: 'center' },
  buttonText: { color: colors.onPrimary, fontWeight: '900' },
  secondaryButton: { borderRadius: radii.md, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.primary },
  secondaryButtonText: { color: colors.primary, fontWeight: '900' },
});

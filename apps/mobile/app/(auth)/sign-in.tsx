import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

export default function SignInScreen() {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (role === 'super_admin') router.replace('/admin');
    else router.replace('/');
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
        <Text style={styles.buttonText}>{submitting ? 'Signing in…' : 'Sign in'}</Text>
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

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fcf9f4', padding: 20, gap: 12, justifyContent: 'center' },
  title: { fontSize: 30, fontWeight: '900', color: '#2d4a4a', marginBottom: 10 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#c3c8bb', borderRadius: 12, padding: 12, fontSize: 16 },
  error: { color: '#b42318', backgroundColor: '#fff', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: '#f5c2c7' },
  button: { backgroundColor: '#2d4a4a', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  buttonText: { color: '#fcf9f4', fontWeight: '900' },
  secondaryButton: { borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: '#2d4a4a' },
  secondaryButtonText: { color: '#2d4a4a', fontWeight: '900' },
});


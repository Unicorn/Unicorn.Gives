import { useState, useMemo } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { supabase } from '@/lib/supabase';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';
import { Button } from '@/components/ui';

export default function SignUpScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSignUp() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (res.error) throw res.error;
      router.replace('/sign-in');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-up failed.');
    } finally {
      setSubmitting(false);
    }
  }

  const styles = useMemo(() => createStyles(colors), [colors]);

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
          onPress={() => router.replace('/sign-in')}
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

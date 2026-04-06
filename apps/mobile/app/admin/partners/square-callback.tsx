/**
 * OAuth callback page for Square integration.
 * Receives partner_id + success/error from the square-oauth Edge Function redirect.
 */
import { useEffect, useMemo, useState } from 'react';
import { View, Text, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

export default function SquareCallbackPage() {
  const params = useLocalSearchParams<{
    partner_id?: string;
    success?: string;
    error?: string;
  }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const isSuccess = params.success === 'true';
  const errorMessage = params.error;
  const partnerId = params.partner_id;

  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!isSuccess || !partnerId) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.replace(toHref(`/admin/partners/${partnerId}`));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSuccess, partnerId, router]);

  if (isSuccess) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <MaterialIcons name="check-circle" size={48} color="#22c55e" />
          <Text style={styles.title}>Square Connected</Text>
          <Text style={styles.body}>
            Your Square account has been successfully connected. Redirecting to partner settings in {countdown}s...
          </Text>
          <Pressable
            style={styles.btn}
            onPress={() => router.replace(toHref(`/admin/partners/${partnerId}`))}
          >
            <Text style={styles.btnText}>Go to Partner Settings</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <MaterialIcons name="error" size={48} color="#dc2626" />
          <Text style={styles.title}>Connection Failed</Text>
          <Text style={styles.body}>{errorMessage}</Text>
          <Pressable
            style={styles.btn}
            onPress={() => router.back()}
          >
            <Text style={styles.btnText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.body}>Processing Square connection...</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
      backgroundColor: colors.surface,
    },
    card: {
      backgroundColor: colors.surfaceContainer,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radii.md,
      padding: spacing.xxxl,
      alignItems: 'center',
      maxWidth: 440,
      gap: spacing.md,
    },
    title: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.xl,
      color: colors.neutral,
    },
    body: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutralVariant,
      textAlign: 'center',
      lineHeight: 22,
    },
    btn: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.sm + 4,
      borderRadius: radii.sm,
      marginTop: spacing.md,
    },
    btnText: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.md,
      color: colors.onPrimary,
    },
  });

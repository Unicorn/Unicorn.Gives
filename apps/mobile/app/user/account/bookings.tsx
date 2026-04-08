import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';
import { useMyBookings } from '@/hooks/useMyAccount';

function formatDateTime(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function MyBookingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { bookings, loading } = useMyBookings();

  const now = Date.now();
  const upcoming = bookings.filter((b) => b.start_at && new Date(b.start_at).getTime() >= now);
  const past = bookings.filter((b) => !b.start_at || new Date(b.start_at).getTime() < now);

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      <Text style={styles.pageTitle}>Bookings</Text>
      <Text style={styles.subtitle}>Your upcoming and past appointments.</Text>

      {loading && <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />}

      {!loading && bookings.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No bookings yet.</Text>
        </View>
      )}

      {upcoming.length > 0 && (
        <>
          <Text style={styles.sectionHeader}>Upcoming</Text>
          <View style={styles.list}>
            {upcoming.map((b) => (
              <View key={b.id} style={styles.card}>
                <Text style={styles.when}>{formatDateTime(b.start_at)}</Text>
                {b.status && <Text style={styles.meta}>Status: {b.status}</Text>}
              </View>
            ))}
          </View>
        </>
      )}

      {past.length > 0 && (
        <>
          <Text style={styles.sectionHeader}>Past</Text>
          <View style={styles.list}>
            {past.map((b) => (
              <View key={b.id} style={styles.card}>
                <Text style={styles.when}>{formatDateTime(b.start_at)}</Text>
                {b.status && <Text style={styles.meta}>Status: {b.status}</Text>}
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    scroll: { flex: 1 },
    content: {
      padding: spacing.xl,
      maxWidth: 720,
      alignSelf: 'center',
      width: '100%',
    },
    pageTitle: { fontFamily: fonts.sansBold, fontSize: fontSize['4xl'], color: colors.neutral },
    subtitle: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutralVariant,
      marginTop: spacing.sm,
      marginBottom: spacing.xl,
    },
    sectionHeader: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.lg,
      color: colors.neutral,
      marginTop: spacing.lg,
      marginBottom: spacing.md,
    },
    empty: { padding: spacing.xl, alignItems: 'center' },
    emptyText: { fontFamily: fonts.sans, fontSize: fontSize.md, color: colors.neutralVariant },
    list: { gap: spacing.sm },
    card: {
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.md,
      padding: spacing.lg,
      backgroundColor: colors.surface,
      gap: spacing.xs,
    },
    when: { fontFamily: fonts.sansBold, fontSize: fontSize.md, color: colors.neutral },
    meta: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant },
  });

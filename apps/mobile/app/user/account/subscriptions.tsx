import { useMemo } from 'react';
import { ActivityIndicator, Alert, Linking, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import {
  useMySubscriptions,
  useSubscriptionActions,
  type MySubscription,
} from '@/hooks/useMyAccount';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

function confirmAction(message: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    return Promise.resolve(typeof window !== 'undefined' && window.confirm(message));
  }
  return new Promise((resolve) => {
    Alert.alert('Please confirm', message, [
      { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
      { text: 'OK', onPress: () => resolve(true) },
    ]);
  });
}

export default function MySubscriptionsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { subscriptions, loading, reload } = useMySubscriptions();
  const actions = useSubscriptionActions();

  async function handlePause(sub: MySubscription) {
    if (!(await confirmAction('Pause this subscription? Billing will stop until you resume.'))) return;
    await actions.pause(sub.id);
    reload();
  }
  async function handleResume(sub: MySubscription) {
    await actions.resume(sub.id);
    reload();
  }
  async function handleCancel(sub: MySubscription) {
    if (!(await confirmAction('Cancel this subscription? This cannot be undone.'))) return;
    await actions.cancel(sub.id);
    reload();
  }
  async function handleUpdateCard(sub: MySubscription) {
    const res = await actions.paymentMethodLink(sub.partner_id);
    if (res?.url) Linking.openURL(res.url);
  }

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      <Text style={styles.pageTitle}>Subscriptions</Text>
      <Text style={styles.subtitle}>Your active and past memberships.</Text>

      {loading && <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />}

      {!loading && subscriptions.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>You don't have any subscriptions yet.</Text>
        </View>
      )}

      {actions.error && <Text style={styles.error}>{actions.error}</Text>}

      <View style={styles.list}>
        {subscriptions.map((sub) => (
          <View key={sub.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.tier}>{sub.tier ?? 'Membership'}</Text>
              <StatusChip status={sub.status} />
            </View>
            {sub.customer_email && (
              <Text style={styles.meta}>Billing to {sub.customer_email}</Text>
            )}
            {sub.current_period_end && (
              <Text style={styles.meta}>Renews {formatDate(sub.current_period_end)}</Text>
            )}
            {sub.canceled_at && (
              <Text style={styles.meta}>Canceled {formatDate(sub.canceled_at)}</Text>
            )}

            <View style={styles.actionsRow}>
              {sub.status === 'active' && (
                <>
                  <ActionBtn
                    label="Pause"
                    onPress={() => handlePause(sub)}
                    busy={actions.busy === 'pause_subscription'}
                    styles={styles}
                  />
                  <ActionBtn
                    label="Update card"
                    onPress={() => handleUpdateCard(sub)}
                    busy={actions.busy === 'payment_method_link'}
                    styles={styles}
                  />
                  <ActionBtn
                    label="Cancel"
                    variant="danger"
                    onPress={() => handleCancel(sub)}
                    busy={actions.busy === 'cancel_subscription'}
                    styles={styles}
                  />
                </>
              )}
              {sub.status === 'paused' && (
                <ActionBtn
                  label="Resume"
                  onPress={() => handleResume(sub)}
                  busy={actions.busy === 'resume_subscription'}
                  styles={styles}
                />
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function StatusChip({ status }: { status: MySubscription['status'] }) {
  const { colors } = useTheme();
  // Status = gold chip per DESIGN_SYSTEM taxonomy; others neutral.
  const isActive = status === 'active';
  const bg = isActive ? colors.goldContainer : colors.surfaceContainer;
  const border = isActive ? colors.gold : colors.outlineVariant;
  const fg = isActive ? colors.gold : colors.neutralVariant;
  return (
    <View
      style={{
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: radii.pill,
        borderWidth: 1,
        backgroundColor: bg,
        borderColor: border,
      }}
    >
      <Text style={{ fontFamily: fonts.sansBold, fontSize: fontSize.xs, color: fg, textTransform: 'uppercase' }}>
        {status}
      </Text>
    </View>
  );
}

function ActionBtn({
  label,
  onPress,
  busy,
  variant,
  styles,
}: {
  label: string;
  onPress: () => void;
  busy: boolean;
  variant?: 'danger';
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <AnimatedPressable
      variant="subtle"
      onPress={onPress}
      disabled={busy}
      style={variant === 'danger' ? styles.dangerBtn : styles.btn}
    >
      <Text style={variant === 'danger' ? styles.dangerBtnText : styles.btnText}>
        {busy ? '…' : label}
      </Text>
    </AnimatedPressable>
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
    empty: { padding: spacing.xl, alignItems: 'center' },
    emptyText: { fontFamily: fonts.sans, fontSize: fontSize.md, color: colors.neutralVariant },
    error: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.error,
      marginBottom: spacing.md,
    },
    list: { gap: spacing.md },
    card: {
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.md,
      padding: spacing.lg,
      backgroundColor: colors.surface,
      gap: spacing.xs,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    tier: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.lg,
      color: colors.neutral,
      textTransform: 'capitalize',
    },
    meta: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant },
    actionsRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.md,
      flexWrap: 'wrap',
    },
    btn: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radii.sm,
      borderWidth: 1,
      borderColor: colors.outline,
      backgroundColor: colors.surface,
    },
    btnText: { fontFamily: fonts.sansMedium, fontSize: fontSize.sm, color: colors.neutral },
    dangerBtn: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radii.sm,
      borderWidth: 1,
      borderColor: colors.error,
      backgroundColor: colors.surface,
    },
    dangerBtnText: { fontFamily: fonts.sansMedium, fontSize: fontSize.sm, color: colors.error },
  });

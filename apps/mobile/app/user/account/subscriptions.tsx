import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import {
  useAccountRefresh,
  useMyPayments,
  useMySubscriptions,
  useSubscriptionActions,
  type MyPayment,
  type MySubscription,
} from '@/hooks/useMyAccount';
import { formatDollars } from '@/lib/partners/payWhatYouCan';

/** How long after landing a new subscription still counts as this checkout's. */
const CHECKOUT_LOOKBACK_MS = 2 * 60 * 60 * 1000;

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
  const { payments, loading: paymentsLoading } = useMyPayments();
  const actions = useSubscriptionActions();
  const { refresh } = useAccountRefresh();

  // Square sends members back here with ?status=success after checkout, or
  // ?status=card_updated after updating their card. Read it after mount so
  // the first render matches the server's.
  const params = useLocalSearchParams<{ status?: string }>();
  const [landing, setLanding] = useState<'success' | 'card_updated' | null>(null);
  const [landedAt] = useState(() => Date.now());
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (params.status === 'success' || params.status === 'card_updated') setLanding(params.status);
  }, [params.status]);

  // Webhooks can lag (or be missing), so after a checkout ask the server to
  // look the subscription up in Square directly. Realtime then updates the
  // list as soon as it's linked.
  useEffect(() => {
    if (landing !== 'success') return;
    const lookUp = () => refresh().then(() => reload());
    const timers = [setTimeout(lookUp, 3000), setTimeout(lookUp, 20000), setTimeout(() => setSlow(true), 60000)];
    return () => timers.forEach(clearTimeout);
  }, [landing, refresh, reload]);

  const confirmed =
    landing === 'success' &&
    subscriptions.some((s) => s.status === 'active' && Date.parse(s.created_at) >= landedAt - CHECKOUT_LOOKBACK_MS);

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

      {landing === 'success' && (
        <View style={styles.banner} accessibilityRole="alert">
          {confirmed ? (
            <MaterialIcons name="check-circle" size={18} color={colors.onPrimaryContainer} />
          ) : (
            <ActivityIndicator size="small" color={colors.onPrimaryContainer} />
          )}
          <Text style={styles.bannerText}>
            {confirmed
              ? "You're in. Your membership is active."
              : slow
                ? 'Your payment went through, but confirming it is taking longer than usual. This page updates on its own, or check back in a few minutes.'
                : 'Confirming your membership… This usually takes a few seconds.'}
          </Text>
        </View>
      )}
      {landing === 'card_updated' && (
        <View style={styles.banner} accessibilityRole="alert">
          <MaterialIcons name="check-circle" size={18} color={colors.onPrimaryContainer} />
          <Text style={styles.bannerText}>Your card was updated.</Text>
        </View>
      )}

      {loading && <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />}

      {!loading && !paymentsLoading && subscriptions.length === 0 && payments.length === 0 && (
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
            {sub.partners?.name || sub.amount_cents ? (
              <Text style={styles.meta}>
                {[sub.partners?.name, sub.amount_cents ? `${formatDollars(sub.amount_cents)} / month` : null]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            ) : null}
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

      {payments.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>One-time passes</Text>
          <View style={styles.list}>
            {payments.map((p) => (
              <PaymentCard key={p.id} payment={p} styles={styles} />
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

function PaymentCard({ payment: p, styles }: { payment: MyPayment; styles: ReturnType<typeof createStyles> }) {
  const isMonth = p.kind === 'membership_one_time';
  const current = isMonth && p.covers_until != null && Date.parse(p.covers_until) > Date.now();
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.tier}>{isMonth ? 'One-time membership' : 'Day pass'}</Text>
        {current && <StatusChip status="active" />}
      </View>
      <Text style={styles.meta}>
        {[p.partners?.name, formatDollars(p.amount_cents)].filter(Boolean).join(' · ')}
      </Text>
      <Text style={styles.meta}>
        {isMonth
          ? `${current ? 'Member through' : 'Covered through'} ${formatDate(p.covers_until)}`
          : `Bought ${formatDate(p.paid_at)}`}
      </Text>
    </View>
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
    banner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.primaryContainer,
      borderRadius: radii.sm,
      padding: spacing.md,
      marginBottom: spacing.lg,
    },
    bannerText: { flex: 1, fontFamily: fonts.sans, fontSize: fontSize.md, color: colors.onPrimaryContainer },
    sectionTitle: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.lg,
      color: colors.neutral,
      marginTop: spacing.xxl,
      marginBottom: spacing.md,
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

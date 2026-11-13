/**
 * Membership picker shown under a partner's membership tab (see `joinTab` in
 * constants/partnerMenus.ts): one of the partner's tiers (e.g. Individual /
 * Couple / Household), monthly or one-time, plus a fixed-price day pass.
 *
 * Signed-out visitors are sent to sign-in and brought back with their choice
 * in the query string. Query params are applied after mount so the static
 * export and the client's first render match.
 *
 * Only offers what the partner has set up (`membership_options`): monthly
 * and one-time need the tiers created in Square, and nothing is offered until memberships are switched
 * on and Square is connected — the card then points people to join in person.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { fonts, fontSize, radii, spacing, useTheme, type ThemeColors } from '@/constants/theme';
import { useAuth } from '@/lib/auth';
import { routes } from '@/lib/navigation';
import { useFlexCheckout, useMembershipOptions, type FlexCheckoutKind } from '@/hooks/useSquareBookings';
import { useAccountRefresh, useMyPayments } from '@/hooks/useMyAccount';
import {
  DAY_PASS_CENTS,
  formatDollars,
  summaryLine,
  type MembershipFrequency,
} from '@/lib/partners/membershipPricing';

/** How long after landing a payment still counts as this checkout's. */
const CHECKOUT_LOOKBACK_MS = 2 * 60 * 60 * 1000;

interface MembershipPickerProps {
  partnerId: string;
  partnerSlug: string;
  partnerName: string;
  joinTab: string;
}

export function MembershipPicker({ partnerId, partnerSlug, partnerName, joinTab }: MembershipPickerProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ kind?: string; tier?: string; status?: string }>();
  const { create, loading, error: checkoutError } = useFlexCheckout(partnerId);
  const options = useMembershipOptions(partnerId);

  const [frequency, setFrequency] = useState<MembershipFrequency>('monthly');
  const [tierId, setTierId] = useState<string | null>(null);
  const [tierError, setTierError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [resumeDayPass, setResumeDayPass] = useState(false);
  const [resuming, setResuming] = useState(false);
  const cardRef = useRef<View>(null);
  const [landedAt] = useState(() => Date.now());
  const { payments } = useMyPayments();
  const { refresh } = useAccountRefresh();

  // Restore a choice carried through sign-in, and the post-checkout banner.
  useEffect(() => {
    if (params.kind === 'monthly' || params.kind === 'one_time') setFrequency(params.kind);
    setResumeDayPass(params.kind === 'day_pass');
    setResuming(params.kind === 'monthly' || params.kind === 'one_time' || params.kind === 'day_pass');
    if (params.tier) setTierId(params.tier);
    setPaid(params.status === 'paid');
  }, [params.kind, params.tier, params.status]);

  const tiers = options?.tiers ?? [];
  const tier = tiers.find((t) => t.id === tierId) ?? null;

  // Offer only the frequencies that will work; fall back if the chosen (or
  // restored) one isn't available.
  const frequencies = (['monthly', 'one_time'] as const).filter((f) =>
    f === 'monthly' ? options?.monthly : options?.one_time,
  );
  const activeFrequency: MembershipFrequency = frequencies.includes(frequency)
    ? frequency
    : (frequencies[0] ?? frequency);
  const dayPass = options?.day_pass ?? false;

  // Back from sign-in with a choice in the URL: once the options are in,
  // bring the picker into view so they can carry on where they left off.
  const resumeReady = resuming && (frequencies.length > 0 || dayPass);
  useEffect(() => {
    if (!resumeReady) return;
    const el = cardRef.current as unknown as { scrollIntoView?: (o: object) => void } | null;
    el?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    // The screen may still be transitioning in, or content above still
    // loading and pushing this down: settle once more.
    const settle = setTimeout(() => el?.scrollIntoView?.({ block: 'center' }), 1000);
    return () => clearTimeout(settle);
  }, [resumeReady]);

  const summary = tier ? summaryLine(activeFrequency, tier) : null;

  async function checkout(kind: FlexCheckoutKind, chosenTierId?: string) {
    if (!user) {
      const back =
        `${routes.partners.tab(partnerSlug, joinTab) as string}` +
        (kind === 'day_pass' ? '?kind=day_pass' : `?kind=${kind}&tier=${encodeURIComponent(chosenTierId ?? '')}`);
      router.push(`${routes.auth.signIn() as string}?redirect=${encodeURIComponent(back)}` as never);
      return;
    }
    const result = await create(kind, chosenTierId);
    if (result?.checkout_url) Linking.openURL(result.checkout_url);
  }

  function handleJoin() {
    if (!tier) {
      setTierError('Choose a membership');
      return;
    }
    checkout(activeFrequency, tier.id);
  }

  // Back from Square with ?status=paid: ask the server to check the order
  // with Square directly (webhooks can lag), then show the confirmation as
  // soon as the payment lands (useMyPayments is realtime).
  useEffect(() => {
    if (!paid || !user) return;
    const timers = [setTimeout(() => void refresh(), 2000), setTimeout(() => void refresh(), 15000)];
    return () => timers.forEach(clearTimeout);
  }, [paid, user, refresh]);

  const confirmedPayment = paid
    ? payments.find(
        (p) => p.partner_id === partnerId && Date.parse(p.paid_at ?? p.created_at) >= landedAt - CHECKOUT_LOOKBACK_MS,
      )
    : undefined;

  const banner = paid && (
    <View style={styles.banner} accessibilityRole="alert">
      {confirmedPayment ? (
        <MaterialIcons name="check-circle" size={18} color={colors.onPrimaryContainer} />
      ) : (
        <ActivityIndicator size="small" color={colors.onPrimaryContainer} />
      )}
      <Text style={styles.bannerText}>
        {!confirmedPayment
          ? 'Thanks for your payment. It can take a minute to confirm.'
          : confirmedPayment.kind === 'membership_one_time' && confirmedPayment.covers_until
            ? `Payment confirmed. You're a member through ${new Date(confirmedPayment.covers_until).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}.`
            : `Payment confirmed. Enjoy your day at ${partnerName}.`}
      </Text>
    </View>
  );

  if (options === null) {
    return (
      <View style={styles.card} nativeID="join">
        {banner}
        <Text style={styles.heading}>Choose your membership</Text>
        <ActivityIndicator
          color={colors.primary}
          style={styles.pending}
          accessibilityLabel="Loading membership options"
        />
      </View>
    );
  }

  if (frequencies.length === 0 && !dayPass) {
    return (
      <View style={styles.card} nativeID="join">
        {banner}
        <Text style={styles.heading}>Join in person</Text>
        <Text style={styles.lede}>Online sign-up isn't open yet. Stop by {partnerName} and we'll get you set up.</Text>
      </View>
    );
  }

  return (
    <View style={styles.card} nativeID="join" ref={cardRef}>
      {banner}

      {frequencies.length > 0 && (
        <>
          <Text style={styles.heading}>Choose your membership</Text>
          <Text style={styles.lede}>
            {frequencies.length > 1
              ? 'Pick who’s joining, then pay monthly or one-time.'
              : `${activeFrequency === 'monthly' ? 'Monthly' : 'One-time'} membership. Pick who’s joining.`}
          </Text>

          {frequencies.length > 1 && (
            <View style={styles.segment} accessibilityRole="radiogroup" accessibilityLabel="How often">
              {frequencies.map((f) => {
                const on = activeFrequency === f;
                return (
                  <Pressable
                    key={f}
                    onPress={() => setFrequency(f)}
                    style={StyleSheet.flatten([styles.segmentItem, on && styles.segmentItemOn])}
                    accessibilityRole="radio"
                    aria-checked={on}
                    accessibilityLabel={f === 'monthly' ? 'Monthly' : 'One-time'}
                  >
                    <Text style={StyleSheet.flatten([styles.segmentText, on && styles.segmentTextOn])}>
                      {f === 'monthly' ? 'Monthly' : 'One-time'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <View style={styles.tiers} accessibilityRole="radiogroup" accessibilityLabel="Membership">
            {tiers.map((t) => {
              const on = tier?.id === t.id;
              const price = formatDollars(t.amount_cents);
              return (
                <Pressable
                  key={t.id}
                  onPress={() => {
                    setTierId(t.id);
                    setTierError(null);
                  }}
                  style={StyleSheet.flatten([styles.tier, on && styles.tierOn])}
                  accessibilityRole="radio"
                  aria-checked={on}
                  accessibilityLabel={`${t.name}, ${price}${activeFrequency === 'monthly' ? ' a month' : ''}`}
                >
                  <Text style={StyleSheet.flatten([styles.tierName, on && styles.tierTextOn])}>{t.name}</Text>
                  <Text style={StyleSheet.flatten([styles.tierPrice, on && styles.tierTextOn])}>
                    {price}
                    {activeFrequency === 'monthly' ? <Text style={styles.tierPer}> / month</Text> : null}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {tierError && <Text style={styles.error}>{tierError}</Text>}

          {summary && <Text style={styles.summary}>{summary}</Text>}

          <Pressable onPress={handleJoin} style={styles.primaryBtn} accessibilityRole="button">
            {loading === activeFrequency ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <Text style={styles.primaryBtnText}>{user ? 'Continue to payment' : 'Sign in to join'}</Text>
            )}
          </Pressable>
        </>
      )}
      {checkoutError && <Text style={styles.error}>{checkoutError}</Text>}

      {frequencies.length > 0 && dayPass && <View style={styles.divider} />}

      {dayPass && (
        <View style={[styles.dayPass, resumeDayPass && styles.dayPassResumed]}>
          <View style={styles.dayPassText}>
            <Text style={styles.dayPassTitle}>Day pass · {formatDollars(DAY_PASS_CENTS)}</Text>
            <Text style={styles.dayPassBody}>
              A full day at {partnerName} — or bring extra guests along. The members' lounge is for members.
            </Text>
          </View>
          <Pressable onPress={() => checkout('day_pass')} style={styles.secondaryBtn} accessibilityRole="button">
            {loading === 'day_pass' ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Text style={styles.secondaryBtnText}>
                {resumeDayPass && user ? 'Continue to payment' : 'Buy a day pass'}
              </Text>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.md,
      padding: spacing.xl,
      gap: spacing.md,
      marginTop: spacing.xxl,
    },
    banner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.primaryContainer,
      borderRadius: radii.sm,
      padding: spacing.md,
    },
    bannerText: {
      flex: 1,
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.onPrimaryContainer,
    },
    heading: {
      fontFamily: fonts.serifBold,
      fontSize: fontSize['2xl'],
      color: colors.neutral,
    },
    lede: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutralVariant,
      marginTop: -spacing.xs,
    },
    pending: { alignSelf: 'flex-start', marginVertical: spacing.md },
    segment: {
      flexDirection: 'row',
      alignSelf: 'flex-start',
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.sm,
      padding: 2,
    },
    segmentItem: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: radii.sm - 2,
    },
    segmentItemOn: { backgroundColor: colors.primary },
    segmentText: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.md,
      color: colors.neutral,
    },
    segmentTextOn: { color: colors.onPrimary },
    tiers: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    tier: {
      flexGrow: 1,
      flexBasis: 150,
      gap: spacing.xs,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.sm,
    },
    tierOn: { backgroundColor: colors.primary, borderColor: colors.primary },
    tierName: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.md,
      color: colors.neutral,
    },
    tierPrice: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.xl,
      color: colors.neutral,
    },
    tierPer: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
    },
    tierTextOn: { color: colors.onPrimary },
    error: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.error,
    },
    summary: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutral,
    },
    primaryBtn: {
      alignSelf: 'flex-start',
      minWidth: 200,
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: radii.sm,
    },
    primaryBtnText: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.base,
      color: colors.onPrimary,
    },
    divider: {
      height: 1,
      backgroundColor: colors.outlineVariant,
      marginVertical: spacing.xs,
    },
    dayPass: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: spacing.md,
    },
    dayPassResumed: {
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: radii.sm,
      padding: spacing.md,
    },
    dayPassText: { flex: 1, minWidth: 220, gap: spacing.xs },
    dayPassTitle: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.lg,
      color: colors.neutral,
    },
    dayPassBody: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutralVariant,
    },
    secondaryBtn: {
      minWidth: 150,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.primary,
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.sm,
    },
    secondaryBtnText: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.md,
      color: colors.primary,
    },
  });
}

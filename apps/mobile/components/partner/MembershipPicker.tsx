/**
 * Pay-what-you-can membership picker shown under a partner's membership tab
 * (see `joinTab` in constants/partnerMenus.ts): monthly or one-time, $10–$100
 * presets or any amount above $10, plus a fixed-price day pass.
 *
 * Signed-out visitors are sent to sign-in and brought back with their choice
 * in the query string. Query params are applied after mount so the static
 * export and the client's first render match.
 *
 * Only offers what the partner has set up (`membership_options`): monthly
 * needs a Square plan, and nothing is offered until memberships are switched
 * on and Square is connected — the card then points people to join in person.
 */
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { fonts, fontSize, radii, spacing, useTheme, type ThemeColors } from '@/constants/theme';
import { useAuth } from '@/lib/auth';
import { routes } from '@/lib/navigation';
import { useFlexCheckout, useMembershipOptions, type FlexCheckoutKind } from '@/hooks/useSquareBookings';
import { useAccountRefresh, useMyPayments } from '@/hooks/useMyAccount';
import {
  AMOUNT_PRESETS_CENTS,
  DAY_PASS_CENTS,
  formatDollars,
  parseCustomAmount,
  summaryLine,
  type MembershipFrequency,
} from '@/lib/partners/payWhatYouCan';

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
  const params = useLocalSearchParams<{ kind?: string; amount?: string; status?: string }>();
  const { create, loading, error: checkoutError } = useFlexCheckout(partnerId);
  const options = useMembershipOptions(partnerId);

  const [frequency, setFrequency] = useState<MembershipFrequency>('monthly');
  const [presetCents, setPresetCents] = useState<number | null>(null);
  const [customText, setCustomText] = useState('');
  const [amountError, setAmountError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [landedAt] = useState(() => Date.now());
  const { payments } = useMyPayments();
  const { refresh } = useAccountRefresh();

  // Restore a choice carried through sign-in, and the post-checkout banner.
  useEffect(() => {
    if (params.kind === 'monthly' || params.kind === 'one_time') setFrequency(params.kind);
    const cents = Number(params.amount);
    if (Number.isInteger(cents) && cents > 0) {
      if (AMOUNT_PRESETS_CENTS.includes(cents)) setPresetCents(cents);
      else setCustomText(String(cents / 100));
    }
    setPaid(params.status === 'paid');
  }, [params.kind, params.amount, params.status]);

  function selectedCents(): { cents: number } | { error: string } {
    if (customText.trim()) return parseCustomAmount(customText);
    if (presetCents != null) return { cents: presetCents };
    return { error: 'Choose an amount, or enter your own' };
  }

  // Offer only the frequencies that will work; fall back if the chosen (or
  // restored) one isn't available.
  const frequencies = (['monthly', 'one_time'] as const).filter((f) =>
    f === 'monthly' ? options?.monthly : options?.one_time,
  );
  const activeFrequency: MembershipFrequency = frequencies.includes(frequency)
    ? frequency
    : (frequencies[0] ?? frequency);
  const dayPass = options?.day_pass ?? false;

  const selection = selectedCents();
  const summary = 'cents' in selection ? summaryLine(activeFrequency, selection.cents) : null;

  async function checkout(kind: FlexCheckoutKind, cents?: number) {
    if (!user) {
      const back =
        `${routes.partners.tab(partnerSlug, joinTab) as string}` +
        (kind === 'day_pass' ? '' : `?kind=${kind}&amount=${cents ?? ''}`);
      router.push(`${routes.auth.signIn() as string}?redirect=${encodeURIComponent(back)}` as never);
      return;
    }
    const result = await create(kind, cents);
    if (result?.checkout_url) Linking.openURL(result.checkout_url);
  }

  function handleJoin() {
    const sel = selectedCents();
    if ('error' in sel) {
      setAmountError(sel.error);
      return;
    }
    checkout(activeFrequency, sel.cents);
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
    <View style={styles.card} nativeID="join">
      {banner}

      {frequencies.length > 0 && (
        <>
          <Text style={styles.heading}>Choose your membership</Text>
          <Text style={styles.lede}>
            {frequencies.length > 1
              ? 'Pick monthly or one-time, then choose what you can pay.'
              : `${activeFrequency === 'monthly' ? 'Monthly' : 'One-time'} membership. Choose what you can pay.`}
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

          <View style={styles.amounts} accessibilityRole="radiogroup" accessibilityLabel="Amount">
            {AMOUNT_PRESETS_CENTS.map((cents) => {
              const on = presetCents === cents && !customText.trim();
              return (
                <Pressable
                  key={cents}
                  onPress={() => {
                    setPresetCents(cents);
                    setCustomText('');
                    setAmountError(null);
                  }}
                  style={StyleSheet.flatten([styles.amount, on && styles.amountOn])}
                  accessibilityRole="radio"
                  aria-checked={on}
                  accessibilityLabel={formatDollars(cents)}
                >
                  <Text style={StyleSheet.flatten([styles.amountText, on && styles.amountTextOn])}>
                    {formatDollars(cents)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.label}>Other amount</Text>
          <View style={StyleSheet.flatten([styles.inputWrap, customText.trim() ? styles.inputWrapOn : null])}>
            <Text style={styles.inputPrefix}>$</Text>
            <TextInput
              value={customText}
              onChangeText={(t) => {
                setCustomText(t);
                setAmountError(null);
              }}
              placeholder="25"
              placeholderTextColor={colors.neutralVariant}
              keyboardType="decimal-pad"
              inputMode="decimal"
              style={styles.input}
              accessibilityLabel="Other amount, in dollars"
            />
          </View>
          {amountError && <Text style={styles.error}>{amountError}</Text>}

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
        <View style={styles.dayPass}>
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
              <Text style={styles.secondaryBtnText}>Buy a day pass</Text>
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
    amounts: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    amount: {
      minWidth: 64,
      alignItems: 'center',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.sm,
    },
    amountOn: { backgroundColor: colors.primary, borderColor: colors.primary },
    amountText: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.base,
      color: colors.neutral,
    },
    amountTextOn: { color: colors.onPrimary },
    label: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.sm,
      color: colors.neutralVariant,
    },
    inputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      maxWidth: 200,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.sm,
      paddingHorizontal: spacing.md,
      marginTop: -spacing.xs,
    },
    inputWrapOn: { borderColor: colors.primary },
    inputPrefix: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.base,
      color: colors.neutralVariant,
    },
    input: {
      flex: 1,
      fontFamily: fonts.sans,
      fontSize: fontSize.base,
      color: colors.neutral,
      paddingVertical: spacing.sm,
      paddingLeft: spacing.xs,
    },
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

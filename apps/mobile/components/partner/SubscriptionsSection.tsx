/**
 * Public-facing subscriptions section for partner landing pages.
 * Displays Square subscription plan variations as tier cards and opens
 * a signup modal that creates a Square hosted checkout link.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Linking,
} from 'react-native';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import {
  useTheme,
  fonts,
  fontSize,
  spacing,
  radii,
  breakpoints,
  type ThemeColors,
} from '@/constants/theme';
import {
  useSquareSubscriptionPlans,
  useCreateSubscriptionCheckout,
  type SquareSubscriptionPlan,
} from '@/hooks/useSquareBookings';
import { useHydratedDimensions } from '@/hooks/useHydrated';
import { useAuth } from '@/lib/auth';
import { SectionHeading } from './SectionHeading';

interface SubscriptionsSectionProps {
  partnerId: string;
}

function formatPrice(amount: number | undefined): string {
  if (amount == null) return '';
  return `$${Math.round(amount / 100)}`;
}

function inferTier(name: string | null | undefined): 'individual' | 'couple' | 'family' | undefined {
  if (!name) return undefined;
  const n = name.toLowerCase();
  if (n.includes('family')) return 'family';
  if (n.includes('couple')) return 'couple';
  if (n.includes('individual')) return 'individual';
  return undefined;
}

function tierDescription(tier: string | undefined): string {
  switch (tier) {
    case 'individual':
      return '1 person';
    case 'couple':
      return '2 adults';
    case 'family':
      return 'Up to 4, same household';
    default:
      return '';
  }
}

export function SubscriptionsSection({ partnerId }: SubscriptionsSectionProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const { width } = useHydratedDimensions();
  const columns = width >= breakpoints.desktop ? 3 : width >= breakpoints.tablet ? 2 : 1;
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { plans, loading } = useSquareSubscriptionPlans(partnerId);
  const { user } = useAuth();
  const { create, loading: checkoutLoading, error: checkoutError } = useCreateSubscriptionCheckout(partnerId);
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);

  // Signed-out visitors come back from sign-in to this page with ?join=<plan>.
  // Read it after mount (the first render must match the static export), then
  // bring the chosen plan into view so they can carry on.
  const pathname = usePathname();
  const params = useLocalSearchParams<{ join?: string }>();
  const [resumePlanId, setResumePlanId] = useState<string | null>(null);
  const sectionRef = useRef<View>(null);
  useEffect(() => {
    setResumePlanId(typeof params.join === 'string' ? params.join : null);
  }, [params.join]);
  const resumeReady = resumePlanId != null && plans.some((p) => p.square_id === resumePlanId);
  useEffect(() => {
    if (!resumeReady) return;
    const el = sectionRef.current as unknown as { scrollIntoView?: (o: object) => void } | null;
    el?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
    // The screen may still be transitioning in, or content above still
    // loading and pushing this down: settle once more.
    const settle = setTimeout(() => el?.scrollIntoView?.({ block: 'start' }), 1000);
    return () => clearTimeout(settle);
  }, [resumeReady]);

  async function handleJoin(plan: SquareSubscriptionPlan) {
    const name = plan.data.subscription_plan_variation_data?.name ?? plan.display_name ?? '';
    const tier = inferTier(name);
    if (!user) {
      const redirect = `${pathname}?join=${encodeURIComponent(plan.square_id)}`;
      router.push(`/sign-in?redirect=${encodeURIComponent(redirect)}` as any);
      return;
    }
    setPendingPlanId(plan.square_id);
    try {
      const result = await create({ plan_variation_id: plan.square_id, tier });
      if (result?.checkout_url) {
        Linking.openURL(result.checkout_url);
      }
    } finally {
      setPendingPlanId(null);
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </View>
    );
  }

  if (plans.length === 0) return null;

  return (
    <View style={styles.container} ref={sectionRef}>
      <View style={styles.inner}>
        <SectionHeading title="Join the Community" lede="Become a member with a monthly subscription." />

        <View style={styles.grid}>
          {plans.map((plan) => {
            const v = plan.data.subscription_plan_variation_data;
            const firstPhase = v?.phases?.[0];
            const price = firstPhase?.pricing?.price?.amount;
            const name = v?.name ?? plan.display_name ?? 'Membership';
            const tier = inferTier(name);

            return (
              <View
                key={plan.square_id}
                style={{
                  width: columns === 1 ? '100%' : (`${(100 - (columns - 1) * 1.5) / columns}%` as any),
                }}
              >
                <View style={[styles.card, resumePlanId === plan.square_id && styles.cardResumed]}>
                  <Text style={styles.tierName}>{name}</Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>{formatPrice(price)}</Text>
                    <Text style={styles.cadence}>/ month</Text>
                  </View>
                  {tierDescription(tier) ? (
                    <Text style={styles.desc}>{tierDescription(tier)}</Text>
                  ) : null}
                  <Pressable
                    style={styles.joinBtn}
                    onPress={() => handleJoin(plan)}
                    disabled={checkoutLoading && pendingPlanId === plan.square_id}
                  >
                    {checkoutLoading && pendingPlanId === plan.square_id ? (
                      <ActivityIndicator color={colors.onPrimary} />
                    ) : (
                      <Text style={styles.joinBtnText}>
                        {!user ? 'Sign in to join' : resumePlanId === plan.square_id ? 'Continue to payment' : 'Join'}
                      </Text>
                    )}
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
        {checkoutError && <Text style={styles.error}>{checkoutError}</Text>}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxxl + 16,
      backgroundColor: colors.surface,
    },
    inner: {
      maxWidth: 1000,
      alignSelf: 'center',
      width: '100%' as any,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
    },
    card: {
      flex: 1,
      backgroundColor: colors.surfaceContainer,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radii.md,
      padding: spacing.xl,
      gap: spacing.md,
    },
    cardResumed: {
      borderColor: colors.primary,
    },
    tierName: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.xl,
      color: colors.neutral,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: spacing.xs,
    },
    price: {
      fontFamily: fonts.sansBold,
      fontSize: 36,
      color: colors.primary,
      lineHeight: 40,
    },
    cadence: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutralVariant,
      marginBottom: 6,
    },
    desc: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.neutralVariant,
    },
    joinBtn: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.sm + 2,
      borderRadius: radii.sm,
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    joinBtnText: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.md,
      color: colors.onPrimary,
    },
    error: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.error,
      marginTop: spacing.md,
    },
  });

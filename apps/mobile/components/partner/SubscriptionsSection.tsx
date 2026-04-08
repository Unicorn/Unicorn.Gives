/**
 * Public-facing subscriptions section for partner landing pages.
 * Displays Square subscription plan variations as tier cards and opens
 * a signup modal that creates a Square hosted checkout link.
 */
import { useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
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

  async function handleJoin(plan: SquareSubscriptionPlan) {
    const name = plan.data.subscription_plan_variation_data?.name ?? plan.display_name ?? '';
    const tier = inferTier(name);
    if (!user) {
      const redirect = `/partners?join=${encodeURIComponent(plan.square_id)}`;
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
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.heading}>Join the Community</Text>
        <Text style={styles.subheading}>Become a member with a monthly subscription</Text>

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
                <View style={styles.card}>
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
                      <Text style={styles.joinBtnText}>{user ? 'Join' : 'Sign in to join'}</Text>
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
    heading: {
      fontFamily: fonts.sansBold,
      fontSize: 32,
      color: colors.neutral,
      marginBottom: spacing.xs,
    },
    subheading: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutralVariant,
      marginBottom: spacing.xxl,
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

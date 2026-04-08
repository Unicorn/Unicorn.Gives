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
  Modal,
  TextInput,
  Linking,
} from 'react-native';
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
  const { width } = useHydratedDimensions();
  const columns = width >= breakpoints.desktop ? 3 : width >= breakpoints.tablet ? 2 : 1;
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { plans, loading } = useSquareSubscriptionPlans(partnerId);
  const [selected, setSelected] = useState<SquareSubscriptionPlan | null>(null);

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
                  <Pressable style={styles.joinBtn} onPress={() => setSelected(plan)}>
                    <Text style={styles.joinBtnText}>Join</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {selected && (
        <SubscriptionCheckoutModal
          partnerId={partnerId}
          plan={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </View>
  );
}

/* ── Checkout modal ── */

interface ModalProps {
  partnerId: string;
  plan: SquareSubscriptionPlan;
  onClose: () => void;
}

function SubscriptionCheckoutModal({ partnerId, plan, onClose }: ModalProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createModalStyles(colors), [colors]);
  const { create, loading, error } = useCreateSubscriptionCheckout(partnerId);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const planName = plan.data.subscription_plan_variation_data?.name ?? plan.display_name ?? 'Membership';
  const tier = inferTier(planName);

  async function handleSubmit() {
    if (!firstName.trim() || !email.trim()) return;
    const result = await create({
      plan_variation_id: plan.square_id,
      tier,
      customer: {
        given_name: firstName.trim(),
        family_name: lastName.trim() || undefined,
        email_address: email.trim(),
      },
    });
    if (result?.checkout_url) {
      Linking.openURL(result.checkout_url);
      onClose();
    }
  }

  const canSubmit = firstName.trim().length > 0 && email.trim().length > 0 && !loading;

  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.panel}>
          <Text style={styles.title}>Join: {planName}</Text>
          <Text style={styles.subtitle}>Enter your details to continue to secure checkout.</Text>

          <TextInput
            style={styles.input}
            placeholder="First name"
            placeholderTextColor={colors.neutralVariant}
            value={firstName}
            onChangeText={setFirstName}
            autoComplete="given-name"
          />
          <TextInput
            style={styles.input}
            placeholder="Last name (optional)"
            placeholderTextColor={colors.neutralVariant}
            value={lastName}
            onChangeText={setLastName}
            autoComplete="family-name"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.neutralVariant}
            value={email}
            onChangeText={setEmail}
            autoComplete="email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.actions}>
            <Pressable style={styles.cancelBtn} onPress={onClose} disabled={loading}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={!canSubmit}
            >
              {loading ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={styles.submitBtnText}>Continue to payment</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
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
  });

const createModalStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    panel: {
      width: '100%' as any,
      maxWidth: 440,
      backgroundColor: colors.surface,
      borderRadius: radii.md,
      padding: spacing.xl,
      gap: spacing.md,
    },
    title: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.xl,
      color: colors.neutral,
    },
    subtitle: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.neutralVariant,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radii.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutral,
      backgroundColor: colors.surfaceContainer,
    },
    error: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.error,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    cancelBtn: {
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.sm,
    },
    cancelBtnText: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.md,
      color: colors.neutralVariant,
    },
    submitBtn: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.sm,
    },
    submitBtnDisabled: {
      opacity: 0.5,
    },
    submitBtnText: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.md,
      color: colors.onPrimary,
    },
  });

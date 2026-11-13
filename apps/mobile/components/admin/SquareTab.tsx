/**
 * Admin tab for managing a partner's Square integration.
 * Shows connection status, feature toggles, location picker, and sync controls.
 */
import { View, Text, Pressable, ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSquareConnection } from '@/hooks/useSquareConnection';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';
import { useMemo, useState } from 'react';
import { formatDollars, parseDollars, type CachedTier } from '@/lib/partners/membershipPricing';

interface SquareTabProps {
  partnerId: string;
}

export function SquareTab({ partnerId }: SquareTabProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const {
    connection,
    featureConfig,
    loading,
    syncing,
    error,
    startOAuth,
    disconnect,
    updateFeature,
    updateLocation,
    syncNow,
    tiers,
    createMembershipPlan,
  } = useSquareConnection(partnerId);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Loading Square integration...</Text>
      </View>
    );
  }

  // Not connected
  if (!connection) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="store" size={24} color={colors.neutralVariant} />
            <Text style={styles.cardTitle}>Connect Square</Text>
          </View>
          <Text style={styles.cardBody}>
            Connect this partner's Square account to enable bookings, subscriptions, retail, and gift card features on their page.
          </Text>
          <Pressable style={styles.connectBtn} onPress={startOAuth}>
            <MaterialIcons name="link" size={18} color="#fff" />
            <Text style={styles.connectBtnText}>Connect Square Account</Text>
          </Pressable>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </View>
    );
  }

  // Connected
  return (
    <View style={styles.container}>
      {/* Connection Status */}
      <View style={styles.card}>
        <View style={styles.statusRow}>
          <View style={styles.statusLeft}>
            <View style={styles.statusDot} />
            <View>
              <Text style={styles.statusLabel}>Connected</Text>
              <Text style={styles.statusMerchant}>Merchant: {connection.merchant_id}</Text>
            </View>
          </View>
          <View style={styles.statusActions}>
            <Pressable style={styles.syncBtn} onPress={syncNow} disabled={syncing}>
              {syncing ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <MaterialIcons name="sync" size={16} color={colors.primary} />
              )}
              <Text style={styles.syncBtnText}>{syncing ? 'Syncing...' : 'Sync Now'}</Text>
            </Pressable>
            <Pressable style={styles.disconnectBtn} onPress={disconnect}>
              <Text style={styles.disconnectBtnText}>Disconnect</Text>
            </Pressable>
          </View>
        </View>
        {featureConfig?.last_synced_at && (
          <Text style={styles.lastSynced}>
            Last synced: {new Date(featureConfig.last_synced_at).toLocaleString()}
          </Text>
        )}
      </View>

      {/* Location Selector */}
      {connection.location_ids.length > 1 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationList}>
            {connection.location_ids.map((loc) => (
              <Pressable
                key={loc.id}
                style={[
                  styles.locationItem,
                  connection.location_id === loc.id && styles.locationItemActive,
                ]}
                onPress={() => updateLocation(loc.id)}
              >
                <MaterialIcons
                  name={connection.location_id === loc.id ? 'radio-button-checked' : 'radio-button-unchecked'}
                  size={18}
                  color={connection.location_id === loc.id ? colors.primary : colors.neutralVariant}
                />
                <Text style={[
                  styles.locationName,
                  connection.location_id === loc.id && styles.locationNameActive,
                ]}>
                  {loc.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Feature Toggles */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Features</Text>
        <Text style={styles.sectionHint}>
          Enable features to show on the partner's public page. Synced data from Square will appear in the corresponding section.
        </Text>

        <FeatureToggle
          label="Bookings"
          description="Show available services and let customers book appointments"
          enabled={featureConfig?.bookings_enabled ?? false}
          onToggle={(v) => updateFeature('bookings_enabled', v)}
          icon="event"
          colors={colors}
          styles={styles}
        />
        <FeatureToggle
          label="Memberships"
          description="Sell memberships and day passes online. Memberships also need tiers (below)."
          enabled={featureConfig?.subscriptions_enabled ?? false}
          onToggle={(v) => updateFeature('subscriptions_enabled', v)}
          icon="autorenew"
          colors={colors}
          styles={styles}
        />
        <FeatureToggle
          label="Retail / Shop"
          description="Show products from the Square catalog"
          enabled={featureConfig?.retail_enabled ?? false}
          onToggle={(v) => updateFeature('retail_enabled', v)}
          icon="storefront"
          colors={colors}
          styles={styles}
          disabled
          disabledLabel="Coming soon"
        />
        <FeatureToggle
          label="Gift Cards"
          description="Allow customers to purchase and check gift card balances"
          enabled={featureConfig?.gift_cards_enabled ?? false}
          onToggle={(v) => updateFeature('gift_cards_enabled', v)}
          icon="card-giftcard"
          colors={colors}
          styles={styles}
          disabled
          disabledLabel="Coming soon"
        />
      </View>

      <MembershipTiersCard
        tiers={tiers}
        hasPlan={Boolean(featureConfig?.membership_plan_id)}
        onCreate={createMembershipPlan}
        colors={colors}
        styles={styles}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

/* ── Membership Tiers ── */

interface TierRowDraft {
  key: number;
  name: string;
  price: string;
}

let nextTierKey = 0;
const blankTier = (): TierRowDraft => ({ key: nextTierKey++, name: '', price: '' });

function MembershipTiersCard({
  tiers,
  hasPlan,
  onCreate,
  colors,
  styles,
}: {
  tiers: CachedTier[];
  hasPlan: boolean;
  onCreate: (planName: string, drafts: Array<{ name: string; amountCents: number }>) => Promise<string | null>;
  colors: ThemeColors;
  styles: ReturnType<typeof createStyles>;
}) {
  const [editing, setEditing] = useState(false);
  const [planName, setPlanName] = useState('Membership');
  const [rows, setRows] = useState<TierRowDraft[]>(() => [blankTier()]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const showForm = editing || tiers.length === 0;

  function updateRow(key: number, patch: Partial<TierRowDraft>) {
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)));
    setFormError(null);
  }

  async function submit() {
    const drafts: Array<{ name: string; amountCents: number }> = [];
    for (const r of rows) {
      const cents = parseDollars(r.price);
      if (!r.name.trim()) return setFormError('Every tier needs a name');
      if (cents == null) return setFormError(`${r.name.trim()}: enter a monthly price, like 50`);
      drafts.push({ name: r.name.trim(), amountCents: cents });
    }
    setSaving(true);
    const err = await onCreate(planName, drafts);
    setSaving(false);
    if (err) {
      setFormError(err);
    } else {
      setEditing(false);
      setRows([blankTier()]);
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Membership tiers</Text>
      {tiers.length > 0 ? (
        <>
          <Text style={styles.sectionHint}>
            Members choose one of these, monthly or one-time. Prices come from Square.
          </Text>
          <View style={styles.tierList}>
            {tiers.map((t) => (
              <View key={t.id} style={styles.tierRow}>
                <Text style={styles.tierName}>{t.name}</Text>
                <Text style={styles.tierPrice}>
                  {t.amount_cents != null ? `${formatDollars(t.amount_cents)} / month` : 'No fixed price — not sold online'}
                </Text>
              </View>
            ))}
          </View>
          {!editing && (
            <Pressable style={styles.linkBtn} onPress={() => setEditing(true)} accessibilityRole="button">
              <Text style={styles.linkBtnText}>Create new tiers</Text>
            </Pressable>
          )}
        </>
      ) : (
        <Text style={styles.sectionHint}>
          {hasPlan
            ? 'The membership plan has no tiers synced yet. Press Sync Now, or create new tiers.'
            : 'Create the tiers members choose from, such as Individual, Couple and Household. They’re created in Square as fixed monthly prices, which Square’s dashboard can’t make.'}
        </Text>
      )}

      {showForm && (
        <View style={styles.tierForm}>
          {tiers.length > 0 && (
            <Text style={styles.sectionHint}>
              New tiers replace these for new sign-ups. Current members keep billing at their price. Square can’t change a tier’s price once it exists.
            </Text>
          )}
          <Text style={styles.fieldLabel}>Plan name (shown only in Square)</Text>
          <TextInput
            value={planName}
            onChangeText={setPlanName}
            style={styles.input}
            accessibilityLabel="Plan name"
          />
          <Text style={styles.fieldLabel}>Tiers</Text>
          {rows.map((r, i) => (
            <View key={r.key} style={styles.tierInputRow}>
              <TextInput
                value={r.name}
                onChangeText={(name) => updateRow(r.key, { name })}
                placeholder="Individual"
                placeholderTextColor={colors.neutralVariant}
                style={[styles.input, styles.tierNameInput]}
                accessibilityLabel={`Tier ${i + 1} name`}
              />
              <View style={styles.priceInputWrap}>
                <Text style={styles.pricePrefix}>$</Text>
                <TextInput
                  value={r.price}
                  onChangeText={(price) => updateRow(r.key, { price })}
                  placeholder="50"
                  placeholderTextColor={colors.neutralVariant}
                  keyboardType="decimal-pad"
                  inputMode="decimal"
                  style={styles.priceInput}
                  accessibilityLabel={`Tier ${i + 1} monthly price, in dollars`}
                />
                <Text style={styles.pricePer}>/ month</Text>
              </View>
              {rows.length > 1 && (
                <Pressable
                  onPress={() => setRows((prev) => prev.filter((x) => x.key !== r.key))}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove tier ${i + 1}`}
                  hitSlop={8}
                >
                  <MaterialIcons name="close" size={18} color={colors.neutralVariant} />
                </Pressable>
              )}
            </View>
          ))}
          <Pressable style={styles.linkBtn} onPress={() => setRows((prev) => [...prev, blankTier()])} accessibilityRole="button">
            <Text style={styles.linkBtnText}>Add a tier</Text>
          </Pressable>
          {formError && <Text style={styles.errorText}>{formError}</Text>}
          <View style={styles.formActions}>
            <Pressable style={styles.connectBtn} onPress={submit} disabled={saving} accessibilityRole="button">
              {saving ? (
                <ActivityIndicator size="small" color={colors.onPrimary} />
              ) : (
                <Text style={styles.connectBtnText}>
                  Create {rows.length} {rows.length === 1 ? 'tier' : 'tiers'} in Square
                </Text>
              )}
            </Pressable>
            {editing && (
              <Pressable style={styles.disconnectBtn} onPress={() => { setEditing(false); setFormError(null); }} accessibilityRole="button">
                <Text style={styles.disconnectBtnText}>Cancel</Text>
              </Pressable>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

/* ── Feature Toggle Row ── */

function FeatureToggle({
  label,
  description,
  enabled,
  onToggle,
  icon,
  colors,
  styles,
  disabled,
  disabledLabel,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  icon: keyof typeof MaterialIcons.glyphMap;
  colors: ThemeColors;
  styles: ReturnType<typeof createStyles>;
  disabled?: boolean;
  disabledLabel?: string;
}) {
  return (
    <Pressable
      style={[styles.featureRow, disabled && styles.featureRowDisabled]}
      onPress={() => !disabled && onToggle(!enabled)}
      disabled={disabled}
    >
      <View style={styles.featureLeft}>
        <MaterialIcons name={icon} size={20} color={disabled ? colors.outlineVariant : colors.neutralVariant} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Text style={[styles.featureLabel, disabled && styles.featureLabelDisabled]}>{label}</Text>
            {disabled && disabledLabel && (
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>{disabledLabel}</Text>
              </View>
            )}
          </View>
          <Text style={styles.featureDesc}>{description}</Text>
        </View>
      </View>
      <MaterialIcons
        name={enabled ? 'check-box' : 'check-box-outline-blank'}
        size={22}
        color={disabled ? colors.outlineVariant : enabled ? colors.primary : colors.neutralVariant}
      />
    </Pressable>
  );
}

/* ── Styles ── */

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { maxWidth: 800, gap: spacing.lg },
    loadingText: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant, marginTop: spacing.sm },

    card: {
      backgroundColor: colors.surfaceContainer,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radii.md,
      padding: spacing.lg,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
    cardTitle: { fontFamily: fonts.sansBold, fontSize: fontSize.lg, color: colors.neutral },
    cardBody: { fontFamily: fonts.sans, fontSize: fontSize.md, color: colors.neutralVariant, lineHeight: 22, marginBottom: spacing.lg },

    connectBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.sm + 4,
      borderRadius: radii.sm,
      alignSelf: 'flex-start',
    },
    connectBtnText: { fontFamily: fonts.sansMedium, fontSize: fontSize.md, color: colors.onPrimary },

    statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: spacing.md },
    statusLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#22c55e' },
    statusLabel: { fontFamily: fonts.sansBold, fontSize: fontSize.md, color: colors.neutral },
    statusMerchant: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant },
    statusActions: { flexDirection: 'row', gap: spacing.sm },
    lastSynced: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant, marginTop: spacing.md },

    syncBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: radii.sm,
    },
    syncBtnText: { fontFamily: fonts.sansMedium, fontSize: fontSize.sm, color: colors.primary },

    disconnectBtn: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.sm,
    },
    disconnectBtnText: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant },

    sectionTitle: { fontFamily: fonts.sansBold, fontSize: fontSize.md, color: colors.neutral, marginBottom: 4 },
    sectionHint: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant, marginBottom: spacing.lg },

    locationList: { gap: spacing.sm },
    locationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.xs + 2,
      paddingHorizontal: spacing.sm,
      borderRadius: radii.sm,
    },
    locationItemActive: { backgroundColor: colors.surface },
    locationName: { fontFamily: fonts.sans, fontSize: fontSize.md, color: colors.neutralVariant },
    locationNameActive: { fontFamily: fonts.sansMedium, color: colors.neutral },

    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    featureRowDisabled: { opacity: 0.5 },
    featureLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, flex: 1, marginRight: spacing.md },
    featureLabel: { fontFamily: fonts.sansMedium, fontSize: fontSize.md, color: colors.neutral },
    featureLabelDisabled: { color: colors.neutralVariant },
    featureDesc: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant, marginTop: 2 },

    comingSoonBadge: {
      backgroundColor: colors.outlineVariant,
      paddingHorizontal: spacing.sm,
      paddingVertical: 1,
      borderRadius: radii.sm,
    },
    comingSoonText: { fontFamily: fonts.sans, fontSize: fontSize.xs, color: colors.neutralVariant },

    errorText: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.error, marginTop: spacing.sm },

    tierList: { gap: spacing.xs, marginBottom: spacing.md },
    tierRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    tierName: { fontFamily: fonts.sansMedium, fontSize: fontSize.md, color: colors.neutral },
    tierPrice: { fontFamily: fonts.sans, fontSize: fontSize.md, color: colors.neutralVariant },
    tierForm: { gap: spacing.sm, marginTop: spacing.sm },
    fieldLabel: { fontFamily: fonts.sansMedium, fontSize: fontSize.sm, color: colors.neutralVariant, marginTop: spacing.xs },
    input: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutral,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    tierInputRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.sm },
    tierNameInput: { flexGrow: 1, flexBasis: 180 },
    priceInputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.sm,
      paddingHorizontal: spacing.md,
    },
    pricePrefix: { fontFamily: fonts.sansMedium, fontSize: fontSize.md, color: colors.neutralVariant },
    priceInput: {
      width: 80,
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutral,
      paddingVertical: spacing.sm,
      paddingLeft: spacing.xs,
    },
    pricePer: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant },
    linkBtn: { alignSelf: 'flex-start', paddingVertical: spacing.xs },
    linkBtnText: { fontFamily: fonts.sansMedium, fontSize: fontSize.sm, color: colors.primary },
    formActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  });

/**
 * Admin tab for managing a partner's Square integration.
 * Shows connection status, feature toggles, location picker, and sync controls.
 */
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSquareConnection, type SquareFeatureConfig } from '@/hooks/useSquareConnection';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';
import { useMemo } from 'react';

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
          label="Subscriptions"
          description="Display subscription plans for recurring memberships"
          enabled={featureConfig?.subscriptions_enabled ?? false}
          onToggle={(v) => updateFeature('subscriptions_enabled', v)}
          icon="autorenew"
          colors={colors}
          styles={styles}
          disabled
          disabledLabel="Coming soon"
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

      {error && <Text style={styles.errorText}>{error}</Text>}
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

    errorText: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: '#dc2626', marginTop: spacing.sm },
  });

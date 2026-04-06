/**
 * Public-facing bookings section for partner landing pages.
 * Displays available services synced from Square and opens the booking flow.
 */
import { useMemo, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';
import { useSquareServices, type SquareService } from '@/hooks/useSquareBookings';
import { BookingFlow } from './BookingFlow';

interface BookingsSectionProps {
  partnerId: string;
}

function formatDuration(ms: number | undefined): string {
  if (!ms) return '';
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`;
}

function formatPrice(amount: number | undefined, _currency?: string): string {
  if (amount == null) return '';
  const dollars = (amount / 100).toFixed(2);
  return `$${dollars}`;
}

export function BookingsSection({ partnerId }: BookingsSectionProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { services, teamMembers, loading } = useSquareServices(partnerId);
  const [selectedService, setSelectedService] = useState<SquareService | null>(null);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </View>
    );
  }

  if (services.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.heading}>Book an Appointment</Text>
        <Text style={styles.subheading}>Select a service to get started</Text>

        <View style={styles.serviceList}>
          {services.map((service) => {
            const variation = service.data.item_data?.variations?.[0];
            const price = variation?.item_variation_data?.price_money;
            const duration = variation?.item_variation_data?.service_duration;

            return (
              <View key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>
                    {service.data.item_data?.name ?? service.display_name}
                  </Text>
                  <View style={styles.serviceMeta}>
                    {duration != null && (
                      <View style={styles.metaItem}>
                        <MaterialIcons name="schedule" size={14} color={colors.neutralVariant} />
                        <Text style={styles.metaText}>{formatDuration(duration)}</Text>
                      </View>
                    )}
                    {price?.amount != null && (
                      <View style={styles.metaItem}>
                        <Text style={styles.priceText}>
                          {formatPrice(price.amount, price.currency)}
                        </Text>
                      </View>
                    )}
                  </View>
                  {service.data.item_data?.description && (
                    <Text style={styles.serviceDesc} numberOfLines={2}>
                      {service.data.item_data.description}
                    </Text>
                  )}
                </View>
                <Pressable
                  style={styles.bookBtn}
                  onPress={() => setSelectedService(service)}
                >
                  <Text style={styles.bookBtnText}>Book</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      </View>

      {selectedService && (
        <BookingFlow
          partnerId={partnerId}
          service={selectedService}
          teamMembers={teamMembers}
          onClose={() => setSelectedService(null)}
        />
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxxl + 16,
      backgroundColor: colors.surfaceContainer,
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
    serviceList: {
      gap: spacing.md,
    },
    serviceCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radii.md,
      padding: spacing.lg,
      gap: spacing.lg,
    },
    serviceInfo: {
      flex: 1,
    },
    serviceName: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.lg,
      color: colors.neutral,
    },
    serviceMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginTop: spacing.xs,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.neutralVariant,
    },
    priceText: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.md,
      color: colors.primary,
    },
    serviceDesc: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.neutralVariant,
      lineHeight: 20,
      marginTop: spacing.xs,
    },
    bookBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.sm + 2,
      borderRadius: radii.sm,
    },
    bookBtnText: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.md,
      color: colors.onPrimary,
    },
  });

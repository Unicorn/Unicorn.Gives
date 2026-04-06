/**
 * Multi-step booking modal for scheduling Square appointments.
 *
 * Steps:
 * 1. Select staff member (optional)
 * 2. Pick date
 * 3. Pick time slot (real-time availability)
 * 4. Enter customer details
 * 5. Confirm booking
 */
import { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';
import {
  useSquareAvailability,
  useCreateBooking,
  type SquareService,
  type SquareTeamMember,
  type BookingCustomer,
} from '@/hooks/useSquareBookings';

type Step = 'staff' | 'date' | 'time' | 'details' | 'confirm' | 'success';

interface BookingFlowProps {
  partnerId: string;
  service: SquareService;
  teamMembers: SquareTeamMember[];
  onClose: () => void;
}

function getNextDays(count: number): Date[] {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function BookingFlow({ partnerId, service, teamMembers, onClose }: BookingFlowProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [step, setStep] = useState<Step>(teamMembers.length > 0 ? 'staff' : 'date');
  const [selectedStaff, setSelectedStaff] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [customer, setCustomer] = useState<BookingCustomer>({
    given_name: '',
    family_name: '',
    email_address: '',
    phone_number: '',
  });
  const [note, setNote] = useState('');

  const variation = service.data.item_data?.variations?.[0];
  const variationId = variation?.id ?? '';

  // Availability search for the selected date
  const startAt = selectedDate
    ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()).toISOString()
    : undefined;
  const endAt = selectedDate
    ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59).toISOString()
    : undefined;

  const {
    slots,
    loading: slotsLoading,
  } = useSquareAvailability(
    step === 'time' ? partnerId : undefined,
    variationId,
    startAt,
    endAt,
    selectedStaff,
  );

  const { create, loading: bookingLoading, error: bookingError, booking } = useCreateBooking(partnerId);

  const handleSubmit = useCallback(async () => {
    if (!selectedSlot || !customer.given_name) return;
    const result = await create({
      service_variation_id: variationId,
      team_member_id: selectedStaff,
      start_at: selectedSlot,
      customer,
      note: note || undefined,
    });
    if (result) setStep('success');
  }, [selectedSlot, customer, variationId, selectedStaff, note, create]);

  const days = useMemo(() => getNextDays(14), []);

  const serviceName = service.data.item_data?.name ?? service.display_name ?? 'Service';

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Book: {serviceName}</Text>
              <Text style={styles.headerSub}>
                {step === 'staff' && 'Select a staff member'}
                {step === 'date' && 'Choose a date'}
                {step === 'time' && 'Pick a time'}
                {step === 'details' && 'Your information'}
                {step === 'confirm' && 'Review & confirm'}
                {step === 'success' && 'Booking confirmed!'}
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <MaterialIcons name="close" size={24} color={colors.neutralVariant} />
            </Pressable>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
            {/* Step: Staff */}
            {step === 'staff' && (
              <View style={styles.stepContent}>
                <Pressable
                  style={[styles.optionCard, !selectedStaff && styles.optionCardActive]}
                  onPress={() => { setSelectedStaff(undefined); setStep('date'); }}
                >
                  <MaterialIcons name="people" size={20} color={colors.neutralVariant} />
                  <Text style={styles.optionText}>Any available</Text>
                </Pressable>
                {teamMembers.map((member) => (
                  <Pressable
                    key={member.square_id}
                    style={[styles.optionCard, selectedStaff === member.square_id && styles.optionCardActive]}
                    onPress={() => { setSelectedStaff(member.square_id); setStep('date'); }}
                  >
                    <MaterialIcons name="person" size={20} color={colors.neutralVariant} />
                    <Text style={styles.optionText}>{member.display_name ?? 'Staff Member'}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* Step: Date */}
            {step === 'date' && (
              <View style={styles.stepContent}>
                <View style={styles.dateGrid}>
                  {days.map((day) => {
                    const isSelected = selectedDate?.toDateString() === day.toDateString();
                    return (
                      <Pressable
                        key={day.toISOString()}
                        style={[styles.dateCard, isSelected && styles.dateCardActive]}
                        onPress={() => { setSelectedDate(day); setStep('time'); }}
                      >
                        <Text style={[styles.dateDow, isSelected && styles.dateTextActive]}>
                          {day.toLocaleDateString('en-US', { weekday: 'short' })}
                        </Text>
                        <Text style={[styles.dateNum, isSelected && styles.dateTextActive]}>
                          {day.getDate()}
                        </Text>
                        <Text style={[styles.dateMonth, isSelected && styles.dateTextActive]}>
                          {day.toLocaleDateString('en-US', { month: 'short' })}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Step: Time */}
            {step === 'time' && (
              <View style={styles.stepContent}>
                {selectedDate && (
                  <Pressable style={styles.backLink} onPress={() => setStep('date')}>
                    <MaterialIcons name="arrow-back" size={16} color={colors.primary} />
                    <Text style={styles.backLinkText}>{formatDate(selectedDate)}</Text>
                  </Pressable>
                )}
                {slotsLoading ? (
                  <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
                ) : slots.length === 0 ? (
                  <Text style={styles.emptyText}>No available times for this date. Try another day.</Text>
                ) : (
                  <View style={styles.timeGrid}>
                    {slots.map((slot, i) => (
                      <Pressable
                        key={i}
                        style={[styles.timeCard, selectedSlot === slot.start_at && styles.timeCardActive]}
                        onPress={() => { setSelectedSlot(slot.start_at); setStep('details'); }}
                      >
                        <Text style={[
                          styles.timeText,
                          selectedSlot === slot.start_at && styles.timeTextActive,
                        ]}>
                          {formatTime(slot.start_at)}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Step: Details */}
            {step === 'details' && (
              <View style={styles.stepContent}>
                <Pressable style={styles.backLink} onPress={() => setStep('time')}>
                  <MaterialIcons name="arrow-back" size={16} color={colors.primary} />
                  <Text style={styles.backLinkText}>Change time</Text>
                </Pressable>
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>First Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={customer.given_name}
                    onChangeText={(v) => setCustomer((p) => ({ ...p, given_name: v }))}
                    placeholder="Your first name"
                    placeholderTextColor={colors.outlineVariant}
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    value={customer.family_name ?? ''}
                    onChangeText={(v) => setCustomer((p) => ({ ...p, family_name: v }))}
                    placeholder="Your last name"
                    placeholderTextColor={colors.outlineVariant}
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={customer.email_address ?? ''}
                    onChangeText={(v) => setCustomer((p) => ({ ...p, email_address: v }))}
                    placeholder="email@example.com"
                    placeholderTextColor={colors.outlineVariant}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Phone</Text>
                  <TextInput
                    style={styles.input}
                    value={customer.phone_number ?? ''}
                    onChangeText={(v) => setCustomer((p) => ({ ...p, phone_number: v }))}
                    placeholder="(555) 555-5555"
                    placeholderTextColor={colors.outlineVariant}
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Note (optional)</Text>
                  <TextInput
                    style={[styles.input, { minHeight: 64 }]}
                    value={note}
                    onChangeText={setNote}
                    placeholder="Anything we should know?"
                    placeholderTextColor={colors.outlineVariant}
                    multiline
                  />
                </View>
                <Pressable
                  style={[styles.primaryBtn, !customer.given_name && styles.primaryBtnDisabled]}
                  onPress={() => customer.given_name && setStep('confirm')}
                  disabled={!customer.given_name}
                >
                  <Text style={styles.primaryBtnText}>Review Booking</Text>
                </Pressable>
              </View>
            )}

            {/* Step: Confirm */}
            {step === 'confirm' && (
              <View style={styles.stepContent}>
                <View style={styles.summaryCard}>
                  <SummaryRow label="Service" value={serviceName} colors={colors} styles={styles} />
                  {selectedStaff && (
                    <SummaryRow
                      label="Staff"
                      value={teamMembers.find((m) => m.square_id === selectedStaff)?.display_name ?? 'Selected'}
                      colors={colors} styles={styles}
                    />
                  )}
                  {selectedDate && (
                    <SummaryRow label="Date" value={formatDate(selectedDate)} colors={colors} styles={styles} />
                  )}
                  {selectedSlot && (
                    <SummaryRow label="Time" value={formatTime(selectedSlot)} colors={colors} styles={styles} />
                  )}
                  <SummaryRow label="Name" value={`${customer.given_name} ${customer.family_name ?? ''}`} colors={colors} styles={styles} />
                  {customer.email_address && <SummaryRow label="Email" value={customer.email_address} colors={colors} styles={styles} />}
                  {customer.phone_number && <SummaryRow label="Phone" value={customer.phone_number} colors={colors} styles={styles} />}
                </View>

                {bookingError && <Text style={styles.errorText}>{bookingError}</Text>}

                <Pressable
                  style={styles.primaryBtn}
                  onPress={handleSubmit}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.primaryBtnText}>Confirm Booking</Text>
                  )}
                </Pressable>
                <Pressable style={styles.secondaryBtn} onPress={() => setStep('details')}>
                  <Text style={styles.secondaryBtnText}>Go Back</Text>
                </Pressable>
              </View>
            )}

            {/* Step: Success */}
            {step === 'success' && (
              <View style={[styles.stepContent, { alignItems: 'center' }]}>
                <MaterialIcons name="check-circle" size={56} color="#22c55e" />
                <Text style={styles.successTitle}>Booking Confirmed!</Text>
                <Text style={styles.successBody}>
                  Your appointment for {serviceName} has been booked.
                  {customer.email_address ? ' A confirmation will be sent to your email.' : ''}
                </Text>
                <Pressable style={styles.primaryBtn} onPress={onClose}>
                  <Text style={styles.primaryBtnText}>Done</Text>
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function SummaryRow({
  label,
  value,
  colors,
  styles,
}: {
  label: string;
  value: string;
  colors: ThemeColors;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    modal: {
      backgroundColor: colors.surface,
      borderRadius: radii.md,
      maxWidth: 520,
      width: '100%' as any,
      maxHeight: '90%' as any,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    headerTitle: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.lg,
      color: colors.neutral,
    },
    headerSub: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.neutralVariant,
      marginTop: 2,
    },
    closeBtn: { padding: spacing.xs },
    body: { flex: 1 },
    bodyContent: { padding: spacing.lg },
    stepContent: { gap: spacing.md },

    backLink: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: spacing.sm,
    },
    backLinkText: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.sm,
      color: colors.primary,
    },

    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radii.sm,
    },
    optionCardActive: {
      borderColor: colors.primary,
      backgroundColor: colors.surfaceContainer,
    },
    optionText: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.md,
      color: colors.neutral,
    },

    dateGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    dateCard: {
      width: 72,
      paddingVertical: spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radii.sm,
    },
    dateCardActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    dateDow: { fontFamily: fonts.sans, fontSize: fontSize.xs, color: colors.neutralVariant },
    dateNum: { fontFamily: fonts.sansBold, fontSize: fontSize.xl, color: colors.neutral, marginVertical: 2 },
    dateMonth: { fontFamily: fonts.sans, fontSize: fontSize.xs, color: colors.neutralVariant },
    dateTextActive: { color: colors.onPrimary },

    timeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    timeCard: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm + 2,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radii.sm,
    },
    timeCardActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    timeText: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.sm,
      color: colors.neutral,
    },
    timeTextActive: { color: colors.onPrimary },

    emptyText: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutralVariant,
      textAlign: 'center',
      marginTop: spacing.xl,
    },

    formGroup: { gap: 4 },
    inputLabel: { fontFamily: fonts.sansMedium, fontSize: fontSize.sm, color: colors.neutral },
    input: {
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radii.sm,
      padding: spacing.sm + 4,
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutral,
      backgroundColor: colors.surfaceContainer,
    },

    primaryBtn: {
      backgroundColor: colors.primary,
      paddingVertical: spacing.sm + 4,
      borderRadius: radii.sm,
      alignItems: 'center',
      marginTop: spacing.md,
    },
    primaryBtnDisabled: { opacity: 0.5 },
    primaryBtnText: { fontFamily: fonts.sansMedium, fontSize: fontSize.md, color: colors.onPrimary },

    secondaryBtn: {
      paddingVertical: spacing.sm + 2,
      alignItems: 'center',
    },
    secondaryBtnText: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant },

    summaryCard: {
      backgroundColor: colors.surfaceContainer,
      borderRadius: radii.sm,
      padding: spacing.lg,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: spacing.xs + 2,
    },
    summaryLabel: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant },
    summaryValue: { fontFamily: fonts.sansMedium, fontSize: fontSize.sm, color: colors.neutral },

    successTitle: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.xl,
      color: colors.neutral,
      marginTop: spacing.md,
    },
    successBody: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutralVariant,
      textAlign: 'center',
      lineHeight: 22,
    },

    errorText: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: '#dc2626',
    },
  });

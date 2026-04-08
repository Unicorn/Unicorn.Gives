import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { useMySubscriptions, useMyBookings, useAccountRefresh } from '@/hooks/useMyAccount';

export default function MyAccountScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { subscriptions } = useMySubscriptions();
  const { bookings } = useMyBookings();
  const { refresh, refreshing } = useAccountRefresh();

  const activeCount = subscriptions.filter((s) => s.status === 'active').length;
  const upcomingCount = bookings.filter((b) => b.start_at && new Date(b.start_at) > new Date()).length;

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.pageTitle}>My Account</Text>
          <Text style={styles.subtitle}>Manage your memberships and bookings.</Text>
        </View>
        <AnimatedPressable
          variant="subtle"
          onPress={refresh}
          style={[styles.refreshBtn, { borderColor: colors.outline }]}
        >
          <MaterialIcons
            name="refresh"
            size={18}
            color={refreshing ? colors.neutralVariant : colors.neutral}
          />
          <Text style={[styles.refreshText, { color: colors.neutral }]}>
            {refreshing ? 'Syncing…' : 'Sync with Square'}
          </Text>
        </AnimatedPressable>
      </View>

      <View style={styles.list}>
        <AccountRow
          onPress={() => router.push('/user/account/subscriptions' as any)}
          icon="card-membership"
          label="Subscriptions"
          description={`${activeCount} active`}
          colors={colors}
          styles={styles}
        />
        <AccountRow
          onPress={() => router.push('/user/account/bookings' as any)}
          icon="event"
          label="Bookings"
          description={`${upcomingCount} upcoming`}
          colors={colors}
          styles={styles}
        />
        <AccountRow
          onPress={() => router.push('/user/profile' as any)}
          icon="person"
          label="Profile"
          description="Name, email, avatar"
          colors={colors}
          styles={styles}
        />
      </View>
    </ScrollView>
  );
}

function AccountRow({
  onPress,
  icon,
  label,
  description,
  colors,
  styles,
}: {
  onPress: () => void;
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  description: string;
  colors: ThemeColors;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <AnimatedPressable
      variant="subtle"
      onPress={onPress}
      style={StyleSheet.flatten([styles.row, { borderColor: colors.outline, backgroundColor: colors.surface }])}
    >
      <View style={StyleSheet.flatten([styles.iconWrap, { backgroundColor: colors.outlineVariant }])}>
        <MaterialIcons name={icon} size={22} color={colors.neutral} />
      </View>
      <View style={styles.rowText}>
        <Text style={StyleSheet.flatten([styles.rowLabel, { color: colors.neutral }])}>{label}</Text>
        <Text style={StyleSheet.flatten([styles.rowDesc, { color: colors.neutralVariant }])}>{description}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={22} color={colors.neutralVariant} />
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
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.md,
      marginBottom: spacing.xl,
    },
    pageTitle: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize['4xl'],
      color: colors.neutral,
    },
    subtitle: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutralVariant,
      marginTop: spacing.sm,
    },
    refreshBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      borderWidth: 1,
      borderRadius: radii.sm,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.surface,
    },
    refreshText: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.sm,
    },
    list: { gap: spacing.md },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.lg,
      borderRadius: radii.md,
      borderWidth: 1,
    },
    iconWrap: {
      width: 44,
      height: 44,
      borderRadius: radii.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowText: { flex: 1, gap: 2 },
    rowLabel: { fontFamily: fonts.sansBold, fontSize: fontSize.lg },
    rowDesc: { fontFamily: fonts.sans, fontSize: fontSize.sm + 1 },
  });

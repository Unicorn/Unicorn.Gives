import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';
import { routes } from '@/lib/navigation';
import { useTheme, spacing, radii } from '@/constants/theme';

export default function CommunityHub() {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Community" />
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
        <Text style={[styles.heading, { color: colors.neutral }]}>Community Hub</Text>
        <Text style={[styles.description, { color: colors.neutralVariant }]}>
          Connect with your neighbors. Find events, share opinions, and stay in the loop.
        </Text>

        <Link href={routes.community.events.index()} asChild>
          <TouchableOpacity style={StyleSheet.flatten([styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }])}>
            <Text style={[styles.cardTitle, { color: colors.neutral }]}>Events</Text>
            <Text style={[styles.cardDesc, { color: colors.neutralVariant }]}>Upcoming and past community events</Text>
          </TouchableOpacity>
        </Link>

        <Link href={routes.community.opinions.index()} asChild>
          <TouchableOpacity style={StyleSheet.flatten([styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }])}>
            <Text style={[styles.cardTitle, { color: colors.neutral }]}>Opinions</Text>
            <Text style={[styles.cardDesc, { color: colors.neutralVariant }]}>Community posts, discussions, and perspectives</Text>
          </TouchableOpacity>
        </Link>

        <Link href={routes.community.calendar()} asChild>
          <TouchableOpacity style={StyleSheet.flatten([styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }])}>
            <Text style={[styles.cardTitle, { color: colors.neutral }]}>Calendar</Text>
            <Text style={[styles.cardDesc, { color: colors.neutralVariant }]}>Calendar view of all community events</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 40 },
  heading: { fontSize: 24, fontWeight: '800', marginBottom: spacing.sm },
  description: { fontSize: 15, lineHeight: 22, marginBottom: spacing.xxl },
  card: {
    borderRadius: radii.md,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: spacing.xs },
  cardDesc: { fontSize: 14, lineHeight: 20 },
});

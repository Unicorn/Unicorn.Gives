import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { routes } from '@/lib/navigation';

export default function CommunityTab() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Community Hub</Text>
      <Text style={styles.description}>
        Connect with your neighbors. Find events, share opinions, and stay in the loop.
      </Text>

      <Link href={routes.community.events.index()} asChild>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Events</Text>
          <Text style={styles.cardDesc}>Upcoming and past community events</Text>
        </TouchableOpacity>
      </Link>

      <Link href={routes.community.opinions.index()} asChild>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Opinions</Text>
          <Text style={styles.cardDesc}>Community posts, discussions, and perspectives</Text>
        </TouchableOpacity>
      </Link>

      <Link href={routes.community.calendar()} asChild>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Calendar</Text>
          <Text style={styles.cardDesc}>Calendar view of all community events</Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 20, paddingBottom: 40 },
  heading: { fontSize: 24, fontWeight: '800', color: '#2d4a4a', marginBottom: 8 },
  description: { fontSize: 15, color: '#73796d', lineHeight: 22, marginBottom: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#c3c8bb',
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#2d4a4a', marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#73796d', lineHeight: 20 },
});

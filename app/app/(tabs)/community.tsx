import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { routes } from '@/lib/navigation';

export default function CommunityScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Community</Text>
      <Text style={styles.sub}>Events, forums, and local connection — more soon.</Text>
      <Link href={routes.events.index()} asChild>
        <TouchableOpacity style={styles.card}>
          <Text style={styles.cardTitle}>Events calendar</Text>
          <Text style={styles.cardMeta}>See what is happening</Text>
        </TouchableOpacity>
      </Link>
      <View style={styles.stub}>
        <Text style={styles.stubText}>Forums and RSVPs will live here.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', color: '#2d4a4a', marginBottom: 8 },
  sub: { fontSize: 15, color: '#73796d', marginBottom: 20, lineHeight: 22 },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#c3c8bb',
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#2d4a4a' },
  cardMeta: { fontSize: 13, color: '#73796d', marginTop: 4 },
  stub: { padding: 20, backgroundColor: '#e8f0e0', borderRadius: 12 },
  stubText: { fontSize: 15, color: '#43493e' },
});

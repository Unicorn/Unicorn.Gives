import { Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { routes } from '@/lib/navigation';
import { LORE_ORDER, getLoreDoc } from '@/lib/lore';

export default function HistoryTab() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>
        Tier 0 of unicorn.gives — the stories, traditions, and histories that sit beneath the county lines.
        Read as folklore and teaching, not as a substitute for science or tribal authority.
      </Text>
      {LORE_ORDER.map((slug) => {
        const doc = getLoreDoc(slug);
        if (!doc) return null;
        return (
          <Link key={slug} href={routes.history.detail(slug)} asChild>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.eyebrow}>{doc.eyebrow}</Text>
              <Text style={styles.title}>{doc.title}</Text>
              <Text style={styles.blurb} numberOfLines={3}>
                {doc.intro}
              </Text>
            </TouchableOpacity>
          </Link>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content: { padding: 20, paddingBottom: 40 },
  intro: {
    fontSize: 15,
    color: '#c3c8bb',
    lineHeight: 24,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1b4332',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#b45309',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#74c69d',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fcf9f4',
    marginBottom: 10,
    fontFamily: 'Georgia',
  },
  blurb: { fontSize: 14, color: '#d8f3dc', lineHeight: 21 },
});

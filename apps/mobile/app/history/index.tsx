import { Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { routes } from '@/lib/navigation';
import { LORE_ORDER, getLoreDoc } from '@/lib/lore';
import { useTheme, spacing, radii, fonts } from '@/constants/theme';

export default function HistoryHubScreen() {
  const { colors } = useTheme();
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.neutral }]} contentContainerStyle={styles.content}>
      <Text style={[styles.intro, { color: colors.outline }]}>
        Tier 0 of unicorn.gives — the stories, traditions, and histories that sit beneath the county lines.
        Read as folklore and teaching, not as a substitute for science or tribal authority.
      </Text>
      {LORE_ORDER.map((slug) => {
        const doc = getLoreDoc(slug);
        if (!doc) return null;
        return (
          <Link key={slug} href={routes.history.detail(slug)} asChild>
            <TouchableOpacity style={StyleSheet.flatten([styles.card, { backgroundColor: colors.primary, borderLeftColor: colors.gold }])}>
              <Text style={[styles.eyebrow, { color: colors.primary }]}>{doc.eyebrow}</Text>
              <Text style={[styles.title, { color: colors.background }]}>{doc.title}</Text>
              <Text style={[styles.blurb, { color: colors.primaryContainer }]} numberOfLines={3}>
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
  container: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 40 },
  intro: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  card: {
    borderRadius: radii.md,
    padding: 18,
    marginBottom: 14,
    borderLeftWidth: 4,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    fontFamily: fonts.serif,
  },
  blurb: { fontSize: 14, lineHeight: 21 },
});

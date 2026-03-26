import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, Redirect } from 'expo-router';
import { getLoreDoc, isLoreSlug } from '@/lib/lore';
import { routes } from '@/lib/navigation';
import { useTheme, spacing, radii, fonts } from '@/constants/theme';

export default function HistoryDetailScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ slug: string | string[] }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  if (!slug || !isLoreSlug(slug)) {
    return <Redirect href={routes.history.index()} />;
  }
  const doc = getLoreDoc(slug);
  if (!doc) {
    return <Redirect href={routes.history.index()} />;
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.neutral }]} contentContainerStyle={styles.content}>
      <Text style={[styles.breadcrumb, { color: colors.purple }]}>Land of the Unicorns</Text>
      <Text style={[styles.eyebrow, { color: colors.primary }]}>{doc.eyebrow}</Text>
      <Text style={[styles.title, { color: colors.background }]}>{doc.title}</Text>
      <Text style={[styles.intro, { color: colors.primaryContainer }]}>{doc.intro}</Text>
      {doc.sections.map((section) => (
        <View key={`${slug}-${section.heading}`} style={styles.section}>
          <Text style={[styles.sectionHeading, { color: colors.purpleContainer }]}>{section.heading}</Text>
          <Text style={[styles.sectionBody, { color: colors.outline }]}>{section.body}</Text>
          {section.lore_callout && (
            <View style={[styles.callout, { backgroundColor: colors.purple, borderLeftColor: colors.gold }]}>
              <Text style={[styles.calloutText, { color: colors.purpleContainer }]}>{section.lore_callout}</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 48 },
  breadcrumb: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: spacing.md,
    letterSpacing: 0.5,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.lg,
    fontFamily: fonts.serif,
  },
  intro: {
    fontSize: 16,
    lineHeight: 26,
    marginBottom: spacing.xxl,
  },
  section: { marginBottom: 28 },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  sectionBody: {
    fontSize: 15,
    lineHeight: 24,
  },
  callout: {
    marginTop: 14,
    padding: 14,
    borderRadius: radii.sm,
    borderLeftWidth: 3,
  },
  calloutText: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
    fontFamily: fonts.serif,
  },
});

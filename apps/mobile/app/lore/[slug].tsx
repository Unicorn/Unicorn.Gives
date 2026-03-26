import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, Redirect } from 'expo-router';
import { getLoreDoc, isLoreSlug } from '@/lib/lore';
import { routes } from '@/lib/navigation';

export default function LoreDetailScreen() {
  const params = useLocalSearchParams<{ slug: string | string[] }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  if (!slug || !isLoreSlug(slug)) {
    return <Redirect href={routes.lore.index()} />;
  }
  const doc = getLoreDoc(slug);
  if (!doc) {
    return <Redirect href={routes.lore.index()} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.breadcrumb}>Land of the Unicorns</Text>
      <Text style={styles.eyebrow}>{doc.eyebrow}</Text>
      <Text style={styles.title}>{doc.title}</Text>
      <Text style={styles.intro}>{doc.intro}</Text>
      {doc.sections.map((section) => (
        <View key={`${slug}-${section.heading}`} style={styles.section}>
          <Text style={styles.sectionHeading}>{section.heading}</Text>
          <Text style={styles.sectionBody}>{section.body}</Text>
          {section.lore_callout && (
            <View style={styles.callout}>
              <Text style={styles.calloutText}>{section.lore_callout}</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  content: { padding: 20, paddingBottom: 48 },
  breadcrumb: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b4e8a',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#74c69d',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fcf9f4',
    marginBottom: 16,
    fontFamily: 'Georgia',
  },
  intro: {
    fontSize: 16,
    color: '#d8f3dc',
    lineHeight: 26,
    marginBottom: 24,
  },
  section: { marginBottom: 28 },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ede7f6',
    marginBottom: 10,
  },
  sectionBody: {
    fontSize: 15,
    color: '#c3c8bb',
    lineHeight: 24,
  },
  callout: {
    marginTop: 14,
    padding: 14,
    backgroundColor: '#3d2b56',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#b45309',
  },
  calloutText: {
    fontSize: 14,
    color: '#ede7f6',
    lineHeight: 22,
    fontStyle: 'italic',
    fontFamily: 'Georgia',
  },
});

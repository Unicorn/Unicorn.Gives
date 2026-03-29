import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, Redirect } from 'expo-router';
import { getLoreDoc, isLoreSlug } from '@/lib/lore';
import { routes } from '@/lib/navigation';
import { useTheme, spacing, radii, fonts, fontSize, letterSpacing } from '@/constants/theme';
import { Wrapper } from '@/components/layout/Wrapper';
import { SeoHead } from '@/components/SeoHead';
import { Container } from '@/components/layout/Container';
import { fetchHistorySlugParams } from '@/lib/static-build-queries';

export async function generateStaticParams() {
  return fetchHistorySlugParams();
}

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
    <Wrapper contentContainerStyle={styles.content}>
      <SeoHead title={doc.title} description={doc.seo_description} />
      <Container>
      <Text style={[styles.breadcrumb, { color: colors.neutralVariant }]}>Land of the Unicorns</Text>
      <Text style={[styles.eyebrow, { color: colors.neutralVariant }]}>{doc.eyebrow}</Text>
      <Text style={[styles.title, { color: colors.neutral }]}>{doc.title}</Text>
      <Text style={[styles.intro, { color: colors.neutralVariant }]}>{doc.intro}</Text>
      {doc.sections.map((section) => (
        <View key={`${slug}-${section.heading}`} style={styles.section}>
          <Text style={[styles.sectionHeading, { color: colors.neutral }]}>{section.heading}</Text>
          <Text style={[styles.sectionBody, { color: colors.neutralVariant }]}>{section.body}</Text>
          {section.lore_callout && (
            <View style={[styles.callout, { backgroundColor: colors.surface, borderLeftColor: colors.primary, borderWidth: 1, borderColor: colors.outline }]}>
              <Text style={[styles.calloutText, { color: colors.neutralVariant }]}>{section.lore_callout}</Text>
            </View>
          )}
        </View>
      ))}
      </Container>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl + spacing.lg },
  breadcrumb: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.sm,
    marginBottom: spacing.md,
    letterSpacing: letterSpacing.normal,
  },
  eyebrow: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.xs,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: fontSize['4xl'],
    marginBottom: spacing.lg,
  },
  intro: {
    fontFamily: fonts.sans,
    fontSize: fontSize.lg,
    lineHeight: 26,
    marginBottom: spacing.xxl,
  },
  section: { marginBottom: spacing.xxl + spacing.xs },
  sectionHeading: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.xl,
    marginBottom: spacing.sm + 2,
  },
  sectionBody: {
    fontFamily: fonts.sans,
    fontSize: fontSize.base,
    lineHeight: 24,
  },
  callout: {
    marginTop: spacing.lg - 2,
    padding: spacing.lg - 2,
    borderRadius: radii.sm,
    borderLeftWidth: 3,
  },
  calloutText: {
    fontFamily: fonts.serif,
    fontSize: fontSize.md,
    lineHeight: 22,
    fontStyle: 'italic',
  },
});

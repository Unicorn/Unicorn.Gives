import { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useTheme, fonts, fontSize, spacing, radii, shadows, type ThemeColors } from '@/constants/theme';
import { Wrapper } from '@/components/layout/Wrapper';
import { SeoHead } from '@/components/SeoHead';
import { Container } from '@/components/layout/Container';
import { getDefaultDescription } from '@/lib/seo';
import { fetchGuideSlugParams } from '@/lib/static-build-queries';

export async function generateStaticParams() {
  return fetchGuideSlugParams();
}

interface Guide {
  title: string;
  description: string;
  category: string;
  icon: string | null;
  jurisdiction: string;
  body: string;
  last_verified: string | null;
}

interface GuideContact {
  id: string;
  name: string;
  role: string;
  phone: string | null;
  email: string | null;
}

interface GuideForm {
  id: string;
  name: string;
  url: string;
  description: string | null;
}

export default function GuideDetail() {
  const { colors } = useTheme();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [contacts, setContacts] = useState<GuideContact[]>([]);
  const [forms, setForms] = useState<GuideForm[]>([]);

  useEffect(() => {
    if (!slug) return;
    supabase.from('guides').select('*').eq('slug', slug).single()
      .then(({ data }) => {
        if (data) {
          setGuide(data);
          supabase.from('guide_contacts').select('*').eq('guide_id', data.id)
            .then(({ data: c }) => { if (c) setContacts(c); });
          supabase.from('guide_forms').select('*').eq('guide_id', data.id)
            .then(({ data: f }) => { if (f) setForms(f); });
        }
      });
  }, [slug]);

  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!guide) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <SeoHead
          title={slug ? `Guides · ${slug}` : 'Guides'}
          description={getDefaultDescription()}
        />
        <Text style={styles.loading}>Loading...</Text>
      </View>
    );
  }

  return (
    <Wrapper contentContainerStyle={styles.content}>
      <SeoHead title={guide.title} description={guide.description ?? undefined} />
      <Container>
      <View style={styles.header}>
        {guide.icon && <Text style={styles.icon}>{guide.icon}</Text>}
        <Text style={styles.title}>{guide.title}</Text>
        <Text style={styles.desc}>{guide.description}</Text>
        <Text style={styles.meta}>{guide.category} · {guide.jurisdiction}</Text>
        {guide.last_verified && (
          <Text style={styles.verified}>Last verified: {guide.last_verified}</Text>
        )}
      </View>

      <MarkdownRenderer content={guide.body} />

      {contacts.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacts</Text>
          {contacts.map(c => (
            <View key={c.id} style={styles.contactCard}>
              <Text style={styles.contactName}>{c.name}</Text>
              <Text style={styles.contactRole}>{c.role}</Text>
              {c.phone && (
                <TouchableOpacity onPress={() => Linking.openURL(`tel:${c.phone}`)}>
                  <Text style={styles.contactLink}>{c.phone}</Text>
                </TouchableOpacity>
              )}
              {c.email && (
                <TouchableOpacity onPress={() => Linking.openURL(`mailto:${c.email}`)}>
                  <Text style={styles.contactLink}>{c.email}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}

      {forms.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forms & Downloads</Text>
          {forms.map(f => (
            <TouchableOpacity key={f.id} style={styles.formCard} onPress={() => Linking.openURL(f.url)}>
              <Text style={styles.formName}>{f.name}</Text>
              {f.description && <Text style={styles.formDesc}>{f.description}</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}
      </Container>
    </Wrapper>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: spacing.xxxl * 2 },
  loading: { fontFamily: fonts.sans, padding: spacing.xxl, color: colors.neutralVariant, textAlign: 'center' },
  header: { marginBottom: spacing.xxl },
  icon: { fontSize: 36, marginBottom: spacing.sm },
  title: { fontFamily: fonts.sansBold, fontSize: fontSize['3xl'], color: colors.neutral, marginBottom: spacing.sm },
  desc: { fontFamily: fonts.sans, fontSize: fontSize.lg, color: colors.neutral, lineHeight: 24, marginBottom: spacing.sm },
  meta: { fontFamily: fonts.sans, fontSize: fontSize.sm + 1, color: colors.neutralVariant, textTransform: 'capitalize' },
  verified: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant, marginTop: spacing.xs },
  section: { marginTop: spacing.xxl },
  sectionTitle: { fontFamily: fonts.sansBold, fontSize: fontSize.xl, color: colors.neutral, marginBottom: spacing.md },
  contactCard: { borderRadius: radii.sm, padding: spacing.lg - 2, marginBottom: spacing.sm, backgroundColor: colors.surface, ...shadows.card },
  contactName: { fontFamily: fonts.sansBold, fontSize: fontSize.lg, color: colors.neutral, marginBottom: 2 },
  contactRole: { fontFamily: fonts.sans, fontSize: fontSize.md, color: colors.neutral, marginBottom: spacing.xs + 2 },
  contactLink: { fontFamily: fonts.sansMedium, fontSize: fontSize.md, color: colors.primary, marginBottom: 2 },
  formCard: { borderRadius: radii.sm, padding: spacing.lg - 2, marginBottom: spacing.sm, backgroundColor: colors.surface, ...shadows.card },
  formName: { fontFamily: fonts.sansMedium, fontSize: fontSize.base, color: colors.neutral, marginBottom: 2 },
  formDesc: { fontFamily: fonts.sans, fontSize: fontSize.sm + 1, color: colors.neutralVariant },
});

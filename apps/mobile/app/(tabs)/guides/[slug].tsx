import { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useTheme, fonts, spacing, radii, shadows } from '@/constants/theme';
import { Wrapper } from '@/components/layout/Wrapper';
import { Container } from '@/components/layout/Container';

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

  if (!guide) return <View style={{ flex: 1, backgroundColor: colors.background }}><Text style={styles.loading}>Loading...</Text></View>;

  return (
    <Wrapper contentContainerStyle={styles.content}>
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

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  content: { padding: 20, paddingBottom: 60 },
  loading: { padding: 24, color: colors.neutralVariant, textAlign: 'center' },
  header: { marginBottom: 24 },
  icon: { fontSize: 36, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: colors.neutral, marginBottom: 8 },
  desc: { fontSize: 16, color: colors.neutral, lineHeight: 24, marginBottom: 8 },
  meta: { fontSize: 13, color: colors.neutralVariant, textTransform: 'capitalize' },
  verified: { fontSize: 12, color: colors.neutralVariant, marginTop: 4 },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.neutral, marginBottom: 12 },
  contactCard: { borderRadius: radii.sm, padding: 14, marginBottom: 8, backgroundColor: colors.surface, ...shadows.card },
  contactName: { fontSize: 16, fontWeight: '700', color: colors.neutral, marginBottom: 2 },
  contactRole: { fontSize: 14, color: colors.neutral, marginBottom: 6 },
  contactLink: { fontSize: 14, color: colors.primary, fontWeight: '600', marginBottom: 2 },
  formCard: { borderRadius: radii.sm, padding: 14, marginBottom: 8, backgroundColor: colors.surface, ...shadows.card },
  formName: { fontSize: 15, fontWeight: '600', color: colors.neutral, marginBottom: 2 },
  formDesc: { fontSize: 13, color: colors.neutralVariant },
});

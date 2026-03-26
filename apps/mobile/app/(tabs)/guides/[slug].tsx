import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

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

  if (!guide) return <View style={styles.container}><Text style={styles.loading}>Loading...</Text></View>;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 20, paddingBottom: 60 },
  loading: { padding: 24, color: '#73796d', textAlign: 'center' },
  header: { marginBottom: 24 },
  icon: { fontSize: 36, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: '#2d4a4a', marginBottom: 8 },
  desc: { fontSize: 16, color: '#43493e', lineHeight: 24, marginBottom: 8 },
  meta: { fontSize: 13, color: '#8a9a7c', textTransform: 'capitalize' },
  verified: { fontSize: 12, color: '#73796d', marginTop: 4 },
  section: { marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#2d4a4a', marginBottom: 12 },
  contactCard: { backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#c3c8bb' },
  contactName: { fontSize: 16, fontWeight: '700', color: '#2d4a4a', marginBottom: 2 },
  contactRole: { fontSize: 14, color: '#43493e', marginBottom: 6 },
  contactLink: { fontSize: 14, color: '#3d6060', fontWeight: '600', marginBottom: 2 },
  formCard: { backgroundColor: '#2d4a4a', borderRadius: 8, padding: 14, marginBottom: 8 },
  formName: { fontSize: 15, fontWeight: '600', color: '#fcf9f4', marginBottom: 2 },
  formDesc: { fontSize: 13, color: '#c3c8bb' },
});

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

interface GuideContact { name: string; role: string | null; phone: string | null; email: string | null; }
interface GuideForm { name: string; url: string; format: string; }

export default function GuideDetail() {
  const { flowSlug } = useLocalSearchParams<{ flowSlug: string }>();
  const [guide, setGuide] = useState<any>(null);
  const [contacts, setContacts] = useState<GuideContact[]>([]);
  const [forms, setForms] = useState<GuideForm[]>([]);

  useEffect(() => {
    if (!flowSlug) return;
    supabase.from('guides').select('*').eq('slug', flowSlug).single()
      .then(({ data }) => {
        if (!data) return;
        setGuide(data);
        supabase.from('guide_contacts').select('*').eq('guide_id', data.id).order('display_order')
          .then(({ data: c }) => { if (c) setContacts(c); });
        supabase.from('guide_forms').select('*').eq('guide_id', data.id).order('display_order')
          .then(({ data: f }) => { if (f) setForms(f); });
      });
  }, [flowSlug]);

  if (!guide) return <View style={styles.container}><Text style={styles.loading}>Loading...</Text></View>;

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.scenario}>{guide.scenario}</Text>
        <Text style={styles.title}>{guide.title}</Text>
        {guide.jurisdiction && <Text style={styles.jurisdiction}>{guide.jurisdiction.toUpperCase()}</Text>}

        <MarkdownRenderer content={guide.body} />

        {contacts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contacts</Text>
            {contacts.map((c, i) => (
              <View key={i} style={styles.contactCard}>
                <Text style={styles.contactName}>{c.name}</Text>
                {c.role && <Text style={styles.contactRole}>{c.role}</Text>}
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
            {forms.map((f, i) => (
              <TouchableOpacity key={i} style={styles.formItem} onPress={() => Linking.openURL(f.url)}>
                <Text style={styles.formName}>{f.name}</Text>
                <Text style={styles.formFormat}>{f.format}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {guide.last_verified && (
          <Text style={styles.verified}>Last verified: {guide.last_verified}</Text>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 20, paddingBottom: 60 },
  loading: { padding: 24, color: '#73796d', textAlign: 'center' },
  scenario: { fontSize: 16, fontWeight: '600', color: '#356565', marginBottom: 4 },
  title: { fontSize: 24, fontWeight: '800', color: '#2d4a4a', marginBottom: 8 },
  jurisdiction: { fontSize: 11, fontWeight: '700', color: '#8a9a7c', letterSpacing: 1, marginBottom: 16 },
  section: { marginTop: 24, gap: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#2d4a4a', marginBottom: 4 },
  contactCard: { backgroundColor: '#f0ede8', borderRadius: 8, padding: 12, gap: 2 },
  contactName: { fontSize: 15, fontWeight: '700', color: '#2d4a4a' },
  contactRole: { fontSize: 13, color: '#43493e' },
  contactLink: { fontSize: 14, color: '#3d6060', fontWeight: '600' },
  formItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: '#c3c8bb' },
  formName: { fontSize: 14, fontWeight: '600', color: '#2d4a4a', flex: 1 },
  formFormat: { fontSize: 11, fontWeight: '700', color: '#73796d', backgroundColor: '#f0ede8', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  verified: { fontSize: 12, color: '#73796d', marginTop: 24, textAlign: 'center' },
});

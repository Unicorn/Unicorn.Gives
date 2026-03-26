import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { routes } from '@/lib/navigation';
import { supabase } from '@/lib/supabase';

interface Partner {
  slug: string;
  name: string;
  description: string | null;
}

export default function PartnersDirectory() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    supabase
      .from('partners')
      .select('slug, name, description')
      .eq('is_active', true)
      .then(({ data }) => { if (data) setPartners(data); });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Community Partners</Text>
      <Text style={styles.subheading}>Organizations serving Clare County and northern Michigan.</Text>
      {partners.map(p => (
        <Link key={p.slug} href={routes.partners.index(p.slug)} asChild>
          <TouchableOpacity style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{p.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.name}>{p.name}</Text>
              {p.description && <Text style={styles.desc} numberOfLines={2}>{p.description}</Text>}
            </View>
          </TouchableOpacity>
        </Link>
      ))}
      {partners.length === 0 && <Text style={styles.empty}>Loading partners...</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 22, fontWeight: '800', color: '#2d4a4a', marginBottom: 4 },
  subheading: { fontSize: 15, color: '#73796d', lineHeight: 22, marginBottom: 16 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#c3c8bb', gap: 14, alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#2d4a4a', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 20, fontWeight: '700', color: '#fcf9f4' },
  body: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: '#2d4a4a', marginBottom: 4 },
  desc: { fontSize: 14, color: '#43493e', lineHeight: 20 },
  empty: { textAlign: 'center', color: '#73796d', marginTop: 40 },
});

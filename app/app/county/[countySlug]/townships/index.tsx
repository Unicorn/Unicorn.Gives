import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { useRegion } from '@/lib/hooks/useRegion';
import { AppHeader } from '@/components/layout/AppHeader';
import { routes } from '@/lib/navigation';
import { supabase } from '@/lib/supabase';

interface Row { slug: string; name: string; type: string; }

export default function TownshipsList() {
  const { countySlug } = useLocalSearchParams<{ countySlug: string }>();
  const { region } = useRegion(countySlug);
  const [items, setItems] = useState<Row[]>([]);

  useEffect(() => {
    if (!region) return;
    supabase.from('regions').select('slug, name, type').eq('parent_id', region.id).eq('type', 'township').eq('is_active', true).order('name')
      .then(({ data }) => { if (data) setItems(data); });
  }, [region]);

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Townships" showBack />
      <ScrollView style={{ flex: 1, backgroundColor: '#fcf9f4' }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {items.length === 0 && <Text style={{ color: '#73796d' }}>No townships listed yet.</Text>}
        {items.map((r) => (
          <Link key={r.slug} href={routes.county.townships.municipalRoot(countySlug, r.slug)} asChild>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.name}>{r.name}</Text>
            </TouchableOpacity>
          </Link>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: '#c3c8bb' },
  name: { fontSize: 17, fontWeight: '700', color: '#2d4a4a' },
});

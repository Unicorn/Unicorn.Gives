import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRegion } from '@/lib/hooks/useRegion';
import { supabase } from '@/lib/supabase';
import type { MunicipalSegment } from '@/lib/municipalPaths';
import { useMunicipalRoute } from '@/lib/useMunicipalRoute';

interface Contact {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string | null;
  phone_ext: string | null;
  email: string | null;
  hours: string | null;
}

export function MunicipalContactsIndex({ segment }: { segment: MunicipalSegment }) {
  const { municipalSlug } = useMunicipalRoute(segment);
  const { region } = useRegion(municipalSlug);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deptFilter, setDeptFilter] = useState<string | null>(null);

  useEffect(() => {
    if (!region) return;
    supabase
      .from('contacts')
      .select('id, name, role, department, phone, phone_ext, email, hours')
      .eq('region_id', region.id)
      .eq('status', 'published')
      .order('display_order')
      .then(({ data }) => { if (data) setContacts(data); });
  }, [region]);

  const depts = [...new Set(contacts.map(c => c.department))];
  const filtered = deptFilter ? contacts.filter(c => c.department === deptFilter) : contacts;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {depts.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
          <TouchableOpacity style={[styles.chip, !deptFilter && styles.chipActive]} onPress={() => setDeptFilter(null)}>
            <Text style={[styles.chipText, !deptFilter && styles.chipTextActive]}>All</Text>
          </TouchableOpacity>
          {depts.map(d => (
            <TouchableOpacity key={d} style={[styles.chip, deptFilter === d && styles.chipActive]} onPress={() => setDeptFilter(deptFilter === d ? null : d)}>
              <Text style={[styles.chipText, deptFilter === d && styles.chipTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      {filtered.map(c => (
        <View key={c.id} style={styles.card}>
          <Text style={styles.name}>{c.name}</Text>
          <Text style={styles.role}>{c.role}</Text>
          <Text style={styles.dept}>{c.department}</Text>
          {c.phone && (
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${c.phone}`)}>
              <Text style={styles.phone}>{c.phone}{c.phone_ext ? ` ext. ${c.phone_ext}` : ''}</Text>
            </TouchableOpacity>
          )}
          {c.email && (
            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${c.email}`)}>
              <Text style={styles.email}>{c.email}</Text>
            </TouchableOpacity>
          )}
          {c.hours && <Text style={styles.hours}>{c.hours}</Text>}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 16, paddingBottom: 40 },
  filters: { marginBottom: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#c3c8bb', marginRight: 8, backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#2d4a4a', borderColor: '#2d4a4a' },
  chipText: { fontSize: 13, color: '#43493e', fontWeight: '500' },
  chipTextActive: { color: '#fcf9f4' },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#c3c8bb' },
  name: { fontSize: 16, fontWeight: '700', color: '#2d4a4a', marginBottom: 2 },
  role: { fontSize: 14, color: '#43493e', marginBottom: 2 },
  dept: { fontSize: 12, color: '#8a9a7c', marginBottom: 6 },
  phone: { fontSize: 14, color: '#3d6060', fontWeight: '600', marginBottom: 2 },
  email: { fontSize: 14, color: '#3d6060', marginBottom: 2 },
  hours: { fontSize: 12, color: '#73796d', marginTop: 4 },
});

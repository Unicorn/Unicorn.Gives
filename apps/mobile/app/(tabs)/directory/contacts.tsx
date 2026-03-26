import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { supabase } from '@/lib/supabase';

interface Contact {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string | null;
  email: string | null;
  hours: string | null;
}

export default function ContactsDirectory() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deptFilter, setDeptFilter] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('contacts')
      .select('id, name, role, department, phone, email, hours')
      .eq('status', 'published')
      .order('display_order')
      .then(({ data }) => { if (data) setContacts(data); });
  }, []);

  const depts = [...new Set(contacts.map(c => c.department))];
  const filtered = deptFilter ? contacts.filter(c => c.department === deptFilter) : contacts;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Contact Directory</Text>
      <Text style={styles.subheading}>Government officials and staff across Clare County.</Text>

      {depts.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
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

      <Text style={styles.count}>{filtered.length} contacts</Text>
      {filtered.map(c => (
        <View key={c.id} style={styles.card}>
          <Text style={styles.name}>{c.name}</Text>
          <Text style={styles.role}>{c.role}</Text>
          <Text style={styles.dept}>{c.department}</Text>
          {c.phone && (
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${c.phone}`)}>
              <Text style={styles.link}>{c.phone}</Text>
            </TouchableOpacity>
          )}
          {c.email && (
            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${c.email}`)}>
              <Text style={styles.link}>{c.email}</Text>
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
  heading: { fontSize: 22, fontWeight: '800', color: '#2d4a4a', marginBottom: 4 },
  subheading: { fontSize: 15, color: '#73796d', lineHeight: 22, marginBottom: 16 },
  chips: { marginBottom: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#c3c8bb', marginRight: 8, backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#2d4a4a', borderColor: '#2d4a4a' },
  chipText: { fontSize: 13, color: '#43493e', fontWeight: '500' },
  chipTextActive: { color: '#fcf9f4' },
  count: { fontSize: 13, color: '#73796d', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#c3c8bb' },
  name: { fontSize: 16, fontWeight: '700', color: '#2d4a4a', marginBottom: 2 },
  role: { fontSize: 14, color: '#43493e', marginBottom: 2 },
  dept: { fontSize: 12, color: '#8a9a7c', marginBottom: 6 },
  link: { fontSize: 14, color: '#3d6060', fontWeight: '600', marginBottom: 2 },
  hours: { fontSize: 12, color: '#73796d', marginTop: 4 },
});

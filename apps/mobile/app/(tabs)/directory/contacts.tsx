import { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useTheme, fonts, spacing, radii, shadows } from '@/constants/theme';
import { Wrapper } from '@/components/layout/Wrapper';
import { Container } from '@/components/layout/Container';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

interface Contact {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string | null;
  email: string | null;
  hours: string | null;
}

// Municipality labels derived from department name prefixes
const MUNICIPALITIES = ['Lincoln Township', 'Clare County'] as const;

function getMunicipality(department: string): string {
  for (const m of MUNICIPALITIES) {
    if (department.startsWith(m)) return m;
  }
  return 'Clare County';
}

export default function ContactsDirectory() {
  const { colors } = useTheme();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [deptFilter, setDeptFilter] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('contacts')
      .select('id, name, role, department, phone, email, hours')
      .eq('status', 'published')
      .order('display_order')
      .then(({ data }) => {
        if (!data) return;
        // Deduplicate by name+department (contacts may appear under multiple regions)
        const seen = new Set<string>();
        const unique = data.filter(c => {
          const key = `${c.name}|${c.department}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setContacts(unique);
      });
  }, []);

  const municipalities = [...new Set(contacts.map(c => getMunicipality(c.department)))];
  const regionFiltered = regionFilter ? contacts.filter(c => getMunicipality(c.department) === regionFilter) : contacts;
  const depts = [...new Set(regionFiltered.map(c => c.department))];
  const filtered = deptFilter ? regionFiltered.filter(c => c.department === deptFilter) : regionFiltered;

  const handleRegionChange = (r: string | null) => {
    setRegionFilter(r);
    setDeptFilter(null);
  };

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Wrapper contentContainerStyle={styles.content}>
      <Container>
      <Text style={styles.heading}>Contact Directory</Text>
      <Text style={styles.subheading}>Government officials and staff across Clare County.</Text>

      {municipalities.length > 1 && (
        <>
          <Text style={styles.filterLabel}>Municipality</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
            <AnimatedPressable variant="subtle" style={[styles.chip, !regionFilter && styles.chipActive]} onPress={() => handleRegionChange(null)}>
              <Text style={[styles.chipText, !regionFilter && styles.chipTextActive]}>All</Text>
            </AnimatedPressable>
            {municipalities.map(m => (
              <AnimatedPressable key={m} variant="subtle" style={[styles.chip, regionFilter === m && styles.chipActive]} onPress={() => handleRegionChange(regionFilter === m ? null : m)}>
                <Text style={[styles.chipText, regionFilter === m && styles.chipTextActive]}>{m}</Text>
              </AnimatedPressable>
            ))}
          </ScrollView>
        </>
      )}

      {depts.length > 1 && (
        <>
          <Text style={styles.filterLabel}>Department</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
            <AnimatedPressable variant="subtle" style={[styles.chip, !deptFilter && styles.chipActive]} onPress={() => setDeptFilter(null)}>
              <Text style={[styles.chipText, !deptFilter && styles.chipTextActive]}>All</Text>
            </AnimatedPressable>
            {depts.map(d => (
              <AnimatedPressable key={d} variant="subtle" style={[styles.chip, deptFilter === d && styles.chipActive]} onPress={() => setDeptFilter(deptFilter === d ? null : d)}>
                <Text style={[styles.chipText, deptFilter === d && styles.chipTextActive]}>{d}</Text>
              </AnimatedPressable>
            ))}
          </ScrollView>
        </>
      )}

      <Text style={styles.count}>{filtered.length} contacts</Text>
      {filtered.map(c => (
        <View key={c.id} style={styles.card}>
          <Text style={styles.name}>{c.name}</Text>
          <Text style={styles.role}>{c.role}</Text>
          <Text style={styles.dept}>{c.department}{!regionFilter ? ` · ${getMunicipality(c.department)}` : ''}</Text>
          {c.phone && (
            <AnimatedPressable variant="subtle" onPress={() => Linking.openURL(`tel:${c.phone}`)}>
              <Text style={styles.link}>{c.phone}</Text>
            </AnimatedPressable>
          )}
          {c.email && (
            <AnimatedPressable variant="subtle" onPress={() => Linking.openURL(`mailto:${c.email}`)}>
              <Text style={styles.link}>{c.email}</Text>
            </AnimatedPressable>
          )}
          {c.hours && <Text style={styles.hours}>{c.hours}</Text>}
        </View>
      ))}
      </Container>
    </Wrapper>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 22, fontWeight: '800', color: colors.neutral, marginBottom: 4 },
  subheading: { fontSize: 15, color: colors.neutralVariant, lineHeight: 22, marginBottom: 16 },
  filterLabel: { fontSize: 12, fontWeight: '600', color: colors.neutralVariant, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  chips: { marginBottom: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: colors.outline, marginRight: 8, backgroundColor: colors.surface },
  chipActive: { backgroundColor: colors.neutral, borderColor: colors.neutral },
  chipText: { fontSize: 13, color: colors.neutral, fontWeight: '500' },
  chipTextActive: { color: colors.background },
  count: { fontSize: 13, color: colors.neutralVariant, marginBottom: 12 },
  card: { backgroundColor: colors.surface, borderRadius: radii.sm, padding: 14, marginBottom: 8, ...shadows.card },
  name: { fontSize: 16, fontWeight: '700', color: colors.neutral, marginBottom: 2 },
  role: { fontSize: 14, color: colors.neutral, marginBottom: 2 },
  dept: { fontSize: 12, color: colors.neutralVariant, marginBottom: 6 },
  link: { fontSize: 14, color: colors.primary, fontWeight: '600', marginBottom: 2 },
  hours: { fontSize: 12, color: colors.neutralVariant, marginTop: 4 },
});

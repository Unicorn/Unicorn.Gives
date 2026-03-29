import { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useTheme, fonts, fontSize, letterSpacing, spacing, radii, shadows, type ThemeColors } from '@/constants/theme';
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

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl + spacing.sm },
  heading: { fontFamily: fonts.sansBold, fontSize: fontSize['2xl'], color: colors.neutral, marginBottom: spacing.xs },
  subheading: { fontFamily: fonts.sans, fontSize: fontSize.base, color: colors.neutralVariant, lineHeight: 22, marginBottom: spacing.lg },
  filterLabel: { fontFamily: fonts.sansMedium, fontSize: fontSize.sm, color: colors.neutralVariant, marginBottom: spacing.xs, textTransform: 'uppercase', letterSpacing: letterSpacing.normal },
  chips: { marginBottom: spacing.md },
  chip: { paddingHorizontal: spacing.lg - 2, paddingVertical: spacing.xs + 2, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.outline, marginRight: spacing.sm, backgroundColor: colors.surface },
  chipActive: { backgroundColor: colors.neutral, borderColor: colors.neutral },
  chipText: { fontFamily: fonts.sansMedium, fontSize: fontSize.sm + 1, color: colors.neutral },
  chipTextActive: { color: colors.background },
  count: { fontFamily: fonts.sans, fontSize: fontSize.sm + 1, color: colors.neutralVariant, marginBottom: spacing.md },
  card: { backgroundColor: colors.surface, borderRadius: radii.sm, padding: spacing.lg - 2, marginBottom: spacing.sm, ...shadows.card },
  name: { fontFamily: fonts.sansBold, fontSize: fontSize.lg, color: colors.neutral, marginBottom: 2 },
  role: { fontFamily: fonts.sans, fontSize: fontSize.md, color: colors.neutral, marginBottom: 2 },
  dept: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant, marginBottom: spacing.xs + 2 },
  link: { fontFamily: fonts.sansMedium, fontSize: fontSize.md, color: colors.primary, marginBottom: 2 },
  hours: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant, marginTop: spacing.xs },
});

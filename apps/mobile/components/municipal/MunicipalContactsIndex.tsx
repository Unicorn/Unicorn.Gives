import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Container } from '@/components/layout/Container';
import { Wrapper } from '@/components/layout/Wrapper';
import { RegionHeroSection } from '@/components/municipal/sections/RegionHeroSection';
import { useRegion } from '@/lib/hooks/useRegion';
import { supabase } from '@/lib/supabase';
import { useMunicipalRoute } from '@/lib/useMunicipalRoute';
import { useTheme, fonts, fontSize, spacing, radii } from '@/constants/theme';

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

export function MunicipalContactsIndex() {
  const { colors } = useTheme();
  const { municipalitySlug } = useMunicipalRoute();
  const { region } = useRegion(municipalitySlug);
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
    <Wrapper style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
      <RegionHeroSection
        eyebrow="Contacts"
        headline={region?.name}
        subheadline="Contact information for local officials and departments."
      />
      <Container style={{ paddingTop: spacing.xxl }}>
      <View style={{ paddingHorizontal: spacing.lg }}>
      {depts.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
          <TouchableOpacity style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: radii.pill, borderWidth: 1, borderColor: !deptFilter ? colors.heroBar : colors.outline, marginRight: spacing.sm, backgroundColor: !deptFilter ? colors.heroBar : colors.surface }} onPress={() => setDeptFilter(null)}>
            <Text style={{ fontSize: 13, fontFamily: fonts.sansMedium, color: !deptFilter ? colors.onHeroBar : colors.neutral }}>{`All`}</Text>
          </TouchableOpacity>
          {depts.map(d => (
            <TouchableOpacity key={d} style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: radii.pill, borderWidth: 1, borderColor: deptFilter === d ? colors.heroBar : colors.outline, marginRight: spacing.sm, backgroundColor: deptFilter === d ? colors.heroBar : colors.surface }} onPress={() => setDeptFilter(deptFilter === d ? null : d)}>
              <Text style={{ fontSize: 13, fontFamily: fonts.sansMedium, color: deptFilter === d ? colors.onHeroBar : colors.neutral }}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      {filtered.map(c => (
        <View key={c.id} style={{ backgroundColor: colors.surface, borderRadius: radii.sm, padding: 14, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.outline }}>
          <Text style={{ fontSize: fontSize.lg, fontFamily: fonts.sansBold, color: colors.neutral, marginBottom: 2 }}>{c.name}</Text>
          <Text style={{ fontSize: fontSize.md, fontFamily: fonts.sans, color: colors.neutral, marginBottom: 2 }}>{c.role}</Text>
          <Text style={{ fontSize: fontSize.sm, fontFamily: fonts.sans, color: colors.neutralVariant, marginBottom: 6 }}>{c.department}</Text>
          {c.phone && (
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${c.phone}`)}>
              <Text style={{ fontSize: fontSize.md, fontFamily: fonts.sansMedium, color: colors.primary, marginBottom: 2 }}>{c.phone}{c.phone_ext ? ` ext. ${c.phone_ext}` : ''}</Text>
            </TouchableOpacity>
          )}
          {c.email && (
            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${c.email}`)}>
              <Text style={{ fontSize: fontSize.md, fontFamily: fonts.sans, color: colors.primary, marginBottom: 2 }}>{c.email}</Text>
            </TouchableOpacity>
          )}
          {c.hours && <Text style={{ fontSize: fontSize.sm, fontFamily: fonts.sans, color: colors.neutralVariant, marginTop: spacing.xs }}>{c.hours}</Text>}
        </View>
      ))}
      </View>
      </Container>
    </Wrapper>
  );
}

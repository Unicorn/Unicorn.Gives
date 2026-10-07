import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Linking } from 'react-native';
import { Container } from '@/components/layout/Container';
import { Wrapper } from '@/components/layout/Wrapper';
import { RegionHeroSection } from '@/components/municipal/sections/RegionHeroSection';
import { useRegion } from '@/lib/hooks/useRegion';
import { supabase } from '@/lib/supabase';
import { matchesSearchQuery } from '@/lib/search';
import { useMunicipalRoute } from '@/lib/useMunicipalRoute';
import { useTheme, fonts, fontSize, spacing, radii } from '@/constants/theme';
import { getStaticContacts } from '@/lib/government-snapshot';

/**
 * Matches the minutes index so the municipal index pages behave the same way.
 * Search matters more than the window here: a directory is scanned for a name,
 * so paginating without a way to search would hide people a reader can
 * currently find by scrolling.
 */
const PAGE_SIZE = 25;

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
  // Seeded from the build-time snapshot.
  const [contacts, setContacts] = useState<Contact[]>(() =>
    getStaticContacts<Contact>(region?.id),
  );
  const [deptFilter, setDeptFilter] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // A new search or filter starts from the top of its own result set. Adjusted
  // during render rather than in an effect so the list never paints a stale
  // window first.
  const filterKey = `${search}|${deptFilter ?? ''}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    setVisibleCount(PAGE_SIZE);
  }

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
  const filtered = contacts.filter(c => {
    if (deptFilter && c.department !== deptFilter) return false;
    return matchesSearchQuery(search, [c.name, c.role, c.department, c.email]);
  });
  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visible.length;

  return (
    <Wrapper style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
      <RegionHeroSection
        eyebrow="Contacts"
        headline={region?.name}
        subheadline="Contact information for local officials and departments."
      />
      <Container style={{ paddingTop: spacing.xxl }}>
      <View style={{ paddingHorizontal: spacing.lg }}>
      <TextInput
        style={{ borderWidth: 1, borderColor: colors.outline, borderRadius: radii.sm, padding: spacing.md, fontSize: fontSize.base, fontFamily: fonts.sans, backgroundColor: colors.surface, marginBottom: spacing.md, color: colors.neutral }}
        placeholder="Search by name, role or department..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={colors.neutralVariant}
      />
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
      <Text style={{ fontSize: 13, fontFamily: fonts.sans, color: colors.neutralVariant, marginBottom: spacing.md }}>
        {filtered.length === 0
          ? 'No contacts match your search.'
          : remaining > 0
            ? `Showing ${visible.length} of ${filtered.length} contacts`
            : `${filtered.length} contact${filtered.length === 1 ? '' : 's'}`}
      </Text>
      {visible.map(c => (
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
      {remaining > 0 && (
        <TouchableOpacity
          onPress={() => setVisibleCount((n) => n + PAGE_SIZE)}
          style={{
            alignSelf: 'center',
            marginTop: spacing.md,
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.sm + 2,
            borderRadius: radii.sm,
            borderWidth: 1,
            borderColor: colors.primary,
          }}
        >
          <Text style={{ fontSize: fontSize.md, fontFamily: fonts.sansMedium, color: colors.primary }}>
            {`Show ${Math.min(PAGE_SIZE, remaining)} more`}
          </Text>
        </TouchableOpacity>
      )}
      </View>
      </Container>
    </Wrapper>
  );
}

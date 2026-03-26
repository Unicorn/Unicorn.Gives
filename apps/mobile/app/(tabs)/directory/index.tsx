import { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { routes } from '@/lib/navigation';
import { supabase } from '@/lib/supabase';
import { useTheme, fonts, spacing, radii, shadows } from '@/constants/theme';
import { ContentContainer } from '@/components/layout/ContentContainer';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

interface Partner {
  slug: string;
  name: string;
  description: string | null;
}

export default function PartnersDirectory() {
  const { colors } = useTheme();
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    supabase
      .from('partners')
      .select('slug, name, description')
      .eq('is_active', true)
      .then(({ data }) => { if (data) setPartners(data); });
  }, []);

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ContentContainer>
      <Text style={styles.heading}>Community Partners</Text>
      <Text style={styles.subheading}>Organizations serving Clare County and northern Michigan.</Text>
      {partners.map(p => (
        <Link key={p.slug} href={routes.partners.index(p.slug)} asChild>
          <AnimatedPressable variant="card" style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{p.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.name}>{p.name}</Text>
              {p.description && <Text style={styles.desc} numberOfLines={2}>{p.description}</Text>}
            </View>
          </AnimatedPressable>
        </Link>
      ))}
      {partners.length === 0 && <Text style={styles.empty}>Loading partners...</Text>}
      </ContentContainer>
    </ScrollView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 22, fontWeight: '800', color: colors.neutral, marginBottom: 4 },
  subheading: { fontSize: 15, color: colors.neutralVariant, lineHeight: 22, marginBottom: 16 },
  card: { flexDirection: 'row', borderRadius: radii.md, padding: 16, marginBottom: 10, backgroundColor: colors.surface, ...shadows.card, gap: 14, alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.neutral, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 20, fontWeight: '700', color: colors.background },
  body: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: colors.neutral, marginBottom: 4 },
  desc: { fontSize: 14, color: colors.neutral, lineHeight: 20 },
  empty: { textAlign: 'center', color: colors.neutralVariant, marginTop: 40 },
});

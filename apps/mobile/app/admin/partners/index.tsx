import { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { supabase } from '@/lib/supabase';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';
import { AdminPageShell } from '@/components/admin/AdminPageShell';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { toHref } from '@/lib/navigation';

interface Partner {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  is_active: boolean;
  custom_domain: string | null;
}

interface LandingStatus {
  partner_id: string;
  status: string;
}

export default function PartnersAdminPage() {
  const { colors } = useTheme();
  const router = useRouter();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [partners, setPartners] = useState<Partner[]>([]);
  const [landingStatuses, setLandingStatuses] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: partnerData }, { data: landingData }] = await Promise.all([
        supabase.from('partners').select('id, slug, name, description, is_active, custom_domain').order('name'),
        supabase.from('partner_landing_pages').select('partner_id, status'),
      ]);

      if (partnerData) setPartners(partnerData as Partner[]);
      if (landingData) {
        const map = new Map<string, string>();
        (landingData as LandingStatus[]).forEach((lp) => map.set(lp.partner_id, lp.status));
        setLandingStatuses(map);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>;
  }

  return (
    <AdminPageShell title="Partners" subtitle={`${partners.length} partners`}>
      <Text style={styles.hint}>Manage community partners, landing pages, and custom domains.</Text>

      {partners.map((p) => {
        const lpStatus = landingStatuses.get(p.id);
        return (
          <Pressable
            key={p.id}
            style={[styles.card, !p.is_active && styles.cardInactive]}
            onPress={() => router.push(toHref(`/admin/partners/${p.id}`))}
          >
            <View style={styles.cardBody}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardName}>{p.name}</Text>
                <Text style={styles.cardSlug}>/{p.slug}</Text>
                {p.description && <Text style={styles.cardDesc} numberOfLines={1}>{p.description}</Text>}
              </View>
              <View style={styles.cardRight}>
                <View style={styles.badges}>
                  {!p.is_active && (
                    <View style={styles.inactiveBadge}>
                      <Text style={styles.inactiveBadgeText}>Inactive</Text>
                    </View>
                  )}
                  {lpStatus ? (
                    <AdminStatusBadge status={lpStatus} />
                  ) : (
                    <View style={styles.noLandingBadge}>
                      <Text style={styles.noLandingBadgeText}>No landing page</Text>
                    </View>
                  )}
                </View>
                {p.custom_domain && (
                  <View style={styles.domainRow}>
                    <MaterialIcons name="language" size={14} color={colors.primary} />
                    <Text style={styles.domainText}>{p.custom_domain}</Text>
                  </View>
                )}
                <MaterialIcons name="chevron-right" size={20} color={colors.outlineVariant} />
              </View>
            </View>
          </Pressable>
        );
      })}
    </AdminPageShell>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  hint: { fontFamily: fonts.sans, fontSize: fontSize.sm + 1, color: colors.neutralVariant, marginBottom: spacing.xl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardInactive: { opacity: 0.55 },
  cardBody: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  cardLeft: { flex: 1 },
  cardName: { fontFamily: fonts.sansBold, fontSize: 15, color: colors.neutral },
  cardSlug: { fontFamily: 'monospace', fontSize: 12, color: colors.neutralVariant, marginTop: 2 },
  cardDesc: { fontFamily: fonts.sans, fontSize: 13, color: colors.neutralVariant, marginTop: 4 },
  cardRight: { alignItems: 'flex-end', gap: spacing.xs },
  badges: { flexDirection: 'row', gap: spacing.xs, alignItems: 'center' },
  inactiveBadge: {
    backgroundColor: colors.errorContainer,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.pill,
  },
  inactiveBadgeText: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.error },
  noLandingBadge: {
    backgroundColor: colors.surfaceContainer,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.pill,
  },
  noLandingBadgeText: { fontFamily: fonts.sans, fontSize: 11, color: colors.outlineVariant },
  domainRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  domainText: { fontFamily: fonts.sans, fontSize: 12, color: colors.primary },
});

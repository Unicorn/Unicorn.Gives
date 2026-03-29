import { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';

interface Row {
  id: string;
  region_id: string;
  slug: string;
  title: string;
  kind: string;
  status: string;
  display_order: number;
}

export default function MunicipalDocumentsAdminScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('municipal_documents')
      .select('id, region_id, slug, title, kind, status, display_order')
      .order('display_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setRows(data as Row[]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.content}>
      <Text style={[styles.heading, { color: colors.neutral }]}>Municipal documents</Text>
      <Text style={[styles.sub, { color: colors.neutralVariant }]}>
        Region-scoped official PDFs (planning, zoning, recreation). Edit rows in Supabase or extend this
        screen with forms later.
      </Text>
      {rows.length === 0 ? (
        <Text style={{ color: colors.neutralVariant, marginTop: spacing.lg }}>No rows yet. Run migrations and seed.</Text>
      ) : (
        rows.map((r) => (
          <View key={r.id} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
            <Text style={[styles.cardTitle, { color: colors.neutral }]}>{r.title}</Text>
            <Text style={[styles.cardMeta, { color: colors.neutralVariant }]}>
              {r.slug} · {r.kind} · {r.status} · order {r.display_order}
            </Text>
            <Text style={[styles.cardMeta, { color: colors.neutralVariant }]}>region_id: {r.region_id}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function createStyles(colors: ReturnType<typeof useTheme>['colors']) {
  return StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl },
    content: { padding: spacing.lg, paddingBottom: 48, gap: spacing.md },
    heading: { fontFamily: fonts.serifBold, fontSize: 24 },
    sub: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 20, marginTop: spacing.xs },
    card: {
      borderRadius: radii.md,
      borderWidth: 1,
      padding: spacing.md,
      marginTop: spacing.sm,
    },
    cardTitle: { fontFamily: fonts.sansBold, fontSize: 15 },
    cardMeta: { fontFamily: fonts.sans, fontSize: 12, marginTop: 4 },
  });
}

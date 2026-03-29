import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useTheme, spacing, radii } from '@/constants/theme';
import { Wrapper } from '@/components/layout/Wrapper';
import { Container } from '@/components/layout/Container';

export default function EventDetail() {
  const { colors } = useTheme();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    supabase.from('events').select('*').eq('slug', slug).single()
      .then(({ data }) => { if (data) setItem(data); });
  }, [slug]);

  if (!item) return <View style={{ flex: 1, backgroundColor: colors.background }}><Text style={[styles.loading, { color: colors.neutralVariant }]}>Loading...</Text></View>;

  return (
    <Wrapper contentContainerStyle={styles.content}>
      <Container>
        <Text style={[styles.title, { color: colors.neutral }]}>{item.title}</Text>
        <View style={[styles.metaBox, { backgroundColor: colors.surfaceContainer }]}>
          <Text style={[styles.metaLabel, { color: colors.neutralVariant }]}>Date</Text>
          <Text style={[styles.metaValue, { color: colors.neutral }]}>{new Date(item.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</Text>
          {item.time && <><Text style={[styles.metaLabel, { color: colors.neutralVariant }]}>Time</Text><Text style={[styles.metaValue, { color: colors.neutral }]}>{item.time}</Text></>}
          {item.location && <><Text style={[styles.metaLabel, { color: colors.neutralVariant }]}>Location</Text><Text style={[styles.metaValue, { color: colors.neutral }]}>{item.location}</Text></>}
          {item.cost && <><Text style={[styles.metaLabel, { color: colors.neutralVariant }]}>Cost</Text><Text style={[styles.metaValue, { color: colors.neutral }]}>{item.cost}</Text></>}
          {item.recurring && <><Text style={[styles.metaLabel, { color: colors.neutralVariant }]}>Recurrence</Text><Text style={[styles.metaValue, { color: colors.neutral }]}>{item.recurrence_rule || 'Recurring'}</Text></>}
        </View>
        <MarkdownRenderer content={item.body} />
      </Container>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingBottom: 60 },
  loading: { padding: spacing.xxl, textAlign: 'center' },
  title: { fontSize: 24, fontWeight: '800', marginBottom: spacing.lg },
  metaBox: { borderRadius: radii.sm, padding: 14, marginBottom: spacing.xl, gap: spacing.xs },
  metaLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 6 },
  metaValue: { fontSize: 15, fontWeight: '500' },
});

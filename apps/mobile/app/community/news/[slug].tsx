import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useTheme, fonts, spacing, radii } from '@/constants/theme';

export default function NewsDetail() {
  const { colors } = useTheme();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    supabase.from('news').select('*').eq('slug', slug).single()
      .then(({ data }) => { if (data) setItem(data); });
  }, [slug]);

  if (!item) return <View style={[styles.container, { backgroundColor: colors.background }]}><Text style={[styles.loading, { color: colors.neutralVariant }]}>Loading...</Text></View>;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.category, { color: colors.neutralVariant }]}>{item.category.replace(/-/g, ' ').toUpperCase()}</Text>
        <Text style={[styles.title, { color: colors.neutral }]}>{item.title}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.date, { color: colors.neutralVariant }]}>
            {new Date(item.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>
          {item.author_name && <Text style={[styles.author, { color: colors.neutralVariant }]}>by {item.author_name}</Text>}
        </View>
        {item.source && (
          <Text style={[styles.source, { color: colors.neutralVariant }]}>Source: {item.source}</Text>
        )}
      </View>
      {item.body && <MarkdownRenderer content={item.body} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 60 },
  loading: { padding: spacing.xxl, textAlign: 'center' },
  header: { marginBottom: spacing.xl, gap: spacing.xs },
  category: { fontFamily: fonts.sansBold, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase' },
  title: { fontFamily: fonts.sansBold, fontSize: 24, lineHeight: 30 },
  metaRow: { gap: spacing.xs, marginTop: spacing.xs },
  date: { fontFamily: fonts.sans, fontSize: 14 },
  author: { fontFamily: fonts.sans, fontSize: 14 },
  source: { fontFamily: fonts.sans, fontSize: 12, marginTop: spacing.xs },
});

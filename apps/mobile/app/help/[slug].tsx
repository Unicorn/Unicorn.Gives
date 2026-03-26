import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';

export default function HelpDetailRedirect() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const target = slug ? `/solve/${encodeURIComponent(slug)}` : '/solve';

  useEffect(() => {
    if (!slug) return;
    router.replace(target);
  }, [router, slug, target]);

  return (
    <View style={styles.c}>
      <Text style={styles.t}>Redirecting to Problem Solver…</Text>
      <Link href={target} asChild>
        <TouchableOpacity style={styles.link} activeOpacity={0.85}>
          <Text style={styles.linkText}>Open guide</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, backgroundColor: '#fcf9f4', justifyContent: 'center', alignItems: 'center', padding: 24 },
  t: { color: '#73796d', fontSize: 16, marginBottom: 14, textAlign: 'center' },
  link: { backgroundColor: '#2d4a4a', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16 },
  linkText: { color: '#fcf9f4', fontWeight: '900' },
});


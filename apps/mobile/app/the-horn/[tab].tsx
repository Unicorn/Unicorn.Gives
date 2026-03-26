import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';

export function generateStaticParams() {
  return [
    { tab: 'about' },
    { tab: 'hours-horn' },
    { tab: 'hours' },
    { tab: 'events' },
    { tab: 'membership' },
  ];
}

export default function TheHornTabRedirect() {
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab: string }>();

  const target = useMemo(() => {
    const t = tab?.trim();
    if (!t) return '/about-the-horn';
    if (t === 'about') return '/about-the-horn';
    if (t === 'events') return '/events-horn';
    if (t === 'membership') return '/membership';
    if (t === 'hours' || t === 'hours-horn' || t === 'contact') return '/hours-horn';
    return '/about-the-horn';
  }, [tab]);

  useEffect(() => {
    router.replace(target);
  }, [router, target]);

  return (
    <View style={styles.c}>
      <Text style={styles.t}>Redirecting to The Horn…</Text>
      <Link href={target} asChild>
        <TouchableOpacity style={styles.link} activeOpacity={0.85}>
          <Text style={styles.linkText}>Open tab</Text>
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


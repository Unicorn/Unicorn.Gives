import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';

const COUNTY_SLUG = 'clare-county';
const TOWNSHIP_SLUG = 'lincoln-township';

export default function MinutesDetailRedirect() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const target = slug
    ? `/county/${COUNTY_SLUG}/townships/${TOWNSHIP_SLUG}/minutes/${encodeURIComponent(slug)}`
    : `/county/${COUNTY_SLUG}/townships/${TOWNSHIP_SLUG}/minutes`;

  useEffect(() => {
    router.replace(target);
  }, [router, target]);

  return (
    <View style={styles.c}>
      <Text style={styles.t}>Redirecting to Minutes Detail…</Text>
      <Link href={target} asChild>
        <TouchableOpacity style={styles.link} activeOpacity={0.85}>
          <Text style={styles.linkText}>Open minutes</Text>
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


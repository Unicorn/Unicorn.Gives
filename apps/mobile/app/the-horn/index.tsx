import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function TheHornLandingRedirect() {
  const router = useRouter();
  const target = '/about-the-horn';

  useEffect(() => {
    router.replace(target);
  }, [router]);

  return (
    <View style={styles.c}>
      <Text style={styles.t}>Redirecting to The Horn…</Text>
      <Link href={target} asChild>
        <TouchableOpacity style={styles.link} activeOpacity={0.85}>
          <Text style={styles.linkText}>Open The Horn</Text>
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


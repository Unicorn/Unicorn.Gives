import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from './auth';

function LoadingView() {
  return (
    <View style={styles.center}>
      <ActivityIndicator />
      <Text style={styles.loadingText}>Loading…</Text>
    </View>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace('/sign-in');
  }, [loading, user, router]);

  if (loading) return <LoadingView />;
  if (!user) return null;
  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/sign-in');
      return;
    }
    if (role !== 'super_admin') {
      router.replace('/' as any); // safe fallback; admin-only in this phase
    }
  }, [loading, role, user, router]);

  if (loading) return <LoadingView />;

  if (!user) return null;
  if (role !== 'super_admin') {
    return (
      <View style={styles.center}>
        <Text style={styles.deniedTitle}>Access denied</Text>
        <Text style={styles.deniedBody}>You do not have permission to view this page.</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, gap: 12 },
  loadingText: { color: '#73796d' },
  deniedTitle: { fontSize: 20, fontWeight: '900', color: '#2d4a4a' },
  deniedBody: { fontSize: 14, color: '#73796d', textAlign: 'center', lineHeight: 20 },
});


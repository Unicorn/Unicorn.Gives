import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuth } from './auth';
import { useTheme, fonts } from '@/constants/theme';

function LoadingView() {
  const { colors } = useTheme();
  return (
    <View style={[styles.center, { backgroundColor: colors.background }]}>
      <ActivityIndicator color={colors.primary} />
      <Text style={[styles.loadingText, { color: colors.neutralVariant }]}>Loading…</Text>
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
  const { colors } = useTheme();

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
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.deniedTitle, { color: colors.neutral }]}>Access denied</Text>
        <Text style={[styles.deniedBody, { color: colors.neutralVariant }]}>You do not have permission to view this page.</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, gap: 12 },
  loadingText: { fontFamily: fonts.sans, fontSize: 14 },
  deniedTitle: { fontFamily: fonts.sansBold, fontSize: 20 },
  deniedBody: { fontFamily: fonts.sans, fontSize: 14, textAlign: 'center', lineHeight: 20 },
});

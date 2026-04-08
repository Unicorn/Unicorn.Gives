import { Stack } from 'expo-router';

import { RequireAuth } from '@/lib/routeGuards';

/**
 * Real URL segment `/user/*`. All nested routes require a session.
 */
export default function UserLayout() {
  return (
    <RequireAuth>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="account" />
      </Stack>
    </RequireAuth>
  );
}

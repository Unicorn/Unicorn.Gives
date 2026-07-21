import { Stack } from 'expo-router';
import { RequireModule } from '@/lib/routeGuards';

export default function GovernmentRootLayout() {
  return (
    <RequireModule module="municipal">
      <Stack screenOptions={{ headerShown: false }} />
    </RequireModule>
  );
}

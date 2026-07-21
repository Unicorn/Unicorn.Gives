import { Stack } from 'expo-router';
import { RequireModule } from '@/lib/routeGuards';

export default function PartnersRootLayout() {
  return (
    <RequireModule module="directory">
      <Stack screenOptions={{ headerShown: false }} />
    </RequireModule>
  );
}

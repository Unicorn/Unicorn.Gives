import { Stack } from 'expo-router';
import { RequireModule } from '@/lib/routeGuards';
import { registerGovernmentSnapshot } from '@/lib/government-snapshot';
import governmentSnapshot from '@/lib/government-snapshot-data.json';

// Registered at module scope so the data sits in this layout's chunk only (see lib/*-snapshot.ts).
registerGovernmentSnapshot(governmentSnapshot);

export default function GovernmentRootLayout() {
  return (
    <RequireModule module="municipal">
      <Stack screenOptions={{ headerShown: false }} />
    </RequireModule>
  );
}

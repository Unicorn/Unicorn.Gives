import { Stack } from 'expo-router';
import { RequireModule } from '@/lib/routeGuards';
import { registerPartnerContent } from '@/lib/partner-content-static';
import partnerContent from '@/lib/partner-content-data.json';

// Registered at module scope so the data sits in this layout's chunk only (see lib/*-snapshot.ts).
registerPartnerContent(partnerContent);

export default function PartnersRootLayout() {
  return (
    <RequireModule module="directory">
      <Stack screenOptions={{ headerShown: false }} />
    </RequireModule>
  );
}

import { Stack } from 'expo-router';
import { RequireModule } from '@/lib/routeGuards';

export default function BingoLayout() {
  return (
    <RequireModule module="games">
      <Stack screenOptions={{ headerShown: false }} />
    </RequireModule>
  );
}

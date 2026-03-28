import { Stack, usePathname } from 'expo-router';
import { paths } from '@/lib/navigation';

export default function HistoryLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

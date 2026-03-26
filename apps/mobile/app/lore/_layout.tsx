import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';
import { paths } from '@/lib/navigation';

export default function LoreLayout() {
  const pathname = usePathname();
  const isDetail =
    pathname !== paths.lore.index && pathname.startsWith(`${paths.lore.index}/`);

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Land & Lore" showBack={isDetail} />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

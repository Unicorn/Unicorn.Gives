import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';

export default function GuidesLayout() {
  const pathname = usePathname();
  const isDetail = pathname !== '/guides' && pathname.startsWith('/guides/');

  return (
    <View style={{ flex: 1 }}>
      <AppHeader showBack={isDetail} />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

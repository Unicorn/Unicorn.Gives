import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';

export default function GovernmentTabLayout() {
  const pathname = usePathname();
  const isDeep = pathname !== '/government' && pathname.startsWith('/government/');

  return (
    <View style={{ flex: 1 }}>
      <AppHeader title="Government" showBack={isDeep} />
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

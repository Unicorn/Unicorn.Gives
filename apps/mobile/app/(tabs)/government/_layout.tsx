import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';
import { ContentContainer } from '@/components/layout/ContentContainer';

export default function GovernmentTabLayout() {
  const pathname = usePathname();
  const isDeep = pathname !== '/government' && pathname.startsWith('/government/');

  return (
    <View style={{ flex: 1 }}>
      <AppHeader showBack={isDeep} />
      <ContentContainer>
        <Stack screenOptions={{ headerShown: false }} />
      </ContentContainer>
    </View>
  );
}

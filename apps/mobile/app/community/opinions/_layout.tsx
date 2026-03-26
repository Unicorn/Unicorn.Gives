import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';
import { ContentContainer } from '@/components/layout/ContentContainer';
import { paths } from '@/lib/navigation';

export default function OpinionsLayout() {
  const pathname = usePathname();
  const isDetail =
    pathname !== paths.community.opinions &&
    pathname.startsWith(`${paths.community.opinions}/`);

  return (
    <View style={{ flex: 1 }}>
      <AppHeader showBack={isDetail} />
      <ContentContainer>
        <Stack screenOptions={{ headerShown: false }} />
      </ContentContainer>
    </View>
  );
}

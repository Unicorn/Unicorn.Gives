import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';
import { ContentContainer } from '@/components/layout/ContentContainer';
import { paths } from '@/lib/navigation';

export default function CommunityEventsLayout() {
  const pathname = usePathname();
  const isDetail =
    pathname !== paths.community.events &&
    pathname.startsWith(`${paths.community.events}/`);

  return (
    <View style={{ flex: 1 }}>
      <AppHeader showBack={isDetail} />
      <ContentContainer>
        <Stack screenOptions={{ headerShown: false }} />
      </ContentContainer>
    </View>
  );
}

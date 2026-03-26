import { View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { AppHeader } from '@/components/layout/AppHeader';
import { SubTabs, type SubTabItem } from '@/components/layout/SubTabs';
import { toHref } from '@/lib/navigation';

const DIR_TABS: SubTabItem[] = [
  { label: 'Partners', href: toHref('/directory') },
  { label: 'Contacts', href: toHref('/directory/contacts') },
];

export default function DirectoryLayout() {
  const pathname = usePathname();
  const isDetail = pathname !== '/directory' && pathname !== '/directory/contacts' && pathname.startsWith('/directory/');

  return (
    <View style={{ flex: 1 }}>
      <AppHeader showBack={isDetail} />
      {!isDetail && <SubTabs tabs={DIR_TABS} />}
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

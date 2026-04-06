import { Tabs } from 'expo-router';
import { Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { breakpoints, useTheme } from '@/constants/theme';
import { useHydratedDimensions } from '@/hooks/useHydrated';

const TAB_ICONS: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  Home: 'home',
  Guides: 'menu-book',
  Government: 'account-balance',
  Directory: 'contacts',
};

function TabIcon({ label, focused, color }: { label: string; focused: boolean; color: string }) {
  return (
    <MaterialIcons
      name={TAB_ICONS[label] ?? 'circle'}
      size={24}
      color={color}
    />
  );
}

export default function TabLayout() {
  const { width } = useHydratedDimensions();
  const isDesktop = width >= breakpoints.desktop;
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.neutralVariant,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 8,
          ...(isDesktop ? { display: 'none' as const } : {}),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => <TabIcon label="Home" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="guides"
        options={{
          title: 'Guides',
          tabBarIcon: ({ focused, color }) => <TabIcon label="Guides" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="government"
        options={{
          title: 'Government',
          tabBarIcon: ({ focused, color }) => <TabIcon label="Government" focused={focused} color={color} />,
        }}
      />
      <Tabs.Screen
        name="directory"
        options={{
          title: 'Directory',
          tabBarIcon: ({ focused, color }) => <TabIcon label="Directory" focused={focused} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({});

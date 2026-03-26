import { Tabs } from 'expo-router';
import { Text, StyleSheet, useWindowDimensions } from 'react-native';

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Guides: '📋',
    Government: '🏛️',
    Directory: '📇',
  };
  return (
    <Text style={[styles.icon, focused && styles.iconFocused]}>
      {icons[label] ?? '•'}
    </Text>
  );
}

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2d6a4f',
        tabBarInactiveTintColor: '#73796d',
        tabBarStyle: {
          backgroundColor: '#fcf9f4',
          borderTopWidth: 1,
          borderTopColor: '#c3c8bb',
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
          tabBarIcon: ({ focused }) => <TabIcon label="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="guides"
        options={{
          title: 'Guides',
          tabBarIcon: ({ focused }) => <TabIcon label="Guides" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="government"
        options={{
          title: 'Government',
          tabBarIcon: ({ focused }) => <TabIcon label="Government" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="directory"
        options={{
          title: 'Directory',
          tabBarIcon: ({ focused }) => <TabIcon label="Directory" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: { fontSize: 22 },
  iconFocused: { opacity: 1 },
});

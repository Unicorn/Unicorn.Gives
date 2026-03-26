import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider } from '@/lib/auth';
import { DrawerMenu } from '@/components/layout/DrawerMenu';
import { AppHeader } from '@/components/layout/AppHeader';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Drawer
          drawerContent={() => <DrawerMenu />}
          screenOptions={{
            header: ({ options }) => (
              <AppHeader title={options.title} />
            ),
            drawerStyle: {
              width: 300,
            },
          }}
        >
          <Drawer.Screen name="index" options={{ title: 'Land of the Unicorns' }} />
          <Drawer.Screen name="lore" options={{ title: 'Land & Lore', headerShown: false }} />
          <Drawer.Screen name="help" options={{ title: 'Get Help', headerShown: false }} />
          <Drawer.Screen name="region" options={{ title: 'Government', headerShown: false }} />
          <Drawer.Screen name="news" options={{ title: 'News', headerShown: false }} />
          <Drawer.Screen name="events" options={{ title: 'Events', headerShown: false }} />
          <Drawer.Screen name="partners" options={{ title: 'Partners', headerShown: false }} />
          <Drawer.Screen name="(auth)" options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} />
          <Drawer.Screen name="+not-found" options={{ drawerItemStyle: { display: 'none' } }} />
        </Drawer>
      </ThemeProvider>
    </AuthProvider>
  );
}

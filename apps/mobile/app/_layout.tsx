import {
  Manrope_400Regular,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import {
  Newsreader_400Regular,
  Newsreader_400Regular_Italic,
  Newsreader_700Bold,
} from '@expo-google-fonts/newsreader';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useCallback, useMemo } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider } from '@/lib/auth';
import { DrawerMenu } from '@/components/layout/DrawerMenu';
import { AppHeader } from '@/components/layout/AppHeader';
import { ThemeOverrideContext } from '@/constants/theme';
import { ThemeToggleContext } from '@/lib/themeToggle';
import {
  ThemePreferenceProvider,
  type ThemePreference,
} from '@/lib/themePreference';

const THEME_STORAGE_KEY = '@uni-gives/theme-preference';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Manrope_400Regular,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Newsreader_400Regular,
    Newsreader_400Regular_Italic,
    Newsreader_700Bold,
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
  const [themeOverride, setThemeOverride] = useState<'light' | 'dark' | null>('light');
  const effectiveScheme = themeOverride ?? colorScheme;

  useEffect(() => {
    let alive = true;
    void AsyncStorage.getItem(THEME_STORAGE_KEY).then((raw) => {
      if (!alive) return;
      if (raw === 'system') setThemeOverride(null);
      else if (raw === 'dark') setThemeOverride('dark');
      else setThemeOverride('light');
    });
    return () => {
      alive = false;
    };
  }, []);

  const setPreference = useCallback((pref: ThemePreference) => {
    const next = pref === 'system' ? null : pref;
    setThemeOverride(next);
    void AsyncStorage.setItem(THEME_STORAGE_KEY, pref);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeOverride((prev) => {
      const next =
        prev === null ? (colorScheme === 'dark' ? 'light' : 'dark') : prev === 'dark' ? 'light' : 'dark';
      void AsyncStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  }, [colorScheme]);

  const preference: ThemePreference = themeOverride === null ? 'system' : themeOverride;
  const themePreferenceValue = useMemo(
    () => ({ preference, setPreference }),
    [preference, setPreference],
  );

  return (
    <AuthProvider>
      <ThemeOverrideContext.Provider value={themeOverride}>
      <ThemePreferenceProvider value={themePreferenceValue}>
      <ThemeToggleContext.Provider value={toggleTheme}>
      <ThemeProvider value={effectiveScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Drawer
          drawerContent={(props) => <DrawerMenu drawerNavigation={props.navigation} />}
          screenOptions={{
            header: () => <AppHeader />,
            drawerStyle: {
              width: 300,
            },
          }}
        >
          <Drawer.Screen name="(tabs)" options={{ title: 'Land of the Unicorns', headerShown: false }} />
          {/* Deep-link routes — hidden from drawer, pushed onto tab stacks */}
          <Drawer.Screen name="government" options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} />
          <Drawer.Screen name="partners" options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} />
          <Drawer.Screen name="(auth)" options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} />
          <Drawer.Screen name="user" options={{ drawerItemStyle: { display: 'none' } }} />
          <Drawer.Screen name="admin" options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} />
          <Drawer.Screen name="styleguide" options={{ title: 'Styleguide', drawerItemStyle: { display: 'none' } }} />
          <Drawer.Screen name="+not-found" options={{ drawerItemStyle: { display: 'none' } }} />
        </Drawer>
      </ThemeProvider>
      </ThemeToggleContext.Provider>
      </ThemePreferenceProvider>
      </ThemeOverrideContext.Provider>
    </AuthProvider>
  );
}

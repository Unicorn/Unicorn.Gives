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
import { Platform } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { usePathname } from 'expo-router';
import { AuthProvider } from '@/lib/auth';
import { FeatureModulesProvider } from '@/lib/featureModules';
import { DrawerMenu } from '@/components/layout/DrawerMenu';
import { AppHeader } from '@/components/layout/AppHeader';
import { ThemeOverrideContext } from '@/constants/theme';
import { ThemeToggleContext } from '@/lib/themeToggle';
import {
  ThemePreferenceProvider,
  type ThemePreference,
} from '@/lib/themePreference';
import { useIsHydrated } from '@/hooks/useHydrated';
import { isSsrSafeRoute } from '@/lib/ssrRoutes';

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

  // Web static export must not return an empty shell while fonts load.
  if (!loaded && Platform.OS !== 'web') {
    return null;
  }

  return <HydrationGate />;
}

/**
 * Most routes fetch their content in `useEffect`, so the server renders a
 * loading state the client cannot reproduce — React 19 treats that mismatch as
 * fatal (#418). Rendering nothing until hydrated keeps those routes safe.
 *
 * Routes listed in `isSsrSafeRoute` seed their first render from a build-time
 * snapshot, so server and client agree and the tree can render during the
 * hydration pass — which is what puts real content in the exported HTML.
 */
function HydrationGate() {
  const hydrated = useIsHydrated();
  const pathname = usePathname();

  if (!hydrated && !isSsrSafeRoute(pathname)) {
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
      <FeatureModulesProvider>
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
          <Drawer.Screen name="bingo" options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} />
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
      </FeatureModulesProvider>
    </AuthProvider>
  );
}

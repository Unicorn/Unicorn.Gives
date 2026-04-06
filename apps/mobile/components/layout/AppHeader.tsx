import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import { Link, useRouter, usePathname } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { toHref } from '@/lib/navigation';
import { breakpoints, useTheme, fonts, fontSize, spacing, radii } from '@/constants/theme';
import { useHydratedDimensions } from '@/hooks/useHydrated';
import { HeaderUserMenu } from './HeaderUserMenu';

// Re-export for backwards compat
export { AppBreadcrumbBar } from './AppBreadcrumbBar';
export type { BreadcrumbItem } from './AppBreadcrumbBar';

interface AppHeaderProps {
  showBack?: boolean;
  /** @deprecated Title is no longer displayed — logo replaces it. Kept for compat. */
  title?: string;
}

const NAV_LINKS = [
  { label: 'Home', href: '/home' },
  { label: 'Guides', href: '/guides' },
  { label: 'Government', href: '/government' },
  { label: 'Directory', href: '/directory' },
];

function isUserScopedPath(pathname: string) {
  return pathname === '/user' || pathname.startsWith('/user/');
}

export function AppHeader({ showBack = false }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const effectiveShowBack = showBack || isUserScopedPath(pathname);
  const { user } = useAuth();
  const { width } = useHydratedDimensions();
  const isDesktop = width >= breakpoints.desktop;
  const [menuOpen, setMenuOpen] = useState(false);
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, isDesktop && styles.headerDesktop]}>
        {/* Left: Logo or Back */}
        {effectiveShowBack ? (
          <Pressable style={styles.leftZone} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.neutral} />
          </Pressable>
        ) : (
          <Link href={toHref('/home')} asChild>
            <Pressable style={styles.leftZone}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={[styles.logo, isDark && { opacity: 0.8 }]}
                resizeMode="contain"
                accessibilityLabel="unicorn.gives logo"
              />
            </Pressable>
          </Link>
        )}

        {/* Center: Desktop nav */}
        <View style={styles.centerZone}>
          {isDesktop && (
            <View style={styles.desktopNav}>
              {NAV_LINKS.map((link) => {
                const active =
                  pathname === link.href ||
                  pathname.startsWith(link.href + '/');
                return (
                  <Link key={link.href} href={toHref(link.href)} asChild>
                    <Pressable style={styles.navLinkWrap}>
                      <Text
                        style={[
                          styles.navLink,
                          { color: `${colors.neutral}B3` },
                          active && { color: colors.neutral, fontFamily: fonts.serifBold },
                        ]}
                      >
                        {link.label}
                      </Text>
                    </Pressable>
                  </Link>
                );
              })}
            </View>
          )}
        </View>

        {/* Right: User icon */}
        <Pressable style={styles.rightZone} onPress={() => setMenuOpen(true)}>
          <MaterialIcons
            name={user ? 'account-circle' : 'person-outline'}
            size={28}
            color={colors.neutralVariant}
          />
        </Pressable>
      </View>

      <HeaderUserMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'web' ? 0 : 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: spacing.md,
  },
  headerDesktop: {
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
  },
  leftZone: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: spacing.lg,
  },
  centerZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desktopNav: {
    flexDirection: 'row',
    gap: spacing.xxxl,
    alignItems: 'center',
  },
  navLinkWrap: {
    paddingVertical: spacing.xs,
  },
  navLink: {
    fontSize: fontSize.lg,
    fontFamily: fonts.serif,
  },
  rightZone: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Platform,
  useWindowDimensions,
  Modal,
} from 'react-native';
import { Link, useRouter, usePathname } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { routes, toHref } from '@/lib/navigation';
import { breakpoints, useTheme, fonts } from '@/constants/theme';
import { useThemeToggle } from '@/lib/themeToggle';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

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
  const { user, signOut } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= breakpoints.desktop;
  const [menuOpen, setMenuOpen] = useState(false);
  const { colors, isDark } = useTheme();
  const toggleTheme = useThemeToggle();

  function handleAvatarPress() {
    setMenuOpen(true);
  }

  function handleMenuAction(action: string) {
    setMenuOpen(false);
    switch (action) {
      case 'logout':
        signOut();
        break;
      case 'login':
        router.push(toHref('/sign-in'));
        break;
      case 'register':
        router.push(toHref('/sign-up'));
        break;
      case 'theme':
        toggleTheme();
        break;
      case 'account':
        router.push(routes.user.index());
        break;
      case 'profile':
        router.push(routes.user.profile());
        break;
      case 'settings':
        router.push(routes.user.settings());
        break;
    }
  }

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

        {/* Center: Desktop main nav (tabs cover primary nav on narrow screens) */}
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
        <Pressable style={styles.rightZone} onPress={handleAvatarPress}>
          <MaterialIcons
            name={user ? 'account-circle' : 'person-outline'}
            size={28}
            color={colors.neutralVariant}
          />
        </Pressable>
      </View>

      {/* Popover menu */}
      {menuOpen && (
        <Modal transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
          <Pressable style={styles.overlay} onPress={() => setMenuOpen(false)}>
            <View style={[styles.popover, { backgroundColor: colors.surface }]}>
              {/* Theme toggle — always visible */}
              <AnimatedPressable variant="subtle" style={styles.popoverItem} onPress={() => handleMenuAction('theme')}>
                <View style={styles.popoverRow}>
                  <MaterialIcons name={isDark ? 'light-mode' : 'dark-mode'} size={18} color={colors.neutral} />
                  <Text style={[styles.popoverText, { color: colors.neutral }]}>
                    {isDark ? 'Light mode' : 'Dark mode'}
                  </Text>
                </View>
              </AnimatedPressable>

              <View style={[styles.popoverDivider, { backgroundColor: colors.outlineVariant }]} />

              {user ? (
                <>
                  <AnimatedPressable variant="subtle" style={styles.popoverItem} onPress={() => handleMenuAction('account')}>
                    <View style={styles.popoverRow}>
                      <MaterialIcons name="manage-accounts" size={18} color={colors.neutral} />
                      <Text style={[styles.popoverText, { color: colors.neutral }]}>Account</Text>
                    </View>
                  </AnimatedPressable>
                  <AnimatedPressable variant="subtle" style={styles.popoverItem} onPress={() => handleMenuAction('profile')}>
                    <View style={styles.popoverRow}>
                      <MaterialIcons name="person" size={18} color={colors.neutral} />
                      <Text style={[styles.popoverText, { color: colors.neutral }]}>Profile</Text>
                    </View>
                  </AnimatedPressable>
                  <AnimatedPressable variant="subtle" style={styles.popoverItem} onPress={() => handleMenuAction('settings')}>
                    <View style={styles.popoverRow}>
                      <MaterialIcons name="settings" size={18} color={colors.neutral} />
                      <Text style={[styles.popoverText, { color: colors.neutral }]}>Settings</Text>
                    </View>
                  </AnimatedPressable>
                  <View style={[styles.popoverDivider, { backgroundColor: colors.outlineVariant }]} />
                  <AnimatedPressable variant="subtle" style={styles.popoverItem} onPress={() => handleMenuAction('logout')}>
                    <View style={styles.popoverRow}>
                      <MaterialIcons name="logout" size={18} color={colors.error} />
                      <Text style={[styles.popoverText, { color: colors.error }]}>Logout</Text>
                    </View>
                  </AnimatedPressable>
                </>
              ) : (
                <>
                  <AnimatedPressable variant="subtle" style={styles.popoverItem} onPress={() => handleMenuAction('login')}>
                    <View style={styles.popoverRow}>
                      <MaterialIcons name="login" size={18} color={colors.neutral} />
                      <Text style={[styles.popoverText, { color: colors.neutral }]}>Log in</Text>
                    </View>
                  </AnimatedPressable>
                  <AnimatedPressable variant="subtle" style={styles.popoverItem} onPress={() => handleMenuAction('register')}>
                    <View style={styles.popoverRow}>
                      <MaterialIcons name="person-add" size={18} color={colors.neutral} />
                      <Text style={[styles.popoverText, { color: colors.neutral }]}>Register</Text>
                    </View>
                  </AnimatedPressable>
                </>
              )}
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

/** Renders below primary header + sub-tabs; keeps top header on main nav only. */
export function AppBreadcrumbBar({ items }: { items: BreadcrumbItem[] }) {
  const { colors } = useTheme();

  if (!items.length) return null;

  return (
    <View style={[breadcrumbBarStyles.wrap, { backgroundColor: colors.surface, borderBottomColor: colors.outlineVariant }]}>
      <View style={breadcrumbBarStyles.inner}>
        <View style={breadcrumbBarStyles.row}>
          {items.map((crumb, i) => {
            const isLast = i === items.length - 1;
            const itemKey = crumb.href || `trail:${crumb.label}`;
            return (
              <View key={itemKey} style={breadcrumbBarStyles.item}>
                {i > 0 && (
                  <Text style={[breadcrumbBarStyles.sep, { color: `${colors.neutral}66` }]}>{'>'}</Text>
                )}
                {!isLast && crumb.href ? (
                  <Link href={toHref(crumb.href)} asChild>
                    <Pressable>
                      <Text style={[breadcrumbBarStyles.link, { color: colors.primary }]}>{crumb.label}</Text>
                    </Pressable>
                  </Link>
                ) : (
                  <Text style={[breadcrumbBarStyles.current, { color: colors.neutral }]}>{crumb.label}</Text>
                )}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const breadcrumbBarStyles = StyleSheet.create({
  wrap: {
    borderBottomWidth: 1,
  },
  inner: {
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sep: {
    fontSize: 12,
  },
  link: {
    fontSize: 13,
    fontWeight: '600',
  },
  current: {
    fontSize: 13,
    fontWeight: '700',
  },
});

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
    paddingHorizontal: 12,
  },
  headerDesktop: {
    maxWidth: 1100,
    alignSelf: 'center',
    width: '100%',
  },

  /* Left zone */
  leftZone: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  /* Center zone */
  centerZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desktopNav: {
    flexDirection: 'row',
    gap: 32,
    alignItems: 'center',
  },
  navLinkWrap: {
    paddingVertical: 4,
  },
  navLink: {
    fontSize: 16,
    fontFamily: fonts.serif,
  },

  /* Right zone */
  rightZone: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Popover */
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'web' ? 56 : 100,
    paddingRight: 12,
  },
  popover: {
    borderRadius: 12,
    paddingVertical: 4,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  popoverItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  popoverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  popoverText: {
    fontSize: 15,
    fontWeight: '500',
  },
  popoverDivider: {
    height: 1,
    marginHorizontal: 12,
  },
});

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
import { toHref } from '@/lib/navigation';
import { useTheme, fonts } from '@/constants/theme';
import { useThemeToggle } from '@/lib/themeToggle';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface AppHeaderProps {
  showBack?: boolean;
  breadcrumb?: BreadcrumbItem[];
  /** @deprecated Title is no longer displayed — logo replaces it. Kept for compat. */
  title?: string;
}

const NAV_LINKS = [
  { label: 'Home', href: '/home' },
  { label: 'Guides', href: '/guides' },
  { label: 'Government', href: '/government' },
  { label: 'Directory', href: '/directory' },
];

export function AppHeader({ showBack = false, breadcrumb }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
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
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, isDesktop && styles.headerDesktop]}>
        {/* Left: Logo or Back */}
        {showBack ? (
          <Pressable style={styles.leftZone} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={colors.neutral} />
          </Pressable>
        ) : (
          <View style={styles.leftZone}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={[styles.logo, isDark && { opacity: 0.8 }]}
              resizeMode="contain"
              accessibilityLabel="unicorn.gives logo"
            />
          </View>
        )}

        {/* Center: Desktop nav links OR breadcrumb OR empty */}
        <View style={styles.centerZone}>
          {isDesktop && !breadcrumb && (
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

          {breadcrumb && breadcrumb.length > 0 && (
            <View style={styles.breadcrumbRow}>
              {breadcrumb.map((crumb, i) => {
                const isLast = i === breadcrumb.length - 1;
                return (
                  <View key={crumb.label} style={styles.breadcrumbItem}>
                    {i > 0 && (
                      <Text style={[styles.breadcrumbSep, { color: `${colors.neutral}66` }]}>
                        {'>'}
                      </Text>
                    )}
                    {!isLast && crumb.href ? (
                      <Link href={toHref(crumb.href)} asChild>
                        <Pressable>
                          <Text style={[styles.breadcrumbLink, { color: colors.primary }]}>
                            {crumb.label}
                          </Text>
                        </Pressable>
                      </Link>
                    ) : (
                      <Text style={[styles.breadcrumbCurrent, { color: colors.neutral }]}>
                        {crumb.label}
                      </Text>
                    )}
                  </View>
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

  /* Breadcrumb */
  breadcrumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  breadcrumbSep: {
    fontSize: 12,
  },
  breadcrumbLink: {
    fontSize: 13,
    fontWeight: '600',
  },
  breadcrumbCurrent: {
    fontSize: 13,
    fontWeight: '700',
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

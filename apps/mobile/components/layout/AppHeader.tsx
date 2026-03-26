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
import { useAuth } from '@/lib/auth';
import { toHref } from '@/lib/navigation';
import { useTheme, fonts } from '@/constants/theme';
import { useThemeToggle } from '@/lib/themeToggle';

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
    if (!user) {
      router.push(toHref('/sign-in'));
    } else {
      setMenuOpen(true);
    }
  }

  function handleMenuAction(action: string) {
    setMenuOpen(false);
    if (action === 'logout') {
      signOut();
    }
    // Profile, Settings, Notifications are stubs for now
  }

  const initials = profile?.display_name
    ? profile.display_name.charAt(0).toUpperCase()
    : user?.email
      ? user.email.charAt(0).toUpperCase()
      : '?';

  return (
    <View style={[styles.container, { backgroundColor: colors.heroBar }]}>
      <View style={[styles.header, isDesktop && styles.headerDesktop]}>
        {/* Left: Logo or Back */}
        {showBack ? (
          <Pressable style={styles.leftZone} onPress={() => router.back()}>
            <Text style={[styles.backArrow, { color: colors.onHeroBar }]}>←</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.leftZone} onPress={toggleTheme}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={[styles.logo, isDark && { opacity: 0.8 }]}
              resizeMode="contain"
              accessibilityLabel="Toggle light/dark mode"
            />
          </Pressable>
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
                          { color: `${colors.onHeroBar}B3` },
                          active && { color: colors.onHeroBar, fontFamily: fonts.serifBold },
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
                      <Text style={[styles.breadcrumbSep, { color: `${colors.onHeroBar}66` }]}>
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
                      <Text style={[styles.breadcrumbCurrent, { color: colors.onHeroBar }]}>
                        {crumb.label}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Right: Avatar */}
        <Pressable style={styles.rightZone} onPress={handleAvatarPress}>
          {profile?.avatar_url ? (
            <Image
              source={{ uri: profile.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <View
              style={[
                styles.avatar,
                styles.avatarFallback,
                { backgroundColor: `${colors.onHeroBar}26` },
                user && { backgroundColor: colors.primary },
              ]}
            >
              <Text style={[styles.avatarText, { color: colors.onHeroBar }]}>
                {user ? initials : '👤'}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Avatar popover */}
      {menuOpen && (
        <Modal transparent animationType="fade" onRequestClose={() => setMenuOpen(false)}>
          <Pressable style={styles.overlay} onPress={() => setMenuOpen(false)}>
            <View style={[styles.popover, { backgroundColor: colors.surface }]}>
              <Pressable style={styles.popoverItem} onPress={() => handleMenuAction('profile')}>
                <Text style={[styles.popoverText, { color: colors.neutral }]}>Profile</Text>
              </Pressable>
              <Pressable style={styles.popoverItem} onPress={() => handleMenuAction('settings')}>
                <Text style={[styles.popoverText, { color: colors.neutral }]}>Settings</Text>
              </Pressable>
              <Pressable style={styles.popoverItem} onPress={() => handleMenuAction('notifications')}>
                <Text style={[styles.popoverText, { color: colors.neutral }]}>Notifications</Text>
              </Pressable>
              <View style={[styles.popoverDivider, { backgroundColor: colors.outlineVariant }]} />
              <Pressable style={styles.popoverItem} onPress={() => handleMenuAction('logout')}>
                <Text style={[styles.popoverText, { color: colors.error }]}>Logout</Text>
              </Pressable>
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
  backArrow: {
    fontSize: 22,
    fontWeight: '700',
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
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
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
  popoverText: {
    fontSize: 15,
    fontWeight: '500',
  },
  popoverDivider: {
    height: 1,
    marginHorizontal: 12,
  },
});

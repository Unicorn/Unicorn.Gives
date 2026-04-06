/**
 * Admin layout — web-only sidebar shell.
 *
 * Auth gating:
 * - Only `super_admin` role can access `/admin/*`
 * - Enforced by `RequireAdmin` guard
 */
import { useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { RequireAdmin } from '@/lib/routeGuards';
import { useAuth } from '@/lib/auth';
import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';
import { useHydratedDimensions } from '@/hooks/useHydrated';

/* ── Sidebar nav structure ── */

interface NavSection {
  label: string;
  items: { label: string; path: string; icon: keyof typeof MaterialIcons.glyphMap }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', path: '/admin', icon: 'dashboard' },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Events', path: '/admin/events', icon: 'event' },
      { label: 'News', path: '/admin/news', icon: 'article' },
      { label: 'Guides', path: '/admin/guides', icon: 'menu-book' },
      { label: 'Pages', path: '/admin/pages', icon: 'description' },
    ],
  },
  {
    label: 'Government',
    items: [
      { label: 'Minutes', path: '/admin/minutes', icon: 'gavel' },
      { label: 'Ordinances', path: '/admin/ordinances', icon: 'policy' },
      { label: 'Contacts', path: '/admin/contacts', icon: 'contacts' },
      { label: 'Elections', path: '/admin/elections', icon: 'how-to-vote' },
      { label: 'Municipal Documents', path: '/admin/municipal-documents', icon: 'folder' },
      { label: 'Region Pages', path: '/admin/region-pages', icon: 'map' },
    ],
  },
  {
    label: 'Partners',
    items: [
      { label: 'Partners', path: '/admin/partners', icon: 'store' },
      { label: 'Partner Pages', path: '/admin/partner-pages', icon: 'handshake' },
    ],
  },
  {
    label: 'Taxonomy',
    items: [
      { label: 'Categories', path: '/admin/categories', icon: 'category' },
      { label: 'Tags', path: '/admin/tags', icon: 'label' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Regions', path: '/admin/regions', icon: 'place' },
      { label: 'Users', path: '/admin/users', icon: 'people' },
      { label: 'Media Library', path: '/admin/media', icon: 'perm-media' },
      { label: 'Site Settings', path: '/admin/settings', icon: 'settings' },
      { label: 'Audit Log', path: '/admin/audit-log', icon: 'history' },
    ],
  },
];

export default function AdminLayout() {
  return (
    <RequireAdmin>
      <AdminShell />
    </RequireAdmin>
  );
}

function AdminShell() {
  const { colors } = useTheme();
  const { width } = useHydratedDimensions();
  const sidebarCollapsed = width < 900;
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.root}>
      {/* Sidebar */}
      {!sidebarCollapsed && (
        <View style={styles.sidebar}>
          <AdminSidebar colors={colors} styles={styles} />
        </View>
      )}

      {/* Main content area */}
      <View style={styles.main}>
        {/* Top bar */}
        <AdminTopBar colors={colors} styles={styles} sidebarCollapsed={sidebarCollapsed} />

        {/* Page content via Slot */}
        <View style={styles.content}>
          <Slot />
        </View>
      </View>
    </View>
  );
}

/* ── Sidebar ── */

function AdminSidebar({
  colors,
  styles,
}: {
  colors: ThemeColors;
  styles: ReturnType<typeof createStyles>;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.sidebarInner}>
      {/* Logo area */}
      <Pressable
        style={styles.sidebarHeader}
        onPress={() => router.push(toHref('/admin'))}
      >
        <MaterialIcons name="admin-panel-settings" size={24} color={colors.primary} />
        <Text style={styles.sidebarTitle}>Admin</Text>
      </Pressable>

      <ScrollView style={styles.sidebarScroll} showsVerticalScrollIndicator={false}>
        {NAV_SECTIONS.map((section) => (
          <View key={section.label} style={styles.navSection}>
            <Text style={styles.navSectionLabel}>{section.label}</Text>
            {section.items.map((item) => {
              const active =
                item.path === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.path);
              return (
                <Pressable
                  key={item.path}
                  style={[styles.navItem, active && styles.navItemActive]}
                  onPress={() => router.push(toHref(item.path))}
                >
                  <MaterialIcons
                    name={item.icon}
                    size={18}
                    color={active ? colors.primary : colors.neutralVariant}
                  />
                  <Text
                    style={[
                      styles.navItemText,
                      active && styles.navItemTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>

      {/* Back to site link */}
      <Pressable
        style={styles.backToSite}
        onPress={() => router.push(toHref('/'))}
      >
        <MaterialIcons name="arrow-back" size={16} color={colors.neutralVariant} />
        <Text style={styles.backToSiteText}>Back to site</Text>
      </Pressable>
    </View>
  );
}

/* ── Top Bar ── */

function AdminTopBar({
  colors,
  styles,
  sidebarCollapsed,
}: {
  colors: ThemeColors;
  styles: ReturnType<typeof createStyles>;
  sidebarCollapsed: boolean;
}) {
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Build breadcrumb from pathname
  const breadcrumbs = useMemo(() => {
    const parts = pathname.replace(/^\/admin\/?/, '').split('/').filter(Boolean);
    const crumbs = [{ label: 'Admin', path: '/admin' }];
    let acc = '/admin';
    for (const part of parts) {
      acc += '/' + part;
      crumbs.push({ label: part.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), path: acc });
    }
    return crumbs;
  }, [pathname]);

  return (
    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        {sidebarCollapsed && (
          <Pressable
            style={styles.topBarMenuBtn}
            onPress={() => router.push(toHref('/admin'))}
          >
            <MaterialIcons name="admin-panel-settings" size={22} color={colors.primary} />
          </Pressable>
        )}
        <View style={styles.breadcrumbRow}>
          {breadcrumbs.map((crumb, i) => (
            <View key={crumb.path} style={styles.breadcrumbItem}>
              {i > 0 && <Text style={styles.breadcrumbSep}>/</Text>}
              {i < breadcrumbs.length - 1 ? (
                <Pressable onPress={() => router.push(toHref(crumb.path))}>
                  <Text style={styles.breadcrumbLink}>{crumb.label}</Text>
                </Pressable>
              ) : (
                <Text style={styles.breadcrumbCurrent}>{crumb.label}</Text>
              )}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.topBarRight}>
        <Pressable onPress={() => router.push(toHref('/'))}>
          <Text style={styles.topBarLink}>View site</Text>
        </Pressable>
        {profile && (
          <View style={styles.topBarUser}>
            <MaterialIcons name="account-circle" size={20} color={colors.neutralVariant} />
            <Text style={styles.topBarUserName}>
              {profile.display_name || profile.email}
            </Text>
          </View>
        )}
        <Pressable style={styles.topBarSignOut} onPress={signOut}>
          <MaterialIcons name="logout" size={16} color={colors.neutralVariant} />
        </Pressable>
      </View>
    </View>
  );
}

/* ── Styles ── */

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: colors.background,
      ...(Platform.OS === 'web' ? { minHeight: '100vh' as any } : {}),
    },

    /* Sidebar */
    sidebar: {
      width: 240,
      backgroundColor: colors.surface,
      borderRightWidth: 1,
      borderRightColor: colors.outlineVariant,
    },
    sidebarInner: {
      flex: 1,
      ...(Platform.OS === 'web' ? { position: 'sticky' as any, top: 0, height: '100vh' as any } : {}),
    },
    sidebarHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    sidebarTitle: {
      fontFamily: fonts.sansBold,
      fontSize: 18,
      color: colors.neutral,
    },
    sidebarScroll: {
      flex: 1,
    },
    navSection: {
      paddingTop: spacing.md,
      paddingBottom: spacing.xs,
    },
    navSectionLabel: {
      fontFamily: fonts.sansBold,
      fontSize: 10,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      color: colors.neutralVariant,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xs,
    },
    navItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: spacing.lg,
      paddingVertical: 8,
      marginHorizontal: spacing.sm,
      borderRadius: radii.sm,
    },
    navItemActive: {
      backgroundColor: colors.primaryContainer,
    },
    navItemText: {
      fontFamily: fonts.sans,
      fontSize: 13,
      color: colors.neutralVariant,
    },
    navItemTextActive: {
      fontFamily: fonts.sansMedium,
      color: colors.primary,
    },
    backToSite: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.outlineVariant,
    },
    backToSiteText: {
      fontFamily: fonts.sans,
      fontSize: 13,
      color: colors.neutralVariant,
    },

    /* Main area */
    main: {
      flex: 1,
    },

    /* Top bar */
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    topBarLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    topBarMenuBtn: {
      padding: 4,
    },
    breadcrumbRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    breadcrumbItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    breadcrumbSep: {
      fontFamily: fonts.sans,
      fontSize: 12,
      color: colors.neutralVariant,
      marginHorizontal: 6,
    },
    breadcrumbLink: {
      fontFamily: fonts.sans,
      fontSize: 13,
      color: colors.primary,
    },
    breadcrumbCurrent: {
      fontFamily: fonts.sansMedium,
      fontSize: 13,
      color: colors.neutral,
    },
    topBarRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    topBarLink: {
      fontFamily: fonts.sans,
      fontSize: 13,
      color: colors.primary,
    },
    topBarUser: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    topBarUserName: {
      fontFamily: fonts.sans,
      fontSize: 13,
      color: colors.neutral,
    },
    topBarSignOut: {
      padding: 4,
    },

    /* Content */
    content: {
      flex: 1,
      padding: spacing.xl,
    },
  });

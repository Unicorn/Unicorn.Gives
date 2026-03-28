import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter, usePathname, type Href } from 'expo-router';
import { DrawerActions, type NavigationProp, type ParamListBase } from '@react-navigation/native';
import { useAuth } from '@/lib/auth';
import {
  isPathActive,
  paths,
  routes,
  toHref,
} from '@/lib/navigation';
import { supabase } from '@/lib/supabase';
import { governmentHref } from '@/lib/governmentHref';
import { useTheme, type ThemeColors } from '@/constants/theme';

interface Region {
  slug: string;
  name: string;
  type: string;
}

interface Partner {
  slug: string;
  name: string;
}

export function DrawerMenu({ drawerNavigation }: { drawerNavigation: NavigationProp<ParamListBase> }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, signOut, isEditor } = useAuth();
  const [regions, setRegions] = useState<Region[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const { colors } = useTheme();

  useEffect(() => {
    supabase
      .from('regions')
      .select('slug, name, type')
      .eq('is_active', true)
      .order('display_order')
      .then(({ data }) => { if (data) setRegions(data); });

    supabase
      .from('partners')
      .select('slug, name')
      .eq('is_active', true)
      .then(({ data }) => { if (data) setPartners(data); });
  }, []);

  function navigate(target: Href) {
    drawerNavigation.dispatch(DrawerActions.closeDrawer());
    router.push(target);
  }

  function isActiveHref(href: Href) {
    return isPathActive(pathname, href);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* User section */}
      <View style={[styles.userSection, { backgroundColor: colors.heroBar }]}>
        {user && profile ? (
          <View>
            <Text style={[styles.userName, { color: colors.onHeroBar }]}>
              {profile.display_name || profile.email}
            </Text>
            <Text style={[styles.userRole, { color: colors.neutralVariant }]}>
              {profile.role.replace(/_/g, ' ')}
            </Text>
          </View>
        ) : (
          <Pressable onPress={() => navigate(routes.auth.signIn())}>
            <Text style={[styles.signInText, { color: colors.primary }]}>Sign In</Text>
          </Pressable>
        )}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <NavItem
          label="Home"
          active={pathname === '/' || pathname.startsWith('/home')}
          onPress={() => navigate(routes.home())}
          colors={colors}
        />
        <NavItem
          label="Guides"
          active={pathname.startsWith('/guides')}
          onPress={() => navigate(toHref('/guides'))}
          colors={colors}
        />
        <NavItem
          label="Government"
          active={pathname.startsWith('/government')}
          onPress={() => navigate(toHref('/government'))}
          colors={colors}
        />
        <NavItem
          label="Directory"
          active={pathname.startsWith('/directory')}
          onPress={() => navigate(toHref('/directory'))}
          colors={colors}
        />

        <SectionHeader label="QUICK ACCESS" colors={colors} />
        {regions.map((r) => (
          <NavItem
            key={r.slug}
            label={r.name}
            sublabel={r.type}
            active={isActiveHref(governmentHref(r))}
            onPress={() => navigate(governmentHref(r))}
            colors={colors}
          />
        ))}
        {partners.map((p) => (
          <NavItem
            key={p.slug}
            label={p.name}
            active={isActiveHref(routes.partners.index(p.slug))}
            onPress={() => navigate(routes.partners.index(p.slug))}
            colors={colors}
          />
        ))}
      </ScrollView>

      {/* Bottom auth section */}
      <View style={[styles.bottomSection, { borderTopColor: colors.outline }]}>
        {user ? (
          <>
            {isEditor && (
              <NavItem
                label="Admin Dashboard"
                active={isActiveHref(routes.auth.adminDashboard())}
                onPress={() => navigate(routes.auth.adminDashboard())}
                accent
                colors={colors}
              />
            )}
            <Pressable style={styles.signOutButton} onPress={() => { signOut(); drawerNavigation.dispatch(DrawerActions.closeDrawer()); }}>
              <Text style={[styles.signOutText, { color: colors.neutralVariant }]}>Sign Out</Text>
            </Pressable>
          </>
        ) : (
          <NavItem
            label="Sign In"
            onPress={() => navigate(routes.auth.signIn())}
            accent
            colors={colors}
          />
        )}
      </View>
    </View>
  );
}

function SectionHeader({ label, colors }: { label: string; colors: ThemeColors }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionHeaderText, { color: colors.neutralVariant }]}>{label}</Text>
    </View>
  );
}

function NavItem({
  label,
  sublabel,
  active,
  onPress,
  accent,
  colors,
}: {
  label: string;
  sublabel?: string;
  active?: boolean;
  onPress: () => void;
  accent?: boolean;
  colors: ThemeColors;
}) {
  return (
    <Pressable
      style={StyleSheet.flatten([
        styles.navItem,
        active && [styles.navItemActive, { backgroundColor: colors.surfaceContainer, borderLeftColor: colors.neutral }],
      ])}
      onPress={onPress}
    >
      <Text
        style={StyleSheet.flatten([
          styles.navItemText,
          { color: colors.neutral },
          active && { fontWeight: '700' },
          accent && { color: colors.purple, fontWeight: '600' },
        ])}
      >
        {label}
      </Text>
      {sublabel && (
        <Text style={[styles.navItemSublabel, { color: colors.neutralVariant }]}>
          {sublabel}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userSection: {
    padding: 20,
    paddingTop: 48,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
  },
  userRole: {
    fontSize: 12,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  signInText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 8,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  sectionHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  navItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  navItemActive: {},
  navItemText: {
    fontSize: 15,
    fontWeight: '500',
  },
  navItemSublabel: {
    fontSize: 11,
    textTransform: 'capitalize',
    marginTop: 1,
  },
  bottomSection: {
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  signOutButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '500',
  },
});

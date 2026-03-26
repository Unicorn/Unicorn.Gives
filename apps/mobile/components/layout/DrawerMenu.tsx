import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter, usePathname, type Href } from 'expo-router';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useAuth } from '@/lib/auth';
import {
  isPathActive,
  paths,
  routes,
} from '@/lib/navigation';
import { supabase } from '@/lib/supabase';
import { governmentHref } from '@/lib/governmentHref';

interface Region {
  slug: string;
  name: string;
  type: string;
}

interface Partner {
  slug: string;
  name: string;
}

export function DrawerMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const navigation = useNavigation();
  const { user, profile, signOut, isEditor } = useAuth();
  const [regions, setRegions] = useState<Region[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

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
    navigation.dispatch(DrawerActions.closeDrawer());
    router.push(target);
  }

  function isActiveHref(href: Href) {
    return isPathActive(pathname, href);
  }

  return (
    <View style={styles.container}>
      {/* User section */}
      <View style={styles.userSection}>
        {user && profile ? (
          <View>
            <Text style={styles.userName}>
              {profile.display_name || profile.email}
            </Text>
            <Text style={styles.userRole}>{profile.role.replace(/_/g, ' ')}</Text>
          </View>
        ) : (
          <Pressable onPress={() => navigate(routes.auth.signIn())}>
            <Text style={styles.signInText}>Sign In</Text>
          </Pressable>
        )}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Home */}
        <NavItem
          label="Home"
          active={pathname === paths.home}
          onPress={() => navigate(routes.home())}
        />
        <NavItem
          label="Land & Lore"
          active={isActiveHref(routes.lore.index())}
          onPress={() => navigate(routes.lore.index())}
        />

        {/* SOLVE */}
        <SectionHeader label="SOLVE" />
        <NavItem
          label="Problem Solver"
          active={isActiveHref(routes.solve.index())}
          onPress={() => navigate(routes.solve.index())}
        />

        {/* GOVERN */}
        <SectionHeader label="GOVERN" />
        {regions.map((r) => (
          <NavItem
            key={r.slug}
            label={r.name}
            sublabel={r.type}
            active={isActiveHref(governmentHref(r))}
            onPress={() => navigate(governmentHref(r))}
          />
        ))}

        {/* INFORM */}
        <SectionHeader label="INFORM" />
        <NavItem
          label="News & Alerts"
          active={isActiveHref(routes.news.index())}
          onPress={() => navigate(routes.news.index())}
        />
        <NavItem
          label="Events Calendar"
          active={isActiveHref(routes.events.index())}
          onPress={() => navigate(routes.events.index())}
        />

        {/* CONNECT */}
        <SectionHeader label="CONNECT" />
        {partners.map((p) => (
          <NavItem
            key={p.slug}
            label={p.name}
            active={isActiveHref(routes.partners.index(p.slug))}
            onPress={() => navigate(routes.partners.index(p.slug))}
          />
        ))}
      </ScrollView>

      {/* Bottom auth section */}
      <View style={styles.bottomSection}>
        {user ? (
          <>
            {isEditor && (
              <NavItem
                label="Admin Dashboard"
                active={isActiveHref(routes.auth.adminDashboard())}
                onPress={() => navigate(routes.auth.adminDashboard())}
                accent
              />
            )}
            <Pressable style={styles.signOutButton} onPress={() => { signOut(); navigation.dispatch(DrawerActions.closeDrawer()); }}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </Pressable>
          </>
        ) : (
          <NavItem
            label="Sign In"
            onPress={() => navigate(routes.auth.signIn())}
            accent
          />
        )}
      </View>
    </View>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{label}</Text>
    </View>
  );
}

function NavItem({
  label,
  sublabel,
  active,
  onPress,
  accent,
}: {
  label: string;
  sublabel?: string;
  active?: boolean;
  onPress: () => void;
  accent?: boolean;
}) {
  return (
    <Pressable
      style={StyleSheet.flatten([
        styles.navItem,
        active && styles.navItemActive,
      ])}
      onPress={onPress}
    >
      <Text
        style={StyleSheet.flatten([
          styles.navItemText,
          active && styles.navItemTextActive,
          accent && styles.navItemTextAccent,
        ])}
      >
        {label}
      </Text>
      {sublabel && (
        <Text style={styles.navItemSublabel}>
          {sublabel}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf9f4',
  },
  userSection: {
    backgroundColor: '#2d4a4a',
    padding: 20,
    paddingTop: 48,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fcf9f4',
  },
  userRole: {
    fontSize: 12,
    color: '#d4b96e',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  signInText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d4b96e',
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
    color: '#8a9a7c',
    letterSpacing: 1.5,
  },
  navItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: '#f0ede8',
    borderLeftColor: '#2d4a4a',
  },
  navItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#43493e',
  },
  navItemTextActive: {
    fontWeight: '700',
    color: '#2d4a4a',
  },
  navItemTextAccent: {
    color: '#9b8ec4',
    fontWeight: '600',
  },
  navItemSublabel: {
    fontSize: 11,
    color: '#73796d',
    textTransform: 'capitalize',
    marginTop: 1,
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: '#c3c8bb',
    paddingVertical: 8,
  },
  signOutButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  signOutText: {
    fontSize: 15,
    color: '#73796d',
    fontWeight: '500',
  },
});

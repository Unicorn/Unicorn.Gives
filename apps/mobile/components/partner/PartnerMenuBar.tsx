/**
 * Branded menu bar for partners listed in `constants/partnerMenus.ts`:
 * Home plus the partner's tabs, a live "Open now" badge, a next-event teaser
 * on Events, and a Join button that becomes "My membership" for members.
 *
 * Everything time- or user-dependent is computed after mount, so the static
 * export renders the same bar for everyone and hydration stays clean.
 */
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { type Href, Link, usePathname } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  breakpoints,
  fonts,
  fontSize,
  gray,
  radii,
  spacing,
  teal,
  useTheme,
  type ThemeColors,
} from '@/constants/theme';
import type { PartnerMenuConfig } from '@/constants/partnerMenus';
import { Container } from '@/components/layout/Container';
import { useHydratedDimensions } from '@/hooks/useHydrated';
import { useMyPayments, useMySubscriptions } from '@/hooks/useMyAccount';
import { hrefToPathString, routes } from '@/lib/navigation';
import { supabase } from '@/lib/supabase';
import {
  eventTeaser,
  getOpenStatus,
  localClock,
  parseDailyHours,
  type OpenStatus,
} from '@/lib/partners/menuStatus';

type PartnerTab = { label: string; slug: string; order: number };

interface PartnerMenuBarProps {
  partnerId: string;
  partnerSlug: string;
  tabs: PartnerTab[];
  config: PartnerMenuConfig;
  /** Free-text hours (landing page `contact_hours`); no badge when unparseable. */
  hoursText?: string | null;
}

interface MenuItem {
  key: string;
  label: string;
  shortLabel: string;
  href: Href;
}

export function PartnerMenuBar({ partnerId, partnerSlug, tabs, config, hoursText }: PartnerMenuBarProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const pathname = usePathname();
  const { width } = useHydratedDimensions();
  const isWide = width >= breakpoints.tablet;

  const items = useMemo<MenuItem[]>(() => {
    const hidden = new Set(config.hidden ?? []);
    const tabItems = [...tabs]
      .sort((a, b) => a.order - b.order)
      .filter((t) => !hidden.has(t.slug))
      .map((t) => {
        const label = config.labels?.[t.slug] ?? t.label;
        return {
          key: t.slug,
          label,
          shortLabel: config.shortLabels?.[t.slug] ?? label,
          href: routes.partners.tab(partnerSlug, t.slug),
        };
      });
    return [
      { key: 'home', label: 'Home', shortLabel: 'Home', href: routes.partners.index(partnerSlug) },
      ...tabItems,
    ];
  }, [tabs, config, partnerSlug]);

  const homePath = hrefToPathString(routes.partners.index(partnerSlug));
  const activeKey =
    items.find((i) => i.key !== 'home' && pathname.startsWith(hrefToPathString(i.href)))?.key ??
    (pathname === homePath ? 'home' : null);

  const openStatus = useOpenStatus(hoursText, config.timeZone);
  const teaser = useNextEventTeaser(partnerId, config);
  const isMember = useIsMember(partnerId);

  const joinTab = config.joinTab && tabs.some((t) => t.slug === config.joinTab) ? config.joinTab : null;
  const cta = isMember
    ? { label: 'My membership', icon: 'badge' as const, href: routes.user.subscriptions() }
    : joinTab
      ? { label: 'Join', icon: null, href: routes.partners.tab(partnerSlug, joinTab) }
      : null;

  const statusBadge = openStatus ? (
    <View style={styles.status} accessibilityRole="text">
      <View style={[styles.dot, !openStatus.open && styles.dotClosed]} />
      <Text style={styles.statusText} numberOfLines={1}>
        {openStatus.label}
      </Text>
    </View>
  ) : null;

  const ctaButton = cta ? (
    <Link href={cta.href} asChild>
      <Pressable style={StyleSheet.flatten([styles.cta, !isWide && styles.ctaCompact])} accessibilityRole="link">
        {cta.icon && <MaterialIcons name={cta.icon} size={16} color={colors.onPrimary} />}
        <Text style={styles.ctaText}>{cta.label}</Text>
      </Pressable>
    </Link>
  ) : null;

  const tabRow = (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={isWide ? styles.tabScrollWide : undefined}
      contentContainerStyle={styles.tabRow}
    >
      {items.map((item) => {
        const active = item.key === activeKey;
        const showTeaser = item.key === 'events' && teaser;
        return (
          <Link key={item.key} href={item.href} asChild>
            <Pressable
              // Link asChild (Slot) rejects style arrays — flatten them.
              style={StyleSheet.flatten([styles.tab, !isWide && styles.tabCompact, active && styles.tabActive])}
              accessibilityRole="link"
              aria-current={active ? 'page' : undefined}
              accessibilityLabel={showTeaser ? `${item.label}, ${teaser}` : item.label}
            >
              {item.key === 'home' && (
                <MaterialIcons
                  name="home"
                  size={16}
                  color={active ? colors.onPrimary : colors.onHeroBar}
                />
              )}
              <Text style={[styles.tabText, !isWide && styles.tabTextCompact, active && styles.tabTextActive]}>
                {isWide ? item.label : item.shortLabel}
              </Text>
              {showTeaser &&
                (isWide ? (
                  <Text style={styles.teaser} numberOfLines={1}>
                    {teaser}
                  </Text>
                ) : (
                  <View style={styles.dot} />
                ))}
            </Pressable>
          </Link>
        );
      })}
    </ScrollView>
  );

  return (
    <View style={styles.bar} role="navigation" aria-label="Partner menu">
      <Container>
        {isWide ? (
          <View style={styles.wideRow}>
            {tabRow}
            <View style={styles.trailing}>
              {statusBadge}
              {ctaButton}
            </View>
          </View>
        ) : (
          <View style={styles.compact}>
            {(statusBadge || ctaButton) && (
              <View style={styles.compactTop}>
                {statusBadge ?? <View />}
                {ctaButton}
              </View>
            )}
            {tabRow}
          </View>
        )}
      </Container>
    </View>
  );
}

/** Recomputed every minute so the badge flips at opening and closing time. */
function useOpenStatus(hoursText: string | null | undefined, timeZone: string): OpenStatus | null {
  const hours = useMemo(() => parseDailyHours(hoursText), [hoursText]);
  const [status, setStatus] = useState<OpenStatus | null>(null);

  useEffect(() => {
    if (!hours) {
      setStatus(null);
      return;
    }
    const update = () => setStatus(getOpenStatus(hours, localClock(new Date(), timeZone).minutes));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [hours, timeZone]);

  return status;
}

function useNextEventTeaser(partnerId: string, config: PartnerMenuConfig): string | null {
  const [teaser, setTeaser] = useState<string | null>(null);
  const { eventCategory, timeZone } = config;

  useEffect(() => {
    let cancelled = false;
    const today = localClock(new Date(), timeZone).date;
    const owner = eventCategory
      ? `partner_id.eq.${partnerId},category.eq.${eventCategory}`
      : `partner_id.eq.${partnerId}`;

    (async () => {
      const { data } = await supabase
        .from('events')
        .select('title, date, time')
        .eq('status', 'published')
        .or(owner)
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(1);
      if (cancelled) return;
      const next = data?.[0] as { title: string; date: string; time: string | null } | undefined;
      setTeaser(next ? eventTeaser(next, today) : null);
    })();

    return () => {
      cancelled = true;
    };
  }, [partnerId, eventCategory, timeZone]);

  return teaser;
}

/** An active or paused subscription, or a paid one-time month that hasn't run out. */
function useIsMember(partnerId: string): boolean {
  const { subscriptions } = useMySubscriptions();
  // Realtime-backed, so a one-time month paid on the membership tab flips
  // "Join" to "My membership" without a reload.
  const { payments } = useMyPayments();
  const now = Date.now();

  return (
    payments.some(
      (p) =>
        p.partner_id === partnerId &&
        p.kind === 'membership_one_time' &&
        p.covers_until != null &&
        Date.parse(p.covers_until) > now,
    ) ||
    subscriptions.some((s) => s.partner_id === partnerId && (s.status === 'active' || s.status === 'paused'))
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    bar: {
      backgroundColor: colors.heroBar,
    },
    wideRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    tabScrollWide: {
      flex: 1,
    },
    tabRow: {
      gap: spacing.xs,
      alignItems: 'center',
    },
    tab: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radii.sm,
    },
    tabCompact: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs + 2,
    },
    tabActive: {
      backgroundColor: colors.primary,
    },
    tabText: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.md,
      color: colors.onHeroBar,
    },
    tabTextCompact: {
      fontSize: fontSize.sm + 1,
    },
    tabTextActive: {
      color: colors.onPrimary,
    },
    teaser: {
      fontFamily: fonts.sans,
      fontSize: fontSize.xs,
      color: colors.onPrimaryContainer,
      backgroundColor: colors.primaryContainer,
      paddingHorizontal: spacing.xs + 2,
      paddingVertical: 1,
      borderRadius: radii.pill,
      overflow: 'hidden',
      maxWidth: 160,
    },
    trailing: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    status: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs + 2,
      flexShrink: 1,
    },
    statusText: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.onHeroBar,
    },
    // The bar is gray[800] in both modes, so the dot uses fixed ramp stops
    // rather than mode-flipping tokens (primaryContainer is teal[900] in dark).
    dot: {
      width: 7,
      height: 7,
      borderRadius: radii.pill,
      backgroundColor: teal[300],
    },
    dotClosed: {
      backgroundColor: gray[400],
    },
    cta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs + 2,
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: radii.sm,
    },
    ctaCompact: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2,
    },
    ctaText: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.md,
      color: colors.onPrimary,
    },
    compact: {
      paddingVertical: spacing.sm,
      gap: spacing.sm,
    },
    compactTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
  });
}

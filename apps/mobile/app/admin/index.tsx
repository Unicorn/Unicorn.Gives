import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';
import {
  enrichAuditEntries,
  formatActorLabel,
  type EnrichedAuditEntry,
} from '@/lib/admin/enrichAuditEntries';

/* ── Types ── */

interface ContentCount {
  table: string;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  total: number;
  drafts: number;
  published: number;
  adminPath: string;
}

/* ── Tables to count ── */

const CONTENT_TABLES = [
  { table: 'events', label: 'Events', icon: 'event' as const, path: '/admin/events' },
  { table: 'news', label: 'News', icon: 'article' as const, path: '/admin/news' },
  { table: 'guides', label: 'Guides', icon: 'menu-book' as const, path: '/admin/guides' },
  { table: 'pages', label: 'Pages', icon: 'description' as const, path: '/admin/pages' },
  { table: 'minutes', label: 'Minutes', icon: 'gavel' as const, path: '/admin/minutes' },
  { table: 'ordinances', label: 'Ordinances', icon: 'policy' as const, path: '/admin/ordinances' },
  { table: 'contacts', label: 'Contacts', icon: 'contacts' as const, path: '/admin/contacts' },
  { table: 'elections', label: 'Elections', icon: 'how-to-vote' as const, path: '/admin/elections' },
  { table: 'municipal_documents', label: 'Municipal Documents', icon: 'folder' as const, path: '/admin/municipal-documents' },
  { table: 'region_pages', label: 'Region Pages', icon: 'map' as const, path: '/admin/region-pages' },
  { table: 'partner_pages', label: 'Partner Pages', icon: 'handshake' as const, path: '/admin/partner-pages' },
];

export default function AdminDashboard() {
  const { colors } = useTheme();
  const { profile } = useAuth();
  const router = useRouter();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [counts, setCounts] = useState<ContentCount[]>([]);
  const [auditEntries, setAuditEntries] = useState<EnrichedAuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // Fetch counts for all content tables in parallel
      const countPromises = CONTENT_TABLES.map(async (t) => {
        const [totalRes, draftRes, publishedRes] = await Promise.all([
          supabase.from(t.table).select('id', { count: 'exact', head: true }),
          supabase
            .from(t.table)
            .select('id', { count: 'exact', head: true })
            .eq('status', 'draft'),
          supabase
            .from(t.table)
            .select('id', { count: 'exact', head: true })
            .in('status', ['published', 'approved']),
        ]);

        return {
          table: t.table,
          label: t.label,
          icon: t.icon,
          total: totalRes.count ?? 0,
          drafts: draftRes.count ?? 0,
          published: publishedRes.count ?? 0,
          adminPath: t.path,
        };
      });

      const results = await Promise.all(countPromises);
      setCounts(results);

      // Fetch recent audit log
      const { data: auditData } = await supabase
        .from('audit_log')
        .select(
          'id, action, resource_type, resource_id, created_at, changes, user_id, actor_display_name, actor_email',
        )
        .order('created_at', { ascending: false })
        .limit(10);

      const enriched = await enrichAuditEntries(supabase, auditData ?? []);
      setAuditEntries(enriched);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  const totalContent = counts.reduce((sum, c) => sum + c.total, 0);
  const totalDrafts = counts.reduce((sum, c) => sum + c.drafts, 0);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      {/* Welcome header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Welcome back{profile?.display_name ? `, ${profile.display_name}` : ''}
        </Text>
        <Text style={styles.headerSubtitle}>
          {totalContent} total records across {CONTENT_TABLES.length} content types
          {totalDrafts > 0 ? ` \u00b7 ${totalDrafts} drafts` : ''}
        </Text>
      </View>

      {/* Quick actions */}
      <View style={styles.quickActions}>
        <Pressable
          style={styles.quickActionBtn}
          onPress={() => router.push(toHref('/admin/events/new'))}
        >
          <MaterialIcons name="add" size={18} color={colors.onPrimary} />
          <Text style={styles.quickActionText}>New Event</Text>
        </Pressable>
        <Pressable
          style={styles.quickActionBtn}
          onPress={() => router.push(toHref('/admin/news/new'))}
        >
          <MaterialIcons name="add" size={18} color={colors.onPrimary} />
          <Text style={styles.quickActionText}>New Article</Text>
        </Pressable>
        <Pressable
          style={styles.quickActionBtn}
          onPress={() => router.push(toHref('/admin/contacts/new'))}
        >
          <MaterialIcons name="add" size={18} color={colors.onPrimary} />
          <Text style={styles.quickActionText}>New Contact</Text>
        </Pressable>
      </View>

      {/* Content counts grid */}
      <Text style={styles.sectionTitle}>Content Overview</Text>
      <View style={styles.countsGrid}>
        {counts.map((c) => (
          <Pressable
            key={c.table}
            style={styles.countCard}
            onPress={() => router.push(toHref(c.adminPath))}
          >
            <View style={styles.countCardHeader}>
              <MaterialIcons name={c.icon} size={20} color={colors.primary} />
              <Text style={styles.countCardLabel}>{c.label}</Text>
            </View>
            <Text style={styles.countCardTotal}>{c.total}</Text>
            <View style={styles.countCardMeta}>
              {c.published > 0 && (
                <View style={styles.countBadge}>
                  <View style={[styles.countDot, { backgroundColor: colors.primary }]} />
                  <Text style={styles.countBadgeText}>{c.published} published</Text>
                </View>
              )}
              {c.drafts > 0 && (
                <View style={styles.countBadge}>
                  <View style={[styles.countDot, { backgroundColor: colors.gold }]} />
                  <Text style={styles.countBadgeText}>{c.drafts} drafts</Text>
                </View>
              )}
            </View>
          </Pressable>
        ))}
      </View>

      {/* Audit log */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {auditEntries.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="history" size={32} color={colors.outlineVariant} />
          <Text style={styles.emptyStateText}>No activity recorded yet</Text>
          <Text style={styles.emptyStateHint}>
            Actions will appear here as you create and edit content.
          </Text>
        </View>
      ) : (
        <View style={styles.auditTable}>
          {auditEntries.map((entry, index) => {
            const showSlugLine =
              Boolean(entry.contentSlug) && entry.contentSlug !== entry.contentLabel;
            const isLast = index === auditEntries.length - 1;
            return (
              <View
                key={entry.id}
                style={[styles.auditRow, isLast && styles.auditRowLast]}
              >
                <View style={styles.auditRowMain}>
                  <View style={styles.auditRowTop}>
                    <Text style={styles.auditAction}>{entry.action}</Text>
                    <Text style={styles.auditTime}>
                      {new Date(entry.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <Text style={styles.auditActor}>{formatActorLabel(entry)}</Text>
                  <Text style={styles.auditContent}>
                    {entry.typeLabel} · {entry.contentLabel}
                  </Text>
                  {showSlugLine ? (
                    <Text style={styles.auditSlug}>/{entry.contentSlug}</Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    page: {
      flex: 1,
    },
    pageContent: {
      maxWidth: 1000,
      paddingBottom: 40,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
    },
    loadingText: {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: colors.neutralVariant,
    },

    /* Header */
    header: {
      marginBottom: spacing.xl,
    },
    headerTitle: {
      fontFamily: fonts.sansBold,
      fontSize: 24,
      color: colors.neutral,
    },
    headerSubtitle: {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: colors.neutralVariant,
      marginTop: 4,
    },

    /* Quick actions */
    quickActions: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.xxl,
    },
    quickActionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: 10,
      borderRadius: radii.sm,
    },
    quickActionText: {
      fontFamily: fonts.sansMedium,
      fontSize: 13,
      color: colors.onPrimary,
    },

    /* Section */
    sectionTitle: {
      fontFamily: fonts.sansBold,
      fontSize: 16,
      color: colors.neutral,
      marginBottom: spacing.md,
    },

    /* Counts grid */
    countsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.md,
      marginBottom: spacing.xxxl,
    },
    countCard: {
      backgroundColor: colors.surface,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      padding: spacing.lg,
      minWidth: 180,
      flex: 1,
      maxWidth: 240,
    },
    countCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: spacing.sm,
    },
    countCardLabel: {
      fontFamily: fonts.sansMedium,
      fontSize: 13,
      color: colors.neutralVariant,
    },
    countCardTotal: {
      fontFamily: fonts.sansBold,
      fontSize: 32,
      color: colors.neutral,
      marginBottom: spacing.xs,
    },
    countCardMeta: {
      gap: 4,
    },
    countBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    countDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    countBadgeText: {
      fontFamily: fonts.sans,
      fontSize: 12,
      color: colors.neutralVariant,
    },

    /* Empty state */
    emptyState: {
      backgroundColor: colors.surface,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      padding: spacing.xxxl,
      alignItems: 'center',
      gap: 8,
    },
    emptyStateText: {
      fontFamily: fonts.sansMedium,
      fontSize: 14,
      color: colors.neutral,
    },
    emptyStateHint: {
      fontFamily: fonts.sans,
      fontSize: 13,
      color: colors.neutralVariant,
    },

    /* Audit table */
    auditTable: {
      backgroundColor: colors.surface,
      borderRadius: radii.md,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    auditRow: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
    },
    auditRowLast: {
      borderBottomWidth: 0,
    },
    auditRowMain: {
      flex: 1,
      gap: 4,
    },
    auditRowTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    auditAction: {
      fontFamily: fonts.sansMedium,
      fontSize: 13,
      color: colors.neutral,
      textTransform: 'capitalize',
    },
    auditTime: {
      fontFamily: fonts.sans,
      fontSize: 12,
      color: colors.neutralVariant,
      flexShrink: 0,
    },
    auditActor: {
      fontFamily: fonts.sans,
      fontSize: 12,
      color: colors.neutralVariant,
    },
    auditContent: {
      fontFamily: fonts.sansMedium,
      fontSize: 13,
      color: colors.neutral,
    },
    auditSlug: {
      fontFamily: fonts.sans,
      fontSize: 12,
      color: colors.neutralVariant,
    },
  });

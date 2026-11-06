/**
 * Admin tab listing a partner's members and day passes. Read-only: billing
 * changes happen in Square or from the member's own account page.
 */
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { supabase } from '@/lib/supabase';
import {
  buildMemberRows,
  type MemberPayment,
  type MemberRow,
  type MemberSubscription,
  type MemberSummary,
} from '@/lib/partners/memberRows';
import { fonts, fontSize, radii, spacing, useTheme, type ThemeColors } from '@/constants/theme';

/** Enough for any one partner today; the footer says so if it's ever reached. */
const ROW_LIMIT = 500;

export function PartnerMembersTab({ partnerId }: { partnerId: string }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [summary, setSummary] = useState<MemberSummary | null>(null);
  const [truncated, setTruncated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [subs, payments] = await Promise.all([
        supabase
          .from('square_subscriptions')
          .select(
            'id, user_id, customer_name, customer_email, tier, amount_cents, status, cancel_at_period_end, canceled_at, next_billing_at, current_period_end, scheduled_action, scheduled_action_date, profiles(display_name, email)',
          )
          .eq('partner_id', partnerId)
          .neq('status', 'pending')
          .order('updated_at', { ascending: false })
          .limit(ROW_LIMIT),
        supabase
          .from('partner_payments')
          .select('id, user_id, kind, amount_cents, paid_at, covers_until, profiles(display_name, email)')
          .eq('partner_id', partnerId)
          .eq('status', 'paid')
          .order('paid_at', { ascending: false })
          .limit(ROW_LIMIT),
      ]);
      if (cancelled) return;
      if (subs.error || payments.error) {
        setError("Couldn't load members. Try again.");
        return;
      }
      setSummary(
        buildMemberRows(
          (subs.data ?? []) as unknown as MemberSubscription[],
          (payments.data ?? []) as unknown as MemberPayment[],
        ),
      );
      setTruncated((subs.data?.length ?? 0) === ROW_LIMIT || (payments.data?.length ?? 0) === ROW_LIMIT);
    })();
    return () => {
      cancelled = true;
    };
  }, [partnerId]);

  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!summary) return <ActivityIndicator color={colors.primary} style={styles.loading} />;
  return <PartnerMembersView summary={summary} truncated={truncated} />;
}

export function PartnerMembersView({ summary, truncated }: { summary: MemberSummary; truncated?: boolean }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { members, dayPasses, currentCount } = summary;

  if (members.length === 0 && dayPasses.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.heading}>No members yet</Text>
        <Text style={styles.meta}>Members and day passes appear here once someone pays.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.count}>
        {currentCount} current {currentCount === 1 ? 'member' : 'members'}
      </Text>
      {members.length > 0 && <MemberList title="Members" rows={members} styles={styles} />}
      {dayPasses.length > 0 && <MemberList title="Day passes" rows={dayPasses} styles={styles} />}
      {truncated && <Text style={styles.meta}>Showing the most recent {ROW_LIMIT} of each.</Text>}
    </View>
  );
}

function MemberList({
  title,
  rows,
  styles,
}: {
  title: string;
  rows: MemberRow[];
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>{title}</Text>
      {rows.map((row, i) => (
        <View key={row.id} style={[styles.row, i > 0 && styles.rowDivider]}>
          <View style={styles.who}>
            <Text style={styles.name} numberOfLines={1}>
              {row.name}
            </Text>
            {row.email && row.email !== row.name && (
              <Text style={styles.meta} numberOfLines={1}>
                {row.email}
              </Text>
            )}
          </View>
          <View style={styles.plan}>
            <Text style={styles.planText}>{row.plan}</Text>
            {row.detail && <Text style={styles.meta}>{row.detail}</Text>}
          </View>
          <View style={styles.chipColumn}>
            <View style={[styles.chip, row.current && styles.chipCurrent]}>
              <Text style={[styles.chipText, row.current && styles.chipTextCurrent]}>{row.status}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { gap: spacing.lg },
    loading: { padding: spacing.xxl },
    error: { fontFamily: fonts.sans, fontSize: fontSize.md, color: colors.error, padding: spacing.lg },
    count: { fontFamily: fonts.sansBold, fontSize: fontSize.lg, color: colors.neutral },
    card: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.md,
      padding: spacing.lg,
      gap: spacing.sm,
    },
    heading: { fontFamily: fonts.sansBold, fontSize: fontSize.base, color: colors.neutral },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    rowDivider: { borderTopWidth: 1, borderTopColor: colors.outlineVariant },
    who: { flex: 2, minWidth: 180 },
    plan: { flex: 2, minWidth: 160 },
    name: { fontFamily: fonts.sansMedium, fontSize: fontSize.md, color: colors.neutral },
    planText: { fontFamily: fonts.sans, fontSize: fontSize.md, color: colors.neutral },
    meta: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant },
    // Status chips: gold for current, neutral otherwise (DESIGN_SYSTEM taxonomy).
    chipColumn: { minWidth: 76, alignItems: 'flex-end' },
    chip: {
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      backgroundColor: colors.surfaceContainer,
      borderRadius: radii.pill,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
    },
    chipCurrent: { borderColor: colors.gold, backgroundColor: colors.goldContainer },
    chipText: { fontFamily: fonts.sansMedium, fontSize: fontSize.sm, color: colors.neutralVariant },
    chipTextCurrent: { color: colors.gold },
  });
}

import { useEffect, useMemo, useState } from 'react';
import {
  ImageBackground,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { supabase } from '@/lib/supabase';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useTheme, fonts, fontSize, letterSpacing, lineHeight, spacing, radii, shadows } from '@/constants/theme';

const electionsHero = require('../../assets/images/elections-hero.jpg');
const electionsCommunity = require('../../assets/images/elections-community.jpg');

export function ElectionsCenter({
  variant = 'heroOnly',
}: {
  /**
   * Placeholder for future variations.
   * We keep the prop to avoid duplicating the whole layout in multiple route files.
   */
  variant?: 'heroOnly' | 'full';
}) {
  const { colors } = useTheme();
  const heroImage = useMemo(() => electionsHero, []);
  const [pageBody, setPageBody] = useState<string | null>(null);

  useEffect(() => {
    // Preserve migrated CMS links (PDF + internal pages) alongside the hand-coded layout.
    Promise.resolve(
      supabase
        .from('pages')
        .select('body')
        .eq('slug', 'elections')
        .single()
    ).then(({ data }) => {
      if (data?.body) setPageBody(data.body as string);
    }).catch(() => {
      // If Supabase isn't available (e.g. during some static export scenarios), we still
      // keep the hand-coded layout as a fallback.
    });
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
      <View style={{ paddingTop: 10, paddingBottom: spacing.sm }}>
        <View style={{ alignSelf: 'flex-start', backgroundColor: colors.primaryContainer, borderRadius: radii.pill, paddingHorizontal: fontSize.md, paddingVertical: 6, marginBottom: spacing.md }}>
          <Text style={{ color: colors.neutral, fontFamily: fonts.sansBold, fontSize: fontSize.sm, letterSpacing: letterSpacing.normal }}>Election Center</Text>
        </View>

        <Text style={{ fontSize: 26, fontFamily: fonts.sansBold, color: colors.neutral, lineHeight: 34, marginBottom: 10 }}>
          The integrity of <Text style={{ fontStyle: 'italic' }}>your vote</Text> is our mission.
        </Text>

        <Text style={{ fontSize: fontSize.base, fontFamily: fonts.sans, color: colors.neutral, lineHeight: lineHeight.relaxed, marginBottom: fontSize.md }}>
          Welcome to the Lincoln Township Election Center. We are dedicated to providing clear, accessible information to ensure every resident can participate confidently in our democratic process.
        </Text>

        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <TouchableOpacity
            style={{ flex: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.md, borderRadius: radii.md, alignItems: 'center', backgroundColor: colors.heroBar }}
            onPress={() => Linking.openURL('https://mvic.sos.state.mi.us/')}
          >
            <Text style={{ color: colors.onHeroBar, fontFamily: fonts.sansBold }}>Check Registration Status</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.md, borderRadius: radii.md, alignItems: 'center', borderWidth: 1, borderColor: colors.heroBar, backgroundColor: colors.background }}
            onPress={() => Linking.openURL('https://mvic.sos.state.mi.us/')}
          >
            <Text style={{ color: colors.neutral, fontFamily: fonts.sansBold }}>View Sample Ballot</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <ImageBackground source={heroImage} style={{ height: 240, borderRadius: radii.lg, overflow: 'hidden', justifyContent: 'flex-end' }} resizeMode="cover">
          <View style={{ position: 'absolute', right: spacing.md, bottom: spacing.md, left: spacing.md, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: radii.md, padding: fontSize.md }}>
            <Text style={{ color: colors.onHeroBar, fontFamily: fonts.sansBold, fontSize: fontSize.base, marginBottom: 6 }}>"A citizen's voice is the heartbeat of the township."</Text>
            <Text style={{ color: colors.gold, fontFamily: fonts.sansBold, fontSize: 13 }}>— Carol Majewski, Township Clerk</Text>
          </View>
        </ImageBackground>
      </View>

      <View
        style={{
          marginTop: spacing.lg,
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: colors.outline,
          ...shadows.cardElevated,
        }}
      >
        <Text style={{ fontSize: fontSize.xl, fontFamily: fonts.sansBold, color: colors.neutral, marginBottom: 10 }}>Voter Registration</Text>
        <Text style={{ fontSize: fontSize.md, fontFamily: fonts.sans, color: colors.neutral, lineHeight: lineHeight.relaxed, marginBottom: spacing.md }}>
          To vote in Lincoln Township, you must be a U.S. citizen, at least 18 years old by Election Day, and a resident of the township for at least 30 days.
        </Text>
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <View style={{ flex: 1, backgroundColor: colors.background, borderRadius: radii.md, padding: fontSize.md, borderWidth: 1, borderColor: colors.surfaceContainer }}>
            <Text style={{ fontSize: fontSize.base, fontFamily: fonts.sansBold, color: colors.neutral, marginBottom: 6 }}>By Mail or Online</Text>
            <Text style={{ fontSize: 13, fontFamily: fonts.sans, color: colors.neutral, lineHeight: lineHeight.normal, marginBottom: 10 }}>Must be completed at least 15 days prior to the election.</Text>
            <TouchableOpacity
              style={{ paddingVertical: 10, paddingHorizontal: spacing.md, borderRadius: radii.md, marginTop: spacing.xs, borderWidth: 1, borderColor: colors.heroBar, backgroundColor: colors.background }}
              onPress={() => Linking.openURL('https://mvic.sos.state.mi.us/')}
            >
              <Text style={{ color: colors.neutral, fontFamily: fonts.sansBold }}>Register Online →</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.background, borderRadius: radii.md, padding: fontSize.md, borderWidth: 1, borderColor: colors.surfaceContainer }}>
            <Text style={{ fontSize: fontSize.base, fontFamily: fonts.sansBold, color: colors.neutral, marginBottom: 6 }}>In Person</Text>
            <Text style={{ fontSize: 13, fontFamily: fonts.sans, color: colors.neutral, lineHeight: lineHeight.normal, marginBottom: 10 }}>Registration is available at the Clerk's Office up to and including Election Day with proof of residency.</Text>
            <TouchableOpacity
              style={{ paddingVertical: 10, paddingHorizontal: spacing.md, borderRadius: radii.md, marginTop: spacing.xs, borderWidth: 1, borderColor: colors.heroBar, backgroundColor: colors.background }}
              onPress={() => Linking.openURL('mailto:clm@lincolntwp.com')}
            >
              <Text style={{ color: colors.neutral, fontFamily: fonts.sansBold }}>Contact Clerk →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View
        style={{
          marginTop: spacing.lg,
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: colors.outline,
          ...shadows.cardElevated,
        }}
      >
        <Text style={{ fontSize: fontSize.xl, fontFamily: fonts.sansBold, color: colors.neutral, marginBottom: 10 }}>Absentee Voting</Text>
        <Text style={{ fontSize: fontSize.md, fontFamily: fonts.sans, color: colors.neutral, lineHeight: lineHeight.relaxed, marginBottom: spacing.md }}>
          All registered voters in Michigan can vote by absentee ballot — no reason required. Due to the passing of Proposal 18-3, anyone is eligible to request an absentee ballot for any reason.
        </Text>

        <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm }}>
          <View style={{ flex: 1, backgroundColor: colors.surface, borderRadius: radii.md, padding: fontSize.md, borderWidth: 1, borderColor: colors.outline }}>
            <Text style={{ fontSize: fontSize.base, fontFamily: fonts.sansBold, color: colors.neutral, marginBottom: 6 }}>No-Reason Absentee Voting</Text>
            <Text style={{ fontSize: 13, fontFamily: fonts.sans, color: colors.neutral, lineHeight: lineHeight.normal }}>
              All registered voters in Michigan have the right to vote by mail. Ballots are available starting 40 days before the election.
            </Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.surface, borderRadius: radii.md, padding: fontSize.md, borderWidth: 1, borderColor: colors.outline }}>
            <Text style={{ fontSize: fontSize.base, fontFamily: fonts.sansBold, color: colors.neutral, marginBottom: 6 }}>Returning Your Ballot</Text>
            <Text style={{ fontSize: 13, fontFamily: fonts.sans, color: colors.neutral, lineHeight: lineHeight.normal }}>
              Completed ballots must be received by the Township Clerk's Office or placed in the secure ballot drop box at Lincoln Township Hall by 8:00 PM on Election Day.
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 10 }}>
              <Text style={{ fontSize: fontSize.lg }}>📌</Text>
              <Text style={{ color: colors.neutral, fontFamily: fonts.sansBold }}>Drop box at Lincoln Township Hall</Text>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          marginTop: spacing.lg,
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: colors.outline,
          ...shadows.cardElevated,
        }}
      >
        <Text style={{ fontSize: fontSize.xl, fontFamily: fonts.sansBold, color: colors.neutral, marginBottom: 10 }}>Important Deadlines</Text>
        <View style={{ gap: spacing.md, flexDirection: 'row' }}>
          <View style={{ flex: 1, borderRadius: radii.md, padding: fontSize.md, borderWidth: 1, backgroundColor: colors.surface, borderColor: colors.outline }}>
            <Text style={{ fontSize: fontSize.sm, fontFamily: fonts.sansBold, color: colors.neutralVariant, marginBottom: spacing.xs }}>15 Days Before</Text>
            <Text style={{ fontSize: fontSize.md, fontFamily: fonts.sansBold, color: colors.neutral, marginBottom: spacing.sm }}>Online Registration Cutoff</Text>
            <Text style={{ fontSize: 13, lineHeight: lineHeight.normal, fontFamily: fonts.sans, color: colors.neutral }}>
              Registration by mail or online ends. In-person registration still available at the Clerk's Office.
            </Text>
          </View>
          <View style={{ flex: 1, borderRadius: radii.md, padding: fontSize.md, borderWidth: 1, backgroundColor: colors.heroBar, borderColor: colors.heroBar }}>
            <Text style={{ fontSize: fontSize.sm, fontFamily: fonts.sansBold, color: colors.gold, marginBottom: spacing.xs }}>Friday Before</Text>
            <Text style={{ fontSize: fontSize.md, fontFamily: fonts.sansBold, color: colors.neutral, marginBottom: spacing.sm }}>Mail Ballot Deadline</Text>
            <Text style={{ fontSize: 13, lineHeight: lineHeight.normal, fontFamily: fonts.sans, color: colors.neutral }}>
              5:00 PM: Last day to request an absentee ballot be mailed to you.
            </Text>
          </View>
          <View style={{ flex: 1, borderRadius: radii.md, padding: fontSize.md, borderWidth: 1, backgroundColor: colors.surface, borderColor: colors.outline }}>
            <Text style={{ fontSize: fontSize.sm, fontFamily: fonts.sansBold, color: colors.neutralVariant, marginBottom: spacing.xs }}>Election Day</Text>
            <Text style={{ fontSize: fontSize.md, fontFamily: fonts.sansBold, color: colors.neutral, marginBottom: spacing.sm }}>Polls Open</Text>
            <Text style={{ fontSize: 13, lineHeight: lineHeight.normal, fontFamily: fonts.sans, color: colors.neutral }}>
              Polls open 7:00 AM – 8:00 PM. All absentee ballots must be returned by 8:00 PM.
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: spacing.lg, borderRadius: radii.lg, overflow: 'hidden' }}>
        <ImageBackground source={electionsCommunity} style={{ height: 260, justifyContent: 'flex-end' }} resizeMode="cover">
          <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.45)' }} />
          <View style={{ padding: spacing.lg, gap: 10 }}>
            <Text style={{ color: colors.onHeroBar, fontFamily: fonts.sansBold, fontSize: fontSize.xl }}>Serve Your Community</Text>
            <Text style={{ color: colors.onHeroBar, fontFamily: fonts.sans, fontSize: fontSize.md, lineHeight: lineHeight.relaxed }}>
              We are currently seeking election inspectors for upcoming elections. Join our team and be a vital part of the civic process in Lincoln Township.
            </Text>
            <TouchableOpacity
              style={{ flex: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.md, borderRadius: radii.md, alignItems: 'center', backgroundColor: colors.primary }}
              onPress={() => Linking.openURL('mailto:clm@lincolntwp.com?subject=Poll%20Worker%20Interest')}
            >
              <Text style={{ color: colors.onPrimary, fontFamily: fonts.sansBold }}>Apply to Work the Polls</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      <View
        style={{
          marginTop: spacing.lg,
          backgroundColor: colors.surface,
          borderRadius: radii.lg,
          padding: spacing.lg,
          borderWidth: 1,
          borderColor: colors.outline,
          ...shadows.cardElevated,
        }}
      >
        <Text style={{ fontSize: fontSize.xl, fontFamily: fonts.sansBold, color: colors.neutral, marginBottom: 10 }}>Additional Resources</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: spacing.md }}>
          <View style={{ flexBasis: '48%', backgroundColor: colors.background, borderRadius: radii.md, padding: fontSize.md, borderWidth: 1, borderColor: colors.outline }}>
            <Text style={{ fontSize: fontSize.base, fontFamily: fonts.sansBold, color: colors.neutral, marginBottom: 6 }}>Michigan Voter Information Center</Text>
            <Text style={{ fontSize: 13, fontFamily: fonts.sans, color: colors.neutral, lineHeight: lineHeight.normal, marginBottom: 10 }}>Check registration, view sample ballots, and find your polling location.</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://mvic.sos.state.mi.us/')} style={{ paddingVertical: spacing.xs }}>
              <Text style={{ color: colors.primary, fontFamily: fonts.sansBold }}>mvic.sos.state.mi.us →</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexBasis: '48%', backgroundColor: colors.background, borderRadius: radii.md, padding: fontSize.md, borderWidth: 1, borderColor: colors.outline }}>
            <Text style={{ fontSize: fontSize.base, fontFamily: fonts.sansBold, color: colors.neutral, marginBottom: 6 }}>Secretary of State</Text>
            <Text style={{ fontSize: 13, fontFamily: fonts.sans, color: colors.neutral, lineHeight: lineHeight.normal, marginBottom: 10 }}>Voter registration, election information, and absentee voting details.</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.michigan.gov/sos')} style={{ paddingVertical: spacing.xs }}>
              <Text style={{ color: colors.primary, fontFamily: fonts.sansBold }}>michigan.gov/sos →</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexBasis: '48%', backgroundColor: colors.background, borderRadius: radii.md, padding: fontSize.md, borderWidth: 1, borderColor: colors.outline }}>
            <Text style={{ fontSize: fontSize.base, fontFamily: fonts.sansBold, color: colors.neutral, marginBottom: 6 }}>Clare County Clerk</Text>
            <Text style={{ fontSize: 13, fontFamily: fonts.sans, color: colors.neutral, lineHeight: lineHeight.normal, marginBottom: 10 }}>County elections office: voter registration, sample ballots, and election results.</Text>
            <TouchableOpacity onPress={() => Linking.openURL('http://clareclerkrod.com/')} style={{ paddingVertical: spacing.xs }}>
              <Text style={{ color: colors.primary, fontFamily: fonts.sansBold }}>clareclerkrod.com →</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexBasis: '48%', backgroundColor: colors.surface, borderRadius: radii.md, padding: fontSize.md, borderWidth: 1, borderColor: colors.outline }}>
            <Text style={{ fontSize: fontSize.base, fontFamily: fonts.sansBold, color: colors.neutral, marginBottom: 6 }}>Township Clerk</Text>
            <Text style={{ fontSize: 13, fontFamily: fonts.sans, color: colors.neutral, lineHeight: lineHeight.normal, marginBottom: 10 }}>Carol Majewski</Text>
            <TouchableOpacity onPress={() => Linking.openURL('tel:989-588-9069')} style={{ paddingVertical: spacing.xs }}>
              <Text style={{ color: colors.primary, fontFamily: fonts.sansBold }}>989-588-9069</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('mailto:clm@lincolntwp.com')} style={{ paddingVertical: spacing.xs }}>
              <Text style={{ color: colors.primary, fontFamily: fonts.sansBold }}>clm@lincolntwp.com</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {pageBody ? (
        <View style={{ marginTop: spacing.lg, backgroundColor: colors.surface, borderRadius: radii.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.outline }}>
          <Text style={{ fontSize: fontSize.xl, fontFamily: fonts.sansBold, color: colors.neutral, marginBottom: 10 }}>Elections & Voting Information</Text>
          <MarkdownRenderer content={pageBody} />
        </View>
      ) : null}

      {variant !== 'full' ? (
        <Text style={{ textAlign: 'center', paddingVertical: fontSize.xl, fontFamily: fonts.sans, color: colors.neutralVariant }}>Preview mode is enabled.</Text>
      ) : null}
    </ScrollView>
  );
}

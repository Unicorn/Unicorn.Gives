import { useEffect, useMemo, useState } from 'react';
import {
  ImageBackground,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { supabase } from '@/lib/supabase';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

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
  const heroImage = useMemo(() => electionsHero, []);
  const [pageBody, setPageBody] = useState<string | null>(null);

  useEffect(() => {
    // Preserve migrated CMS links (PDF + internal pages) alongside the hand-coded layout.
    supabase
      .from('pages')
      .select('body')
      .eq('slug', 'elections')
      .single()
      .then(({ data }) => {
        if (data?.body) setPageBody(data.body as string);
      })
      .catch(() => {
        // If Supabase isn't available (e.g. during some static export scenarios), we still
        // keep the hand-coded layout as a fallback.
      });
  }, []);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>Election Center</Text>
        </View>

        <Text style={styles.heroTitle}>
          The integrity of <Text style={styles.heroTitleItalic}>your vote</Text> is our mission.
        </Text>

        <Text style={styles.heroIntro}>
          Welcome to the Lincoln Township Election Center. We are dedicated to providing clear, accessible information to ensure every resident can participate confidently in our democratic process.
        </Text>

        <View style={styles.heroActions}>
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary]}
            onPress={() => Linking.openURL('https://mvic.sos.state.mi.us/')}
          >
            <Text style={styles.btnPrimaryText}>Check Registration Status</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnSecondary]}
            onPress={() => Linking.openURL('https://mvic.sos.state.mi.us/')}
          >
            <Text style={styles.btnSecondaryText}>View Sample Ballot</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <ImageBackground source={heroImage} style={styles.heroImage} resizeMode="cover">
          <View style={styles.heroQuoteCard}>
            <Text style={styles.quoteLabel}>“A citizen's voice is the heartbeat of the township.”</Text>
            <Text style={styles.quoteAttr}>— Carol Majewski, Township Clerk</Text>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Voter Registration</Text>
        <Text style={styles.sectionBody}>
          To vote in Lincoln Township, you must be a U.S. citizen, at least 18 years old by Election Day, and a resident of the township for at least 30 days.
        </Text>
        <View style={styles.row}>
          <View style={styles.subCard}>
            <Text style={styles.subCardTitle}>By Mail or Online</Text>
            <Text style={styles.subCardBody}>Must be completed at least 15 days prior to the election.</Text>
            <TouchableOpacity
              style={[styles.smallLinkButton, styles.smallLinkButtonOutline]}
              onPress={() => Linking.openURL('https://mvic.sos.state.mi.us/')}
            >
              <Text style={styles.smallLinkText}>Register Online →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.subCard}>
            <Text style={styles.subCardTitle}>In Person</Text>
            <Text style={styles.subCardBody}>Registration is available at the Clerk's Office up to and including Election Day with proof of residency.</Text>
            <TouchableOpacity
              style={[styles.smallLinkButton, styles.smallLinkButtonOutline]}
              onPress={() => Linking.openURL('mailto:clm@lincolntwp.com')}
            >
              <Text style={styles.smallLinkText}>Contact Clerk →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.sectionCardAlt}>
        <Text style={styles.sectionTitle}>Absentee Voting</Text>
        <Text style={styles.sectionBody}>
          All registered voters in Michigan can vote by absentee ballot — no reason required. Due to the passing of Proposal 18-3, anyone is eligible to request an absentee ballot for any reason.
        </Text>

        <View style={styles.absenteeCards}>
          <View style={styles.absenteeCard}>
            <Text style={styles.subCardTitle}>No-Reason Absentee Voting</Text>
            <Text style={styles.subCardBody}>
              All registered voters in Michigan have the right to vote by mail. Ballots are available starting 40 days before the election.
            </Text>
          </View>
          <View style={styles.absenteeCard}>
            <Text style={styles.subCardTitle}>Returning Your Ballot</Text>
            <Text style={styles.subCardBody}>
              Completed ballots must be received by the Township Clerk's Office or placed in the secure ballot drop box at Lincoln Township Hall by 8:00 PM on Election Day.
            </Text>
            <View style={styles.dropboxNote}>
              <Text style={styles.dropboxNoteIcon}>📌</Text>
              <Text style={styles.dropboxNoteText}>Drop box at Lincoln Township Hall</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Important Deadlines</Text>
        <View style={styles.deadlineCards}>
          <View style={[styles.deadlineCard, styles.deadlineCardNormal]}>
            <Text style={styles.deadlineDate}>15 Days Before</Text>
            <Text style={styles.deadlineLabel}>Online Registration Cutoff</Text>
            <Text style={styles.deadlineBody}>
              Registration by mail or online ends. In-person registration still available at the Clerk's Office.
            </Text>
          </View>
          <View style={[styles.deadlineCard, styles.deadlineCardHighlight]}>
            <Text style={[styles.deadlineDate, styles.deadlineDateHighlight]}>Friday Before</Text>
            <Text style={styles.deadlineLabel}>Mail Ballot Deadline</Text>
            <Text style={styles.deadlineBody}>
              5:00 PM: Last day to request an absentee ballot be mailed to you.
            </Text>
          </View>
          <View style={[styles.deadlineCard, styles.deadlineCardNormal]}>
            <Text style={styles.deadlineDate}>Election Day</Text>
            <Text style={styles.deadlineLabel}>Polls Open</Text>
            <Text style={styles.deadlineBody}>
              Polls open 7:00 AM – 8:00 PM. All absentee ballots must be returned by 8:00 PM.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.pollWorkerWrap}>
        <ImageBackground source={electionsCommunity} style={styles.pollWorkerBg} resizeMode="cover">
          <View style={styles.pollWorkerOverlay} />
          <View style={styles.pollWorkerContent}>
            <Text style={styles.pollWorkerTitle}>Serve Your Community</Text>
            <Text style={styles.pollWorkerBody}>
              We are currently seeking election inspectors for upcoming elections. Join our team and be a vital part of the civic process in Lincoln Township.
            </Text>
            <TouchableOpacity
              style={[styles.btn, styles.btnGreen]}
              onPress={() => Linking.openURL('mailto:clm@lincolntwp.com?subject=Poll%20Worker%20Interest')}
            >
              <Text style={styles.btnGreenText}>Apply to Work the Polls</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Additional Resources</Text>
        <View style={styles.resourceGrid}>
          <View style={styles.resourceCard}>
            <Text style={styles.resourceTitle}>Michigan Voter Information Center</Text>
            <Text style={styles.resourceBody}>Check registration, view sample ballots, and find your polling location.</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://mvic.sos.state.mi.us/')} style={styles.resourceLink}>
              <Text style={styles.resourceLinkText}>mvic.sos.state.mi.us →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.resourceCard}>
            <Text style={styles.resourceTitle}>Secretary of State</Text>
            <Text style={styles.resourceBody}>Voter registration, election information, and absentee voting details.</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.michigan.gov/sos')} style={styles.resourceLink}>
              <Text style={styles.resourceLinkText}>michigan.gov/sos →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.resourceCard}>
            <Text style={styles.resourceTitle}>Clare County Clerk</Text>
            <Text style={styles.resourceBody}>County elections office: voter registration, sample ballots, and election results.</Text>
            <TouchableOpacity onPress={() => Linking.openURL('http://clareclerkrod.com/')} style={styles.resourceLink}>
              <Text style={styles.resourceLinkText}>clareclerkrod.com →</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.resourceCard, styles.resourceCardContact]}>
            <Text style={styles.resourceTitle}>Township Clerk</Text>
            <Text style={styles.resourceBody}>Carol Majewski</Text>
            <TouchableOpacity onPress={() => Linking.openURL('tel:989-588-9069')} style={styles.resourceLink}>
              <Text style={styles.resourceLinkText}>989-588-9069</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('mailto:clm@lincolntwp.com')} style={styles.resourceLink}>
              <Text style={styles.resourceLinkText}>clm@lincolntwp.com</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {pageBody ? (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Elections & Voting Information</Text>
          <MarkdownRenderer content={pageBody} />
        </View>
      ) : null}

      {variant !== 'full' ? (
        <Text style={styles.notFullNotice}>Preview mode is enabled.</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { padding: 16, paddingBottom: 40 },

  hero: { paddingTop: 10, paddingBottom: 8 },
  heroBadge: { alignSelf: 'flex-start', backgroundColor: '#e5f0ea', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 12 },
  heroBadgeText: { color: '#2d4a4a', fontWeight: '800', fontSize: 12, letterSpacing: 0.5 },
  heroTitle: { fontSize: 26, fontWeight: '900', color: '#2d4a4a', lineHeight: 34, marginBottom: 10 },
  heroTitleItalic: { fontStyle: 'italic' },
  heroIntro: { fontSize: 15, color: '#43493e', lineHeight: 22, marginBottom: 14 },
  heroActions: { flexDirection: 'row', gap: 12 },

  btn: { flex: 1, paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, alignItems: 'center' },
  btnPrimary: { backgroundColor: '#2d4a4a' },
  btnPrimaryText: { color: '#fcf9f4', fontWeight: '800' },
  btnSecondary: { borderWidth: 1, borderColor: '#2d4a4a', backgroundColor: '#fcf9f4' },
  btnSecondaryText: { color: '#2d4a4a', fontWeight: '800' },
  btnGreen: { backgroundColor: '#2f6b4a' },
  btnGreenText: { color: '#fcf9f4', fontWeight: '900' },

  heroImage: { height: 240, borderRadius: 16, overflow: 'hidden', justifyContent: 'flex-end' },
  heroQuoteCard: { position: 'absolute', right: 12, bottom: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 14, padding: 14 },
  quoteLabel: { color: '#fcf9f4', fontWeight: '800', fontSize: 15, marginBottom: 6 },
  quoteAttr: { color: '#d4b96e', fontWeight: '700', fontSize: 13 },

  sectionCard: { marginTop: 16, backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#c3c8bb' },
  sectionCardAlt: { marginTop: 16, backgroundColor: '#f0ede8', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#c3c8bb' },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#2d4a4a', marginBottom: 10 },
  sectionBody: { fontSize: 14, color: '#43493e', lineHeight: 22, marginBottom: 12 },

  row: { flexDirection: 'row', gap: 12 },
  subCard: { flex: 1, backgroundColor: '#fcf9f4', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#e2e5d8' },
  subCardTitle: { fontSize: 15, fontWeight: '800', color: '#2d4a4a', marginBottom: 6 },
  subCardBody: { fontSize: 13, color: '#43493e', lineHeight: 20, marginBottom: 10 },

  smallLinkButton: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, marginTop: 4 },
  smallLinkButtonOutline: { borderWidth: 1, borderColor: '#2d4a4a', backgroundColor: '#fcf9f4' },
  smallLinkText: { color: '#2d4a4a', fontWeight: '800' },

  absenteeCards: { flexDirection: 'row', gap: 12, marginTop: 8 },
  absenteeCard: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#c3c8bb' },

  dropboxNote: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  dropboxNoteIcon: { fontSize: 16 },
  dropboxNoteText: { color: '#2d4a4a', fontWeight: '800' },

  deadlineCards: { gap: 12, flexDirection: 'row' },
  deadlineCard: { flex: 1, borderRadius: 14, padding: 14, borderWidth: 1 },
  deadlineCardNormal: { backgroundColor: '#fff', borderColor: '#c3c8bb' },
  deadlineCardHighlight: { backgroundColor: '#2d4a4a', borderColor: '#2d4a4a' },
  deadlineDate: { fontSize: 12, fontWeight: '900', color: '#73796d', marginBottom: 4 },
  deadlineDateHighlight: { color: '#d4b96e' },
  deadlineLabel: { fontSize: 14, fontWeight: '800', color: '#2d4a4a', marginBottom: 8 },
  deadlineBody: { fontSize: 13, lineHeight: 20, color: '#43493e' },

  pollWorkerWrap: { marginTop: 16, borderRadius: 16, overflow: 'hidden' },
  pollWorkerBg: { height: 260, justifyContent: 'flex-end' },
  pollWorkerOverlay: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.45)' },
  pollWorkerContent: { padding: 16, gap: 10 },
  pollWorkerTitle: { color: '#fcf9f4', fontWeight: '900', fontSize: 20 },
  pollWorkerBody: { color: '#fcf9f4', fontSize: 14, lineHeight: 22 },

  resourceGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 12 },
  resourceCard: { flexBasis: '48%', backgroundColor: '#fcf9f4', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#c3c8bb' },
  resourceCardContact: { backgroundColor: '#fff' },
  resourceTitle: { fontSize: 15, fontWeight: '900', color: '#2d4a4a', marginBottom: 6 },
  resourceBody: { fontSize: 13, color: '#43493e', lineHeight: 20, marginBottom: 10 },
  resourceLink: { paddingVertical: 4 },
  resourceLinkText: { color: '#3d6060', fontWeight: '800' },
  notFullNotice: { textAlign: 'center', paddingVertical: 18, color: '#73796d' },
});


import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Pressable,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { routes } from '@/lib/navigation';
import { governmentHref } from '@/lib/governmentHref';
import { supabase } from '@/lib/supabase';
import { HomeTabBar, type HomeTabId } from '@/components/home/HomeTabBar';
import {
  DISCOVER_TAGLINE,
  DISCOVER_PARAGRAPHS,
  DISCOVER_MISSION_LEDE,
  HISTORY_INTRO_PARAGRAPHS,
  HISTORY_LORE_TEASERS,
  HISTORY_UNICORN_CALLOUT,
  HISTORY_SOURCES_INTRO,
  HISTORY_CITATIONS,
} from '@/constants/homeDiscoverHistory';

interface Region {
  id: string;
  slug: string;
  name: string;
  type: string;
}


interface NewsItem {
  slug: string;
  title: string;
  date: string;
  category: string;
}
interface Event {
  slug: string;
  title: string;
  date: string;
  time: string | null;
  location: string | null;
}
interface Partner {
  slug: string;
  name: string;
  description: string | null;
}

const CATEGORIES = [
  { slug: 'property', label: 'Property & Building', icon: '🏠' },
  { slug: 'taxes', label: 'Taxes & Assessment', icon: '💰' },
  { slug: 'safety', label: 'Safety & Emergency', icon: '🚨' },
  { slug: 'nature', label: 'Nature & Conservation', icon: '🌿' },
  { slug: 'government', label: 'Government & Records', icon: '🏛️' },
  { slug: 'services', label: 'Community Services', icon: '🤝' },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [tab, setTab] = useState<HomeTabId>('discover');
  const [regions, setRegions] = useState<Region[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    supabase
      .from('regions')
      .select('id, slug, name, type')
      .eq('is_active', true)
      .order('display_order')
      .then(({ data }) => {
        if (data) setRegions(data);
      });
    supabase
      .from('news')
      .select('slug, title, date, category')
      .eq('status', 'published')
      .in('visibility', ['global', 'both'])
      .order('date', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setNews(data);
      });
    supabase
      .from('events')
      .select('slug, title, date, time, location')
      .eq('status', 'published')
      .in('visibility', ['global', 'both'])
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date')
      .limit(4)
      .then(({ data }) => {
        if (data) setEvents(data);
      });
    supabase
      .from('partners')
      .select('slug, name, description')
      .eq('is_active', true)
      .then(({ data }) => {
        if (data) setPartners(data);
      });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>unicorn.gives</Text>
        <Text style={styles.heroTitle}>Land of the Unicorns</Text>
        <Text style={styles.heroTagline}>{DISCOVER_TAGLINE}</Text>
      </View>

      <HomeTabBar active={tab} onChange={setTab} />

      {tab === 'discover' && (
        <View style={styles.panel}>
          {DISCOVER_PARAGRAPHS.map((p) => (
            <Text key={p.id} style={styles.body}>
              {p.text}
            </Text>
          ))}
          <View style={styles.missionCard}>
            <Text style={styles.missionLabel}>What we are building</Text>
            <Text style={styles.missionText}>{DISCOVER_MISSION_LEDE}</Text>
          </View>
          <Text style={styles.sectionTitle}>Explore</Text>
          <View style={styles.ctaRow}>
            <Link href={routes.solve.index()} asChild>
              <TouchableOpacity style={styles.ctaButton}>
                <Text style={styles.ctaButtonText}>Problem Solver</Text>
              </TouchableOpacity>
            </Link>
            <Link href={routes.lore.index()} asChild>
              <TouchableOpacity style={styles.ctaButtonOutline}>
                <Text style={styles.ctaButtonOutlineText}>Land &amp; lore</Text>
              </TouchableOpacity>
            </Link>
          </View>
          {partners.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Community partners</Text>
              <View style={styles.partnerChips}>
                {partners.slice(0, 8).map((p) => (
                  <Link key={p.slug} href={routes.partners.index(p.slug)} asChild>
                    <TouchableOpacity style={styles.partnerChip}>
                      <Text style={styles.partnerChipText}>{p.name}</Text>
                    </TouchableOpacity>
                  </Link>
                ))}
              </View>
            </>
          )}
        </View>
      )}

      {tab === 'stay' && (
        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>What do you need help with?</Text>
          <View style={styles.grid}>
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={routes.solve.withCategory(cat.slug)} asChild>
                <TouchableOpacity style={styles.card}>
                  <Text style={styles.cardIcon}>{cat.icon}</Text>
                  <Text style={styles.cardTitle}>{cat.label}</Text>
                </TouchableOpacity>
              </Link>
            ))}
          </View>

          {regions.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Government</Text>
              {regions.map((r) => (
                <Link key={r.id} href={governmentHref(r)} asChild>
                  <TouchableOpacity style={styles.regionCard}>
                    <Text style={styles.regionType}>{r.type.toUpperCase()}</Text>
                    <Text style={styles.regionName}>{r.name}</Text>
                  </TouchableOpacity>
                </Link>
              ))}
            </>
          )}

          {partners.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Community partners</Text>
              <View style={styles.grid}>
                {partners.map((p) => (
                  <Link key={p.slug} href={routes.partners.index(p.slug)} asChild>
                    <TouchableOpacity style={styles.card}>
                      <Text style={styles.partnerName}>{p.name}</Text>
                      {p.description && (
                        <Text style={styles.partnerDesc} numberOfLines={2}>
                          {p.description}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </Link>
                ))}
              </View>
            </>
          )}

          {!user && (
            <View style={styles.authBanner}>
              <Text style={styles.authText}>
                Sign in to RSVP for events, save content, and more.
              </Text>
              <Link href={routes.auth.signIn()} asChild>
                <TouchableOpacity style={styles.authButton}>
                  <Text style={styles.authButtonText}>Sign In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          )}
        </View>
      )}

      {tab === 'history' && (
        <View style={styles.panel}>
          {HISTORY_INTRO_PARAGRAPHS.map((p) => (
            <Text key={p.id} style={styles.body}>
              {p.text}
            </Text>
          ))}

          <View style={styles.loreCalloutTwilight}>
            <Text style={styles.loreCalloutLabel}>Convergence</Text>
            <Text style={styles.loreCalloutBody}>
              Northern Michigan is one of the rare places where European fairy tradition and Indigenous
              spirit tradition genuinely rhyme — not always through influence, but because both were
              responding to the same land, the same deep pines, the same cold lakes. The Up North feeling
              of strangeness is not only nostalgia. It is the weight of place.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Stories of the north</Text>
          <Text style={styles.muted}>
            Folklore and tradition — framed as story, not as fact sheet.
          </Text>
          {HISTORY_LORE_TEASERS.map((item) => (
            <Link key={item.slug} href={routes.lore.detail(item.slug)} asChild>
              <TouchableOpacity style={styles.loreTeaserCard}>
                <Text style={styles.loreTeaserKind}>{item.kind.toUpperCase()}</Text>
                <Text style={styles.loreTeaserTitle}>{item.title}</Text>
                <Text style={styles.loreTeaserBlurb}>{item.blurb}</Text>
                <Text style={styles.loreTeaserLink}>Read more</Text>
              </TouchableOpacity>
            </Link>
          ))}

          <View style={styles.loreCalloutAmber}>
            <Text style={styles.loreCalloutLabelAmber}>{HISTORY_UNICORN_CALLOUT.label}</Text>
            <Text style={styles.loreCalloutBodyDark}>{HISTORY_UNICORN_CALLOUT.body}</Text>
          </View>

          <Text style={styles.sectionTitle}>Sources &amp; further reading</Text>
          <Text style={styles.muted}>{HISTORY_SOURCES_INTRO}</Text>
          {HISTORY_CITATIONS.map((c) => (
            <Pressable
              key={c.url}
              style={styles.citationBlock}
              onPress={() => Linking.openURL(c.url)}
            >
              <Text style={styles.citationTitle}>{c.title}</Text>
              {c.note && <Text style={styles.citationNote}>{c.note}</Text>}
              <Text style={styles.citationUrl}>{c.url}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {tab === 'events' && (
        <View style={styles.panel}>
          {events.length > 0 ? (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming events</Text>
                <Link href={routes.events.index()} asChild>
                  <TouchableOpacity>
                    <Text style={styles.viewAll}>View all</Text>
                  </TouchableOpacity>
                </Link>
              </View>
              {events.map((e) => (
                <Link key={e.slug} href={routes.events.detail(e.slug)} asChild>
                  <TouchableOpacity style={styles.eventItem}>
                    <View style={styles.dateBox}>
                      <Text style={styles.dateMonth}>
                        {new Date(e.date + 'T00:00:00')
                          .toLocaleDateString('en-US', { month: 'short' })
                          .toUpperCase()}
                      </Text>
                      <Text style={styles.dateDay}>
                        {new Date(e.date + 'T00:00:00').getDate()}
                      </Text>
                    </View>
                    <View style={styles.eventInfo}>
                      <Text style={styles.eventTitle}>{e.title}</Text>
                      {e.time && <Text style={styles.eventMeta}>{e.time}</Text>}
                      {e.location && (
                        <Text style={styles.eventMeta} numberOfLines={1}>
                          {e.location}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                </Link>
              ))}
            </>
          ) : (
            <Text style={styles.emptyText}>
              No upcoming events in the feed right now. Open the full calendar to browse.
            </Text>
          )}
          <Link href={routes.events.index()} asChild>
            <TouchableOpacity style={styles.fullWidthCta}>
              <Text style={styles.fullWidthCtaText}>Open events calendar</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}

      {tab === 'news' && (
        <View style={styles.panel}>
          {news.length > 0 ? (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Latest news</Text>
                <Link href={routes.news.index()} asChild>
                  <TouchableOpacity>
                    <Text style={styles.viewAll}>View all</Text>
                  </TouchableOpacity>
                </Link>
              </View>
              {news.map((n) => (
                <Link key={n.slug} href={routes.news.detail(n.slug)} asChild>
                  <TouchableOpacity style={styles.newsItem}>
                    <Text style={styles.newsCategory}>
                      {n.category.replace(/-/g, ' ').toUpperCase()}
                    </Text>
                    <Text style={styles.newsTitle}>{n.title}</Text>
                    <Text style={styles.newsDate}>
                      {new Date(n.date + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </TouchableOpacity>
                </Link>
              ))}
            </>
          ) : (
            <Text style={styles.emptyText}>
              No published news items yet. Check back soon for civic updates.
            </Text>
          )}
          <Link href={routes.news.index()} asChild>
            <TouchableOpacity style={styles.fullWidthCta}>
              <Text style={styles.fullWidthCtaText}>Open news feed</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f4' },
  content: { paddingBottom: 40 },
  hero: {
    backgroundColor: '#2d4a4a',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: '#74c69d',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fcf9f4',
    marginBottom: 6,
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }),
  },
  heroTagline: {
    fontSize: 17,
    fontWeight: '600',
    color: '#d4b96e',
  },
  panel: { padding: 20, paddingTop: 16 },
  body: {
    fontSize: 15,
    color: '#43493e',
    lineHeight: 24,
    marginBottom: 14,
  },
  muted: {
    fontSize: 13,
    color: '#73796d',
    lineHeight: 20,
    marginBottom: 14,
  },
  missionCard: {
    backgroundColor: '#e8f0e0',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2d4a4a',
  },
  missionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2d4a4a',
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  missionText: { fontSize: 15, color: '#2d4a4a', lineHeight: 22 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d4a4a',
    marginBottom: 12,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAll: { fontSize: 14, fontWeight: '600', color: '#3d6060' },
  ctaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  ctaButton: {
    backgroundColor: '#2d4a4a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  ctaButtonText: { color: '#fcf9f4', fontWeight: '700', fontSize: 15 },
  ctaButtonOutline: {
    borderWidth: 2,
    borderColor: '#2d4a4a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  ctaButtonOutlineText: { color: '#2d4a4a', fontWeight: '700', fontSize: 15 },
  partnerChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  partnerChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#c3c8bb',
  },
  partnerChipText: { fontSize: 13, fontWeight: '600', color: '#2d4a4a' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#c3c8bb',
  },
  cardIcon: { fontSize: 24, marginBottom: 6 },
  cardTitle: { fontSize: 13, fontWeight: '600', color: '#2d4a4a' },
  regionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#c3c8bb',
  },
  regionType: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8a9a7c',
    letterSpacing: 1,
    marginBottom: 2,
  },
  regionName: { fontSize: 17, fontWeight: '700', color: '#2d4a4a' },
  newsItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#c3c8bb',
  },
  newsCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8a9a7c',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  newsTitle: { fontSize: 14, fontWeight: '600', color: '#2d4a4a', marginBottom: 2 },
  newsDate: { fontSize: 12, color: '#73796d' },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#c3c8bb',
    gap: 12,
    alignItems: 'center',
  },
  dateBox: {
    width: 44,
    alignItems: 'center',
    backgroundColor: '#2d4a4a',
    borderRadius: 6,
    paddingVertical: 5,
  },
  dateMonth: {
    fontSize: 9,
    fontWeight: '700',
    color: '#d4b96e',
    letterSpacing: 1,
  },
  dateDay: { fontSize: 18, fontWeight: '800', color: '#fcf9f4' },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: 14, fontWeight: '600', color: '#2d4a4a', marginBottom: 1 },
  eventMeta: { fontSize: 12, color: '#73796d' },
  partnerName: { fontSize: 16, fontWeight: '700', color: '#2d4a4a', marginBottom: 4 },
  partnerDesc: { fontSize: 12, color: '#43493e', lineHeight: 18 },
  authBanner: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#e8f0e0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  authText: { flex: 1, fontSize: 13, color: '#43493e' },
  authButton: {
    backgroundColor: '#2d4a4a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  authButtonText: { color: '#fcf9f4', fontWeight: '600', fontSize: 13 },
  loreCalloutTwilight: {
    backgroundColor: '#3d2b56',
    borderRadius: 10,
    padding: 16,
    marginVertical: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#b45309',
  },
  loreCalloutLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ede7f6',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  loreCalloutBody: { fontSize: 15, color: '#ede7f6', lineHeight: 24, fontStyle: 'italic' },
  loreCalloutAmber: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#b45309',
  },
  loreCalloutLabelAmber: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b45309',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  loreCalloutBodyDark: { fontSize: 15, color: '#43493e', lineHeight: 24, fontStyle: 'italic' },
  loreTeaserCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#c3c8bb',
  },
  loreTeaserKind: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6b4e8a',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  loreTeaserTitle: { fontSize: 17, fontWeight: '700', color: '#2d4a4a', marginBottom: 6 },
  loreTeaserBlurb: { fontSize: 14, color: '#43493e', lineHeight: 21, marginBottom: 8 },
  loreTeaserLink: { fontSize: 14, fontWeight: '700', color: '#3d6060' },
  citationBlock: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0ddd6',
  },
  citationTitle: { fontSize: 15, fontWeight: '700', color: '#2d6a4f', marginBottom: 4 },
  citationNote: { fontSize: 13, color: '#73796d', marginBottom: 4, lineHeight: 18 },
  citationUrl: { fontSize: 12, color: '#3d6060' },
  emptyText: {
    fontSize: 15,
    color: '#73796d',
    lineHeight: 22,
    marginBottom: 16,
  },
  fullWidthCta: {
    backgroundColor: '#2d4a4a',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  fullWidthCtaText: { color: '#fcf9f4', fontWeight: '700', fontSize: 15 },
});

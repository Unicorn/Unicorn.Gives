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
  Image,
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
  HOME_BENTO_REGION_TITLE,
  HOME_BENTO_SOLVE_TITLE,
  HOME_BENTO_SOLVE_DESC,
  HOME_BENTO_GOV_TITLE,
  HOME_BENTO_GOV_DESC,
  HOME_BENTO_EVENTS_TITLE,
  HOME_BENTO_EVENTS_EMPTY,
  HOME_BENTO_NEWS_TITLE,
  HOME_NEWSLETTER_TITLE,
  HOME_NEWSLETTER_BODY,
  HOME_NEWSLETTER_CTA_PRIMARY,
  HOME_NEWSLETTER_CTA_EXTERNAL,
  HOME_HERO_IMPACT_LABEL,
} from '@/constants/homeDiscoverHistory';
import { homeColors, homeFonts, homeRadii } from '@/constants/homeTheme';

const FALLBACK_COUNTY_SLUG = 'clare-county';

const newsletterUrl =
  typeof process.env.EXPO_PUBLIC_NEWSLETTER_URL === 'string' &&
  process.env.EXPO_PUBLIC_NEWSLETTER_URL.length > 0
    ? process.env.EXPO_PUBLIC_NEWSLETTER_URL
    : undefined;

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

function formatEventDay(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }),
    day: d.getDate(),
  };
}

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

  const govHref =
    regions.length > 0 ? governmentHref(regions[0]) : routes.county.root(FALLBACK_COUNTY_SLUG);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.heroPill}>
          <Text style={styles.heroPillText}>unicorn.gives</Text>
        </View>
        <Text style={styles.heroTitle}>
          <Text style={styles.heroTitleItalic}>Land of the </Text>
          <Text style={styles.heroTitleBold}>Unicorns</Text>
        </Text>
        <Text style={styles.heroTagline}>{DISCOVER_TAGLINE}</Text>
        <View style={styles.heroCtaRow}>
          <Link href={routes.solve.index()} asChild>
            <TouchableOpacity style={styles.heroCtaPrimary}>
              <Text style={styles.heroCtaPrimaryText}>Problem Solver</Text>
            </TouchableOpacity>
          </Link>
          <Link href={routes.lore.index()} asChild>
            <TouchableOpacity style={styles.heroCtaOutline}>
              <Text style={styles.heroCtaOutlineText}>Land &amp; lore</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.heroImageBlock}>
          <Image
            source={require('../../assets/images/home-hero.png')}
            style={styles.heroImage}
            resizeMode="cover"
            accessibilityLabel="Northern Michigan landscape"
          />
          <View style={styles.heroQuoteCard}>
            <Text style={styles.heroQuoteLabel}>{HOME_HERO_IMPACT_LABEL}</Text>
            <Text style={styles.heroQuoteBody} numberOfLines={5}>
              {DISCOVER_MISSION_LEDE}
            </Text>
          </View>
        </View>
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
              <View style={styles.partnerFeatureRow}>
                {partners.slice(0, 2).map((p) => (
                  <Link key={p.slug} href={routes.partners.index(p.slug)} asChild>
                    <TouchableOpacity style={styles.partnerFeatureCard}>
                      <View style={styles.partnerFeatureBanner}>
                        <Text style={styles.partnerFeatureBannerLetter}>
                          {p.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View style={styles.partnerFeatureBody}>
                        <Text style={styles.partnerFeatureName}>{p.name}</Text>
                        {p.description ? (
                          <Text style={styles.partnerFeatureDesc} numberOfLines={3}>
                            {p.description}
                          </Text>
                        ) : null}
                        <Text style={styles.partnerFeatureCta}>Visit partner</Text>
                      </View>
                    </TouchableOpacity>
                  </Link>
                ))}
              </View>
              {partners.length > 2 && (
                <View style={styles.partnerChips}>
                  {partners.slice(2).map((p) => (
                    <Link key={p.slug} href={routes.partners.index(p.slug)} asChild>
                      <TouchableOpacity style={styles.partnerChip}>
                        <Text style={styles.partnerChipText}>{p.name}</Text>
                      </TouchableOpacity>
                    </Link>
                  ))}
                </View>
              )}
            </>
          )}

          <Text style={[styles.sectionTitle, styles.bentoTitleSpacing]}>{HOME_BENTO_REGION_TITLE}</Text>
          <View style={styles.bentoGrid}>
            <Link href={routes.solve.index()} asChild>
              <TouchableOpacity style={styles.bentoTile}>
                <Text style={styles.bentoTileIcon}>◎</Text>
                <Text style={styles.bentoTileHeading}>{HOME_BENTO_SOLVE_TITLE}</Text>
                <Text style={styles.bentoTileDesc}>{HOME_BENTO_SOLVE_DESC}</Text>
                <Text style={styles.bentoTileLink}>Open problem solver</Text>
              </TouchableOpacity>
            </Link>
            <Link href={govHref} asChild>
              <TouchableOpacity style={styles.bentoTile}>
                <Text style={styles.bentoTileIcon}>⚖</Text>
                <Text style={styles.bentoTileHeading}>{HOME_BENTO_GOV_TITLE}</Text>
                <Text style={styles.bentoTileDesc}>{HOME_BENTO_GOV_DESC}</Text>
                <Text style={styles.bentoTileLink}>Browse government</Text>
              </TouchableOpacity>
            </Link>
            <View style={styles.bentoEventsTile}>
              <Text style={styles.bentoEventsIcon}>📅</Text>
              <Text style={[styles.bentoTileHeading, styles.bentoEventsHeading]}>
                {HOME_BENTO_EVENTS_TITLE}
              </Text>
              {events.length > 0 ? (
                events.slice(0, 2).map((e) => {
                  const { month, day } = formatEventDay(e.date);
                  return (
                    <View key={e.slug} style={styles.bentoEventRow}>
                      <Text style={styles.bentoEventDate}>
                        {month} {day}
                      </Text>
                      <Text style={styles.bentoEventTitle} numberOfLines={2}>
                        {e.title}
                      </Text>
                    </View>
                  );
                })
              ) : (
                <Text style={styles.bentoEventsEmpty}>{HOME_BENTO_EVENTS_EMPTY}</Text>
              )}
              <Link href={routes.events.index()} asChild>
                <TouchableOpacity style={styles.bentoEventsCta}>
                  <Text style={styles.bentoEventsCtaText}>See full calendar</Text>
                </TouchableOpacity>
              </Link>
            </View>
            <View style={styles.bentoNewsTile}>
              <Text style={styles.bentoTileHeading}>{HOME_BENTO_NEWS_TITLE}</Text>
              {news[0] ? (
                <Link href={routes.news.detail(news[0].slug)} asChild>
                  <TouchableOpacity>
                    <Text style={styles.bentoNewsHeadline} numberOfLines={3}>
                      {news[0].title}
                    </Text>
                  </TouchableOpacity>
                </Link>
              ) : (
                <Text style={styles.bentoTileDesc}>Check back for civic updates.</Text>
              )}
              <Link href={routes.news.index()} asChild>
                <TouchableOpacity style={styles.bentoNewsFooter}>
                  <Text style={styles.bentoTileLink}>Open news feed</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          <View style={styles.newsletterBand}>
            <Text style={styles.newsletterTitle}>{HOME_NEWSLETTER_TITLE}</Text>
            <Text style={styles.newsletterBody}>{HOME_NEWSLETTER_BODY}</Text>
            {newsletterUrl ? (
              <TouchableOpacity
                style={styles.newsletterButton}
                onPress={() => Linking.openURL(newsletterUrl)}
              >
                <Text style={styles.newsletterButtonText}>{HOME_NEWSLETTER_CTA_EXTERNAL}</Text>
              </TouchableOpacity>
            ) : (
              <Link href={routes.news.index()} asChild>
                <TouchableOpacity style={styles.newsletterButton}>
                  <Text style={styles.newsletterButtonText}>{HOME_NEWSLETTER_CTA_PRIMARY}</Text>
                </TouchableOpacity>
              </Link>
            )}
          </View>
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

const shadowCard = Platform.select({
  ios: {
    shadowColor: '#1a1b25',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
  },
  android: { elevation: 4 },
  default: {},
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: homeColors.background },
  content: { paddingBottom: 40 },
  hero: {
    backgroundColor: homeColors.heroBar,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  heroPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(144, 244, 228, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: homeRadii.pill,
    marginBottom: 14,
  },
  heroPillText: {
    fontSize: 11,
    fontFamily: homeFonts.sansBold,
    color: homeColors.primaryFixed,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  heroTitle: { marginBottom: 10 },
  heroTitleItalic: {
    fontSize: 34,
    lineHeight: 38,
    fontFamily: homeFonts.serifItalic,
    color: '#f1f5f4',
  },
  heroTitleBold: {
    fontSize: 34,
    lineHeight: 38,
    fontFamily: homeFonts.serifBold,
    color: '#ffffff',
  },
  heroTagline: {
    fontSize: 17,
    fontFamily: homeFonts.sansMedium,
    color: homeColors.accent,
    marginBottom: 16,
  },
  heroCtaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  heroCtaPrimary: {
    backgroundColor: homeColors.primary,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: homeRadii.pill,
    minHeight: 44,
    justifyContent: 'center',
  },
  heroCtaPrimaryText: {
    color: homeColors.onPrimary,
    fontFamily: homeFonts.sansBold,
    fontSize: 15,
  },
  heroCtaOutline: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: homeRadii.pill,
    minHeight: 44,
    justifyContent: 'center',
  },
  heroCtaOutlineText: {
    color: '#f1f5f4',
    fontFamily: homeFonts.sansBold,
    fontSize: 15,
  },
  heroImageBlock: {
    borderRadius: homeRadii.lg,
    overflow: 'hidden',
    ...shadowCard,
  },
  heroImage: {
    width: '100%',
    height: 220,
    backgroundColor: homeColors.surfaceContainer,
  },
  heroQuoteCard: {
    backgroundColor: homeColors.surfaceContainerHigh,
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: homeColors.outline,
  },
  heroQuoteLabel: {
    fontSize: 10,
    fontFamily: homeFonts.sansBold,
    color: homeColors.tertiary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heroQuoteBody: {
    fontSize: 14,
    fontFamily: homeFonts.serifItalic,
    color: homeColors.onSurfaceVariant,
    lineHeight: 21,
  },
  panel: { padding: 20, paddingTop: 16 },
  body: {
    fontSize: 15,
    fontFamily: homeFonts.sans,
    color: homeColors.onSurfaceVariant,
    lineHeight: 24,
    marginBottom: 14,
  },
  muted: {
    fontSize: 13,
    fontFamily: homeFonts.sans,
    color: homeColors.muted,
    lineHeight: 20,
    marginBottom: 14,
  },
  missionCard: {
    backgroundColor: homeColors.surfaceContainer,
    borderRadius: homeRadii.md,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: homeColors.primary,
  },
  missionLabel: {
    fontSize: 11,
    fontFamily: homeFonts.sansBold,
    color: homeColors.primary,
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  missionText: {
    fontSize: 15,
    fontFamily: homeFonts.sans,
    color: homeColors.primary,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: homeFonts.serifBold,
    color: homeColors.onSurface,
    marginBottom: 12,
    marginTop: 4,
  },
  bentoTitleSpacing: { marginTop: 8 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 14,
    fontFamily: homeFonts.sansMedium,
    color: homeColors.primary,
  },
  ctaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
  ctaButton: {
    backgroundColor: homeColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: homeRadii.pill,
    minHeight: 44,
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: homeColors.onPrimary,
    fontFamily: homeFonts.sansBold,
    fontSize: 15,
  },
  ctaButtonOutline: {
    borderWidth: 2,
    borderColor: homeColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: homeRadii.pill,
    minHeight: 44,
    justifyContent: 'center',
  },
  ctaButtonOutlineText: {
    color: homeColors.primary,
    fontFamily: homeFonts.sansBold,
    fontSize: 15,
  },
  partnerFeatureRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  partnerFeatureCard: {
    width: '100%',
    maxWidth: 360,
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: homeColors.surface,
    borderRadius: homeRadii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: homeColors.outline,
    ...shadowCard,
  },
  partnerFeatureBanner: {
    height: 100,
    backgroundColor: homeColors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerFeatureBannerLetter: {
    fontSize: 40,
    fontFamily: homeFonts.serifBold,
    color: homeColors.onPrimary,
  },
  partnerFeatureBody: { padding: 14 },
  partnerFeatureName: {
    fontSize: 18,
    fontFamily: homeFonts.sansBold,
    color: homeColors.onSurface,
    marginBottom: 6,
  },
  partnerFeatureDesc: {
    fontSize: 13,
    fontFamily: homeFonts.sans,
    color: homeColors.onSurfaceVariant,
    lineHeight: 19,
    marginBottom: 10,
  },
  partnerFeatureCta: {
    fontSize: 14,
    fontFamily: homeFonts.sansBold,
    color: homeColors.secondary,
  },
  partnerChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  partnerChip: {
    backgroundColor: homeColors.surface,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: homeColors.outline,
  },
  partnerChipText: {
    fontSize: 13,
    fontFamily: homeFonts.sansMedium,
    color: homeColors.primary,
  },
  bentoGrid: { gap: 12 },
  bentoTile: {
    backgroundColor: homeColors.surfaceContainer,
    borderRadius: homeRadii.md,
    padding: 18,
    borderWidth: 1,
    borderColor: homeColors.outline,
  },
  bentoTileIcon: {
    fontSize: 22,
    marginBottom: 10,
    color: homeColors.primary,
  },
  bentoTileHeading: {
    fontSize: 18,
    fontFamily: homeFonts.sansBold,
    color: homeColors.onSurface,
    marginBottom: 8,
  },
  bentoTileDesc: {
    fontSize: 13,
    fontFamily: homeFonts.sans,
    color: homeColors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: 12,
  },
  bentoTileLink: {
    fontSize: 14,
    fontFamily: homeFonts.sansBold,
    color: homeColors.primary,
  },
  bentoEventsTile: {
    backgroundColor: homeColors.secondary,
    borderRadius: homeRadii.md,
    padding: 18,
  },
  bentoEventsIcon: { fontSize: 22, marginBottom: 8 },
  bentoEventsHeading: { color: homeColors.onSecondary },
  bentoEventRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bentoEventDate: {
    width: 56,
    fontSize: 13,
    fontFamily: homeFonts.sansBold,
    color: '#e8e0ff',
  },
  bentoEventTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: homeFonts.sans,
    color: homeColors.onSecondary,
    lineHeight: 20,
  },
  bentoEventsEmpty: {
    fontSize: 14,
    fontFamily: homeFonts.sans,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 12,
  },
  bentoEventsCta: {
    marginTop: 8,
    backgroundColor: homeColors.onSecondary,
    paddingVertical: 12,
    borderRadius: homeRadii.pill,
    alignItems: 'center',
  },
  bentoEventsCtaText: {
    fontFamily: homeFonts.sansBold,
    fontSize: 14,
    color: homeColors.secondary,
  },
  bentoNewsTile: {
    backgroundColor: homeColors.surfaceContainer,
    borderRadius: homeRadii.md,
    padding: 18,
    borderWidth: 1,
    borderColor: homeColors.outline,
  },
  bentoNewsHeadline: {
    fontSize: 16,
    fontFamily: homeFonts.serifItalic,
    color: homeColors.onSurface,
    lineHeight: 24,
    marginBottom: 12,
  },
  bentoNewsFooter: { alignSelf: 'flex-start' },
  newsletterBand: {
    marginTop: 20,
    backgroundColor: homeColors.primaryContainer,
    borderRadius: homeRadii.md,
    padding: 20,
    overflow: 'hidden',
  },
  newsletterTitle: {
    fontSize: 24,
    fontFamily: homeFonts.serifBold,
    color: homeColors.onPrimary,
    marginBottom: 10,
  },
  newsletterBody: {
    fontSize: 15,
    fontFamily: homeFonts.sans,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 22,
    marginBottom: 16,
  },
  newsletterButton: {
    alignSelf: 'flex-start',
    backgroundColor: homeColors.secondary,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: homeRadii.pill,
  },
  newsletterButtonText: {
    fontFamily: homeFonts.sansBold,
    fontSize: 15,
    color: homeColors.onSecondary,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: {
    width: '48%',
    backgroundColor: homeColors.surface,
    borderRadius: homeRadii.md,
    padding: 16,
    borderWidth: 1,
    borderColor: homeColors.outline,
    ...shadowCard,
  },
  cardIcon: { fontSize: 24, marginBottom: 6 },
  cardTitle: {
    fontSize: 13,
    fontFamily: homeFonts.sansMedium,
    color: homeColors.primary,
  },
  regionCard: {
    backgroundColor: homeColors.surface,
    borderRadius: homeRadii.md,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: homeColors.outline,
  },
  regionType: {
    fontSize: 10,
    fontFamily: homeFonts.sansBold,
    color: homeColors.muted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  regionName: {
    fontSize: 17,
    fontFamily: homeFonts.sansBold,
    color: homeColors.onSurface,
  },
  newsItem: {
    backgroundColor: homeColors.surface,
    borderRadius: homeRadii.sm,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: homeColors.outline,
  },
  newsCategory: {
    fontSize: 10,
    fontFamily: homeFonts.sansBold,
    color: homeColors.muted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  newsTitle: {
    fontSize: 14,
    fontFamily: homeFonts.sansMedium,
    color: homeColors.onSurface,
    marginBottom: 2,
  },
  newsDate: { fontSize: 12, fontFamily: homeFonts.sans, color: homeColors.muted },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: homeColors.surface,
    borderRadius: homeRadii.sm,
    padding: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: homeColors.outline,
    gap: 12,
    alignItems: 'center',
  },
  dateBox: {
    width: 44,
    alignItems: 'center',
    backgroundColor: homeColors.primary,
    borderRadius: 6,
    paddingVertical: 5,
  },
  dateMonth: {
    fontSize: 9,
    fontFamily: homeFonts.sansBold,
    color: homeColors.accent,
    letterSpacing: 1,
  },
  dateDay: {
    fontSize: 18,
    fontFamily: homeFonts.sansBold,
    color: homeColors.onPrimary,
  },
  eventInfo: { flex: 1 },
  eventTitle: {
    fontSize: 14,
    fontFamily: homeFonts.sansMedium,
    color: homeColors.onSurface,
    marginBottom: 1,
  },
  eventMeta: { fontSize: 12, fontFamily: homeFonts.sans, color: homeColors.muted },
  partnerName: {
    fontSize: 16,
    fontFamily: homeFonts.sansBold,
    color: homeColors.onSurface,
    marginBottom: 4,
  },
  partnerDesc: {
    fontSize: 12,
    fontFamily: homeFonts.sans,
    color: homeColors.onSurfaceVariant,
    lineHeight: 18,
  },
  authBanner: {
    marginTop: 20,
    padding: 16,
    backgroundColor: homeColors.surfaceContainer,
    borderRadius: homeRadii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  authText: {
    flex: 1,
    fontSize: 13,
    fontFamily: homeFonts.sans,
    color: homeColors.onSurfaceVariant,
  },
  authButton: {
    backgroundColor: homeColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: homeRadii.sm,
  },
  authButtonText: {
    color: homeColors.onPrimary,
    fontFamily: homeFonts.sansBold,
    fontSize: 13,
  },
  loreCalloutTwilight: {
    backgroundColor: '#3d2b56',
    borderRadius: homeRadii.md,
    padding: 16,
    marginVertical: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#b45309',
  },
  loreCalloutLabel: {
    fontSize: 11,
    fontFamily: homeFonts.sansBold,
    color: '#ede7f6',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  loreCalloutBody: {
    fontSize: 15,
    fontFamily: homeFonts.serifItalic,
    color: '#ede7f6',
    lineHeight: 24,
  },
  loreCalloutAmber: {
    backgroundColor: homeColors.surface,
    borderRadius: homeRadii.md,
    padding: 16,
    marginVertical: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#b45309',
  },
  loreCalloutLabelAmber: {
    fontSize: 11,
    fontFamily: homeFonts.sansBold,
    color: '#b45309',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  loreCalloutBodyDark: {
    fontSize: 15,
    fontFamily: homeFonts.serifItalic,
    color: homeColors.onSurfaceVariant,
    lineHeight: 24,
  },
  loreTeaserCard: {
    backgroundColor: homeColors.surface,
    borderRadius: homeRadii.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: homeColors.outline,
  },
  loreTeaserKind: {
    fontSize: 10,
    fontFamily: homeFonts.sansBold,
    color: homeColors.secondary,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  loreTeaserTitle: {
    fontSize: 17,
    fontFamily: homeFonts.sansBold,
    color: homeColors.onSurface,
    marginBottom: 6,
  },
  loreTeaserBlurb: {
    fontSize: 14,
    fontFamily: homeFonts.sans,
    color: homeColors.onSurfaceVariant,
    lineHeight: 21,
    marginBottom: 8,
  },
  loreTeaserLink: {
    fontSize: 14,
    fontFamily: homeFonts.sansBold,
    color: homeColors.primary,
  },
  citationBlock: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: homeColors.outline,
  },
  citationTitle: {
    fontSize: 15,
    fontFamily: homeFonts.sansBold,
    color: homeColors.primary,
    marginBottom: 4,
  },
  citationNote: {
    fontSize: 13,
    fontFamily: homeFonts.sans,
    color: homeColors.muted,
    marginBottom: 4,
    lineHeight: 18,
  },
  citationUrl: { fontSize: 12, fontFamily: homeFonts.sans, color: homeColors.primary },
  emptyText: {
    fontSize: 15,
    fontFamily: homeFonts.sans,
    color: homeColors.muted,
    lineHeight: 22,
    marginBottom: 16,
  },
  fullWidthCta: {
    backgroundColor: homeColors.primary,
    paddingVertical: 14,
    borderRadius: homeRadii.sm,
    alignItems: 'center',
    marginTop: 8,
  },
  fullWidthCtaText: {
    color: homeColors.onPrimary,
    fontFamily: homeFonts.sansBold,
    fontSize: 15,
  },
});

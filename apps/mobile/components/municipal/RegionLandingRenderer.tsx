/**
 * Orchestrates a region landing page: fetches scoped news + upcoming events
 * and renders sections in the order defined by `section_order`, skipping
 * anything listed in `hidden_sections`. Mirrors the partner LandingPageRenderer.
 */
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { BentoGrid, type BentoItem } from '@/components/widgets/BentoGrid';
import { BentoSection } from '@/components/layout/BentoSection';
import { Container } from '@/components/layout/Container';
import {
  fetchRegionNews,
  fetchRegionUpcomingEvents,
  type RegionEventItem,
  type RegionLandingPage,
  type RegionNewsItem,
} from '@/lib/municipal/regionLanding';
import { RegionHeroSection } from './sections/RegionHeroSection';
import { RegionAboutSection } from './sections/RegionAboutSection';
import { RegionNewsSection } from './sections/RegionNewsSection';
import { RegionEventsSection } from './sections/RegionEventsSection';
import { RegionCustomSection } from './sections/RegionCustomSection';
import { RegionNewsletterSection } from './sections/RegionNewsletterSection';

interface RegionLandingRendererProps {
  page: RegionLandingPage;
  regionId: string;
  parentId?: string | null;
}

const DEFAULT_ORDER = [
  'hero',
  'quick_access',
  'about',
  'news',
  'events',
  'custom',
  'newsletter',
];

export function RegionLandingRenderer({
  page,
  regionId,
  parentId,
}: RegionLandingRendererProps) {
  const [news, setNews] = useState<RegionNewsItem[]>([]);
  const [events, setEvents] = useState<RegionEventItem[]>([]);

  const order = page.section_order?.length ? page.section_order : DEFAULT_ORDER;
  const hidden = new Set(page.hidden_sections ?? []);

  useEffect(() => {
    if (page.news_settings?.enabled !== false && !hidden.has('news')) {
      fetchRegionNews(regionId, {
        limit: page.news_settings?.auto_limit ?? 4,
        categorySlugs: page.news_settings?.category_slugs,
      }).then(setNews);
    }
    if (page.events_settings?.enabled !== false && !hidden.has('events')) {
      fetchRegionUpcomingEvents(regionId, {
        parentId,
        limit: page.events_settings?.auto_limit ?? 4,
        includeParent: page.events_settings?.include_parent_region ?? true,
        excludeParentCategories:
          page.events_settings?.exclude_parent_categories ?? ['government'],
      }).then(setEvents);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regionId, parentId]);

  function renderSection(key: string) {
    if (hidden.has(key)) return null;

    switch (key) {
      case 'hero':
        return (
          <RegionHeroSection
            key={key}
            eyebrow={page.hero_eyebrow}
            headline={page.hero_headline}
            headlineAccent={page.hero_headline_accent}
            subheadline={page.hero_subheadline}
            imageUrl={page.hero_image_url}
            primaryCta={
              page.hero_cta_primary_label && page.hero_cta_primary_url
                ? { label: page.hero_cta_primary_label, url: page.hero_cta_primary_url }
                : null
            }
            secondaryCta={
              page.hero_cta_secondary_label && page.hero_cta_secondary_url
                ? { label: page.hero_cta_secondary_label, url: page.hero_cta_secondary_url }
                : null
            }
          />
        );

      case 'quick_access':
        if (!page.quick_access?.length) return null;
        return (
          <Container key={key}>
            <BentoSection>
              <BentoGrid
                eyebrow={page.quick_access_title ? undefined : 'QUICK ACCESS'}
                title={page.quick_access_title || 'How can we help?'}
                subtitle={page.quick_access_subtitle || undefined}
                items={page.quick_access.map<BentoItem>((item) => ({
                  key: item.key,
                  icon: item.icon,
                  title: item.title,
                  description: item.description,
                  href: item.href as BentoItem['href'],
                  colorScheme: item.color_scheme,
                  span: 'half',
                }))}
              />
            </BentoSection>
          </Container>
        );

      case 'about':
        return (
          <RegionAboutSection
            key={key}
            title={page.about_title}
            body={page.about_body}
            imageUrl={page.about_image_url}
          />
        );

      case 'news':
        if (page.news_settings?.enabled === false) return null;
        return (
          <RegionNewsSection
            key={key}
            items={news}
            title={page.news_settings?.title}
            subtitle={page.news_settings?.subtitle}
            showViewAll={page.news_settings?.show_view_all ?? true}
          />
        );

      case 'events':
        if (page.events_settings?.enabled === false) return null;
        return (
          <RegionEventsSection
            key={key}
            items={events}
            title={page.events_settings?.title}
            subtitle={page.events_settings?.subtitle}
            showViewAll={page.events_settings?.show_view_all ?? true}
          />
        );

      case 'custom':
        if (!page.custom_sections?.length) return null;
        return (
          <View key={key}>
            {page.custom_sections.map((item, i) => (
              <RegionCustomSection key={`custom-${i}`} item={item} />
            ))}
          </View>
        );

      case 'newsletter':
        if (!page.newsletter?.enabled) return null;
        return (
          <RegionNewsletterSection
            key={key}
            settings={page.newsletter}
            regionId={regionId}
          />
        );

      default:
        return null;
    }
  }

  return <View>{order.map(renderSection)}</View>;
}

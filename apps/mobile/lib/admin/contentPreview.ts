/**
 * Maps admin content types to their public-facing URLs.
 * Used by admin edit pages to show "Preview on site" links.
 */

export interface PreviewLink {
  label: string;
  href: string;
}

/**
 * Generate a public-facing preview URL for a content record.
 * Returns null if the content type doesn't have a public page.
 */
export function getContentPreviewUrl(
  contentType: string,
  record: {
    slug?: string;
    region_slug?: string;
    county_slug?: string;
    partner_slug?: string;
    tab_slug?: string;
  },
): string | null {
  const { slug } = record;
  if (!slug) return null;

  switch (contentType) {
    case 'events':
      return `/home/events/${slug}`;
    case 'news':
      return `/home/news/${slug}`;
    case 'guides':
      return `/guides/${slug}`;
    case 'pages':
      return `/${slug}`;
    case 'minutes': {
      const county = record.county_slug ?? 'clare-county';
      const region = record.region_slug ?? 'lincoln-township';
      return `/government/${county}/${region}/minutes/${slug}`;
    }
    case 'ordinances': {
      const county = record.county_slug ?? 'clare-county';
      const region = record.region_slug ?? 'lincoln-township';
      return `/government/${county}/${region}/ordinances/${slug}`;
    }
    case 'contacts': {
      const county = record.county_slug ?? 'clare-county';
      const region = record.region_slug ?? 'lincoln-township';
      return `/government/${county}/${region}/contacts/${slug}`;
    }
    case 'elections': {
      const county = record.county_slug ?? 'clare-county';
      const region = record.region_slug ?? 'lincoln-township';
      return `/government/${county}/${region}/elections/${slug}`;
    }
    case 'partner_pages': {
      const partner = record.partner_slug;
      if (!partner) return null;
      return record.tab_slug
        ? `/partners/${partner}/${record.tab_slug}`
        : `/partners/${partner}`;
    }
    default:
      return null;
  }
}

/**
 * Orchestrates rendering of partner landing page sections based on
 * section_order and hidden_sections from the partner_landing_pages table.
 */
import { View } from 'react-native';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { ServicesGrid } from './ServicesGrid';
import { TeamSection } from './TeamSection';
import { TestimonialsSection } from './TestimonialsSection';
import { GallerySection } from './GallerySection';
import { ContactSection } from './ContactSection';
import { CustomSection } from './CustomSection';
import { BookingsSection } from './BookingsSection';
import { SubscriptionsSection } from './SubscriptionsSection';
import { useSquareFeatureConfig } from '@/hooks/useSquareBookings';

interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  website?: string;
}

interface LandingPageData {
  hero_headline?: string | null;
  hero_subheadline?: string | null;
  hero_image_url?: string | null;
  hero_cta_label?: string | null;
  hero_cta_url?: string | null;
  about_title?: string | null;
  about_body?: string | null;
  about_image_url?: string | null;
  services?: { title: string; description: string; icon?: string; image_url?: string; price?: string }[];
  team_members?: { name: string; role: string; image_url?: string; bio?: string }[];
  testimonials?: { quote: string; author: string; role?: string; image_url?: string }[];
  gallery_images?: { url: string; caption?: string }[];
  contact_phone?: string | null;
  contact_email?: string | null;
  contact_address?: string | null;
  contact_hours?: string | null;
  social_links?: SocialLinks | null;
  section_order?: string[];
  hidden_sections?: string[];
  custom_sections?: { title?: string; body?: string; image_url?: string }[];
}

interface LandingPageRendererProps {
  data: LandingPageData;
  partnerId?: string;
}

const DEFAULT_ORDER = [
  'hero',
  'about',
  'services',
  'subscriptions',
  'bookings',
  'team',
  'testimonials',
  'gallery',
  'contact',
];

export function LandingPageRenderer({ data, partnerId }: LandingPageRendererProps) {
  const order = data.section_order?.length ? data.section_order : DEFAULT_ORDER;
  const hidden = new Set(data.hidden_sections ?? []);
  const { config: squareConfig } = useSquareFeatureConfig(partnerId);

  function renderSection(key: string) {
    if (hidden.has(key)) return null;

    let inner: React.ReactNode = null;
    switch (key) {
      case 'hero':
        inner = (
          <HeroSection
            headline={data.hero_headline}
            subheadline={data.hero_subheadline}
            imageUrl={data.hero_image_url}
            ctaLabel={data.hero_cta_label}
            ctaUrl={data.hero_cta_url}
          />
        );
        break;
      case 'about':
        inner = (
          <AboutSection
            title={data.about_title}
            body={data.about_body}
            imageUrl={data.about_image_url}
          />
        );
        break;
      case 'services':
        inner = <ServicesGrid items={data.services ?? []} />;
        break;
      case 'team':
        inner = <TeamSection members={data.team_members ?? []} />;
        break;
      case 'testimonials':
        inner = <TestimonialsSection items={data.testimonials ?? []} />;
        break;
      case 'gallery':
        inner = <GallerySection images={data.gallery_images ?? []} />;
        break;
      case 'contact':
        inner = (
          <ContactSection
            phone={data.contact_phone}
            email={data.contact_email}
            address={data.contact_address}
            hours={data.contact_hours}
            socialLinks={data.social_links}
          />
        );
        break;
      case 'custom':
        inner = (
          <>
            {(data.custom_sections ?? []).map((section, i) => (
              <CustomSection
                key={`custom-${i}`}
                title={section.title}
                body={section.body}
                imageUrl={section.image_url}
              />
            ))}
          </>
        );
        break;
      case 'bookings':
        if (!partnerId || !squareConfig?.bookings_enabled) return null;
        inner = <BookingsSection partnerId={partnerId} />;
        break;
      case 'subscriptions':
        if (!partnerId || !squareConfig?.subscriptions_enabled) return null;
        inner = <SubscriptionsSection partnerId={partnerId} />;
        break;
      default:
        return null;
    }

    return (
      <View key={key} nativeID={`section-${key}`}>
        {inner}
      </View>
    );
  }

  return <View>{order.map(renderSection)}</View>;
}

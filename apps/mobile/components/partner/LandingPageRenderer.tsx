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

const DEFAULT_ORDER = ['hero', 'about', 'services', 'team', 'testimonials', 'gallery', 'contact'];

export function LandingPageRenderer({ data, partnerId }: LandingPageRendererProps) {
  const order = data.section_order?.length ? data.section_order : DEFAULT_ORDER;
  const hidden = new Set(data.hidden_sections ?? []);
  const { config: squareConfig } = useSquareFeatureConfig(partnerId);

  function renderSection(key: string) {
    if (hidden.has(key)) return null;

    switch (key) {
      case 'hero':
        return (
          <HeroSection
            key={key}
            headline={data.hero_headline}
            subheadline={data.hero_subheadline}
            imageUrl={data.hero_image_url}
            ctaLabel={data.hero_cta_label}
            ctaUrl={data.hero_cta_url}
          />
        );
      case 'about':
        return (
          <AboutSection
            key={key}
            title={data.about_title}
            body={data.about_body}
            imageUrl={data.about_image_url}
          />
        );
      case 'services':
        return <ServicesGrid key={key} items={data.services ?? []} />;
      case 'team':
        return <TeamSection key={key} members={data.team_members ?? []} />;
      case 'testimonials':
        return <TestimonialsSection key={key} items={data.testimonials ?? []} />;
      case 'gallery':
        return <GallerySection key={key} images={data.gallery_images ?? []} />;
      case 'contact':
        return (
          <ContactSection
            key={key}
            phone={data.contact_phone}
            email={data.contact_email}
            address={data.contact_address}
            hours={data.contact_hours}
            socialLinks={data.social_links}
          />
        );
      case 'custom':
        return (
          <View key={key}>
            {(data.custom_sections ?? []).map((section, i) => (
              <CustomSection
                key={`custom-${i}`}
                title={section.title}
                body={section.body}
                imageUrl={section.image_url}
              />
            ))}
          </View>
        );
      case 'bookings':
        if (!partnerId || !squareConfig?.bookings_enabled) return null;
        return <BookingsSection key={key} partnerId={partnerId} />;
      default:
        return null;
    }
  }

  return <View>{order.map(renderSection)}</View>;
}

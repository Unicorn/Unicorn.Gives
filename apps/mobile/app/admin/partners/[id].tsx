import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { supabase } from '@/lib/supabase';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { TextField, CheckboxField, FormRow, FormColumn } from '@/components/admin/AdminForm';
import { AdminImageUpload } from '@/components/admin/AdminImageUpload';
import { AdminRichEditor } from '@/components/admin/AdminRichEditor';
import { RepeatableListEditor } from '@/components/admin/RepeatableListEditor';
import { SquareTab } from '@/components/admin/SquareTab';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';
import { toHref } from '@/lib/navigation';

/* ── Types ── */

interface PartnerData {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  is_active: boolean;
  custom_domain: string | null;
}

interface LandingPageData {
  id: string | null;
  status: string;
  hero_headline: string;
  hero_subheadline: string;
  hero_image_url: string;
  hero_cta_label: string;
  hero_cta_url: string;
  about_title: string;
  about_body: string;
  about_image_url: string;
  services: ServiceItem[];
  team_members: TeamMember[];
  testimonials: TestimonialItem[];
  gallery_images: GalleryItem[];
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  contact_hours: string;
  social_links: SocialLinks;
  section_order: string[];
  hidden_sections: string[];
  custom_sections: CustomSection[];
}

interface ServiceItem { title: string; description: string; icon: string; image_url: string; price: string }
interface TeamMember { name: string; role: string; image_url: string; bio: string }
interface TestimonialItem { quote: string; author: string; role: string; image_url: string }
interface GalleryItem { url: string; caption: string }
interface CustomSection { title: string; body: string; image_url: string }
interface SocialLinks { facebook: string; instagram: string; twitter: string; website: string }

const EMPTY_LANDING: LandingPageData = {
  id: null,
  status: 'draft',
  hero_headline: '',
  hero_subheadline: '',
  hero_image_url: '',
  hero_cta_label: '',
  hero_cta_url: '',
  about_title: '',
  about_body: '',
  about_image_url: '',
  services: [],
  team_members: [],
  testimonials: [],
  gallery_images: [],
  contact_phone: '',
  contact_email: '',
  contact_address: '',
  contact_hours: '',
  social_links: { facebook: '', instagram: '', twitter: '', website: '' },
  section_order: ['hero', 'about', 'services', 'team', 'testimonials', 'gallery', 'contact'],
  hidden_sections: [],
  custom_sections: [],
};

const ALL_SECTIONS = [
  { key: 'hero', label: 'Hero' },
  { key: 'about', label: 'About' },
  { key: 'services', label: 'Services' },
  { key: 'subscriptions', label: 'Subscriptions' },
  { key: 'bookings', label: 'Bookings' },
  { key: 'team', label: 'Team' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'contact', label: 'Contact' },
  { key: 'custom', label: 'Custom Sections' },
];

type TabKey = 'general' | 'landing' | 'domain' | 'square';

/* ── Main Component ── */

export default function EditPartnerPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const partnerMutation = useAdminMutation('partners');
  const landingMutation = useAdminMutation('partner_landing_pages');

  const [partner, setPartner] = useState<PartnerData | null>(null);
  const [landing, setLanding] = useState<LandingPageData>({ ...EMPTY_LANDING });
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  // General form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [customDomain, setCustomDomain] = useState('');

  useEffect(() => {
    if (!id) return;
    loadPartner();
  }, [id]);

  async function loadPartner() {
    const { data: p } = await supabase
      .from('partners')
      .select('id, slug, name, description, logo_url, website, is_active, custom_domain')
      .eq('id', id)
      .single();

    if (!p) { setLoading(false); return; }

    setPartner(p as PartnerData);
    setName(p.name ?? '');
    setDescription(p.description ?? '');
    setWebsite(p.website ?? '');
    setLogoUrl(p.logo_url ?? '');
    setIsActive(p.is_active ?? true);
    setCustomDomain(p.custom_domain ?? '');

    // Load landing page
    const { data: lp } = await supabase
      .from('partner_landing_pages')
      .select('*')
      .eq('partner_id', p.id)
      .single();

    if (lp) {
      setLanding({
        id: lp.id,
        status: lp.status ?? 'draft',
        hero_headline: lp.hero_headline ?? '',
        hero_subheadline: lp.hero_subheadline ?? '',
        hero_image_url: lp.hero_image_url ?? '',
        hero_cta_label: lp.hero_cta_label ?? '',
        hero_cta_url: lp.hero_cta_url ?? '',
        about_title: lp.about_title ?? '',
        about_body: lp.about_body ?? '',
        about_image_url: lp.about_image_url ?? '',
        services: (lp.services as ServiceItem[]) ?? [],
        team_members: (lp.team_members as TeamMember[]) ?? [],
        testimonials: (lp.testimonials as TestimonialItem[]) ?? [],
        gallery_images: (lp.gallery_images as GalleryItem[]) ?? [],
        contact_phone: lp.contact_phone ?? '',
        contact_email: lp.contact_email ?? '',
        contact_address: lp.contact_address ?? '',
        contact_hours: lp.contact_hours ?? '',
        social_links: (lp.social_links as SocialLinks) ?? { facebook: '', instagram: '', twitter: '', website: '' },
        section_order: (lp.section_order as string[]) ?? EMPTY_LANDING.section_order,
        hidden_sections: (lp.hidden_sections as string[]) ?? [],
        custom_sections: (lp.custom_sections as CustomSection[]) ?? [],
      });
    }

    setLoading(false);
  }

  /* ── Save handlers ── */

  async function handleSaveGeneral() {
    if (!id) return;
    const success = await partnerMutation.update(id, {
      name: name.trim(),
      description: description || null,
      website: website || null,
      logo_url: logoUrl || null,
      is_active: isActive,
      custom_domain: customDomain.trim() || null,
    });
    if (success && Platform.OS === 'web') window.alert('Partner saved.');
  }

  async function handleSaveLanding() {
    if (!partner) return;

    const payload: Record<string, unknown> = {
      partner_id: partner.id,
      hero_headline: landing.hero_headline || null,
      hero_subheadline: landing.hero_subheadline || null,
      hero_image_url: landing.hero_image_url || null,
      hero_cta_label: landing.hero_cta_label || null,
      hero_cta_url: landing.hero_cta_url || null,
      about_title: landing.about_title || null,
      about_body: landing.about_body || null,
      about_image_url: landing.about_image_url || null,
      services: landing.services,
      team_members: landing.team_members,
      testimonials: landing.testimonials,
      gallery_images: landing.gallery_images,
      contact_phone: landing.contact_phone || null,
      contact_email: landing.contact_email || null,
      contact_address: landing.contact_address || null,
      contact_hours: landing.contact_hours || null,
      social_links: landing.social_links,
      section_order: landing.section_order,
      hidden_sections: landing.hidden_sections,
      custom_sections: landing.custom_sections,
    };

    if (landing.id) {
      const success = await landingMutation.update(landing.id, payload);
      if (success && Platform.OS === 'web') window.alert('Landing page saved.');
    } else {
      const result = await landingMutation.insert(payload);
      if (result) {
        setLanding((prev) => ({ ...prev, id: result.id }));
        if (Platform.OS === 'web') window.alert('Landing page created.');
      }
    }
  }

  async function handlePublishLanding() {
    if (!landing.id) return;
    const success = await landingMutation.publish(landing.id);
    if (success) setLanding((prev) => ({ ...prev, status: 'published' }));
  }

  async function handleUnpublishLanding() {
    if (!landing.id) return;
    const success = await landingMutation.unpublish(landing.id);
    if (success) setLanding((prev) => ({ ...prev, status: 'draft' }));
  }

  async function handleDelete() {
    if (!id) return;
    const success = await partnerMutation.remove(id);
    if (success) router.replace(toHref('/admin/partners'));
    setShowDelete(false);
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Loading partner...</Text>
      </View>
    );
  }

  if (!partner) {
    return (
      <AdminPageShell title="Partner Not Found" backHref="/admin/partners">
        <Text style={styles.loadingText}>This partner could not be found.</Text>
      </AdminPageShell>
    );
  }

  const tabs: { key: TabKey; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
    { key: 'general', label: 'General', icon: 'settings' },
    { key: 'landing', label: 'Landing Page', icon: 'web' },
    { key: 'domain', label: 'Domain Settings', icon: 'language' },
    { key: 'square', label: 'Square', icon: 'store' },
  ];

  return (
    <AdminPageShell
      title={name || 'Edit Partner'}
      backHref="/admin/partners"
      actions={
        <>
          {activeTab === 'landing' && landing.id && (
            <AdminStatusBadge status={landing.status} />
          )}
          {activeTab === 'landing' && landing.id && landing.status === 'draft' && (
            <AdminButton label="Publish" icon="publish" onPress={handlePublishLanding} disabled={landingMutation.loading} />
          )}
          {activeTab === 'landing' && landing.id && landing.status === 'published' && (
            <AdminButton label="Unpublish" variant="secondary" icon="unpublished" onPress={handleUnpublishLanding} disabled={landingMutation.loading} />
          )}
          {activeTab === 'general' && (
            <AdminButton label="Save" icon="save" onPress={handleSaveGeneral} disabled={partnerMutation.loading} />
          )}
          {activeTab === 'landing' && (
            <AdminButton label="Save" icon="save" onPress={handleSaveLanding} disabled={landingMutation.loading} />
          )}
          <AdminButton label="Delete" variant="danger" icon="delete" onPress={() => setShowDelete(true)} disabled={partnerMutation.loading} />
        </>
      }
    >
      {/* Tab bar */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <MaterialIcons name={tab.icon} size={16} color={activeTab === tab.key ? colors.primary : colors.neutralVariant} />
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Tab content */}
      {activeTab === 'general' && (
        <GeneralTab
          name={name} setName={setName}
          description={description} setDescription={setDescription}
          website={website} setWebsite={setWebsite}
          logoUrl={logoUrl} setLogoUrl={setLogoUrl}
          isActive={isActive} setIsActive={setIsActive}
          slug={partner.slug}
          colors={colors} styles={styles}
        />
      )}
      {activeTab === 'landing' && (
        <LandingTab
          landing={landing}
          setLanding={setLanding}
          colors={colors}
          styles={styles}
        />
      )}
      {activeTab === 'domain' && (
        <DomainTab
          customDomain={customDomain}
          setCustomDomain={setCustomDomain}
          partnerSlug={partner.slug}
          onSave={handleSaveGeneral}
          saving={partnerMutation.loading}
          colors={colors}
          styles={styles}
        />
      )}
      {activeTab === 'square' && (
        <SquareTab partnerId={partner.id} />
      )}

      <AdminConfirmDialog
        visible={showDelete}
        title="Delete Partner"
        message={`Are you sure you want to permanently delete "${name}"? This will also delete all associated pages and landing page data.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </AdminPageShell>
  );
}

/* ── General Tab ── */

function GeneralTab({
  name, setName,
  description, setDescription,
  website, setWebsite,
  logoUrl, setLogoUrl,
  isActive, setIsActive,
  slug,
  colors, styles,
}: {
  name: string; setName: (v: string) => void;
  description: string; setDescription: (v: string) => void;
  website: string; setWebsite: (v: string) => void;
  logoUrl: string; setLogoUrl: (v: string) => void;
  isActive: boolean; setIsActive: (v: boolean) => void;
  slug: string;
  colors: ThemeColors; styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.tabContent}>
      <TextField label="Name" value={name} onChangeText={setName} required />
      <View style={styles.slugDisplay}>
        <Text style={styles.slugLabel}>Slug</Text>
        <Text style={styles.slugValue}>{slug}</Text>
      </View>
      <TextField label="Description" value={description} onChangeText={setDescription} multiline numberOfLines={3} />
      <FormRow>
        <FormColumn><TextField label="Website" value={website} onChangeText={setWebsite} placeholder="https://..." /></FormColumn>
      </FormRow>
      <AdminImageUpload label="Logo" value={logoUrl} onChange={setLogoUrl} bucket="media" folder="partners" />
      <CheckboxField label="Active" value={isActive} onValueChange={setIsActive} hint="Inactive partners are hidden from public views" />
    </View>
  );
}

/* ── Landing Page Tab ── */

function LandingTab({
  landing,
  setLanding,
  colors,
  styles,
}: {
  landing: LandingPageData;
  setLanding: React.Dispatch<React.SetStateAction<LandingPageData>>;
  colors: ThemeColors;
  styles: ReturnType<typeof createStyles>;
}) {
  function update<K extends keyof LandingPageData>(key: K, value: LandingPageData[K]) {
    setLanding((prev) => ({ ...prev, [key]: value }));
  }

  function toggleSection(sectionKey: string) {
    setLanding((prev) => {
      const hidden = prev.hidden_sections.includes(sectionKey)
        ? prev.hidden_sections.filter((s) => s !== sectionKey)
        : [...prev.hidden_sections, sectionKey];
      return { ...prev, hidden_sections: hidden };
    });
  }

  function moveSectionOrder(index: number, direction: 'up' | 'down') {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= landing.section_order.length) return;
    setLanding((prev) => {
      const order = [...prev.section_order];
      [order[index], order[newIndex]] = [order[newIndex], order[index]];
      return { ...prev, section_order: order };
    });
  }

  return (
    <View style={styles.tabContent}>
      {/* Section Order & Visibility */}
      <View style={styles.sectionOrderCard}>
        <Text style={styles.sectionOrderTitle}>Section Order & Visibility</Text>
        <Text style={styles.sectionOrderHint}>Drag sections to reorder. Toggle visibility with the eye icon.</Text>
        {landing.section_order.map((key, index) => {
          const section = ALL_SECTIONS.find((s) => s.key === key);
          const hidden = landing.hidden_sections.includes(key);
          return (
            <View key={key} style={[styles.sectionOrderRow, hidden && styles.sectionOrderRowHidden]}>
              <View style={styles.sectionOrderLeft}>
                <Pressable onPress={() => moveSectionOrder(index, 'up')} disabled={index === 0}>
                  <MaterialIcons name="arrow-upward" size={16} color={index === 0 ? colors.outlineVariant : colors.neutralVariant} />
                </Pressable>
                <Pressable onPress={() => moveSectionOrder(index, 'down')} disabled={index === landing.section_order.length - 1}>
                  <MaterialIcons name="arrow-downward" size={16} color={index === landing.section_order.length - 1 ? colors.outlineVariant : colors.neutralVariant} />
                </Pressable>
                <Text style={[styles.sectionOrderLabel, hidden && styles.sectionOrderLabelHidden]}>
                  {section?.label ?? key}
                </Text>
              </View>
              <Pressable onPress={() => toggleSection(key)}>
                <MaterialIcons name={hidden ? 'visibility-off' : 'visibility'} size={18} color={hidden ? colors.outlineVariant : colors.primary} />
              </Pressable>
            </View>
          );
        })}
      </View>

      {/* Hero Section */}
      <SectionHeading label="Hero" />
      <TextField label="Headline" value={landing.hero_headline} onChangeText={(v) => update('hero_headline', v)} placeholder="Welcome to..." />
      <TextField label="Subheadline" value={landing.hero_subheadline} onChangeText={(v) => update('hero_subheadline', v)} multiline numberOfLines={2} />
      <AdminImageUpload label="Hero Image" value={landing.hero_image_url} onChange={(v) => update('hero_image_url', v)} bucket="media" folder="partners" />
      <FormRow>
        <FormColumn><TextField label="CTA Button Label" value={landing.hero_cta_label} onChangeText={(v) => update('hero_cta_label', v)} placeholder="Learn More" /></FormColumn>
        <FormColumn><TextField label="CTA Button URL" value={landing.hero_cta_url} onChangeText={(v) => update('hero_cta_url', v)} placeholder="https://..." /></FormColumn>
      </FormRow>

      {/* About Section */}
      <SectionHeading label="About" />
      <TextField label="Section Title" value={landing.about_title} onChangeText={(v) => update('about_title', v)} placeholder="About Us" />
      <AdminRichEditor label="About Body" value={landing.about_body} onChange={(v) => update('about_body', v)} />
      <AdminImageUpload label="About Image" value={landing.about_image_url} onChange={(v) => update('about_image_url', v)} bucket="media" folder="partners" />

      {/* Services */}
      <SectionHeading label="Services" />
      <RepeatableListEditor<ServiceItem>
        label="Services"
        items={landing.services}
        onChange={(v) => update('services', v)}
        fields={[]}
        createEmpty={() => ({ title: '', description: '', icon: '', image_url: '', price: '' })}
        renderItem={(item, _i, updateItem) => (
          <View style={{ gap: spacing.sm }}>
            <FormRow>
              <FormColumn><TextField label="Title" value={item.title} onChangeText={(v) => updateItem({ title: v })} /></FormColumn>
              <FormColumn><TextField label="Price" value={item.price} onChangeText={(v) => updateItem({ price: v })} placeholder="e.g. $30" /></FormColumn>
            </FormRow>
            <TextField label="Description" value={item.description} onChangeText={(v) => updateItem({ description: v })} multiline numberOfLines={2} />
            <TextField label="Icon Name" value={item.icon} onChangeText={(v) => updateItem({ icon: v })} placeholder="MaterialIcons name" hint="e.g. spa, cut, palette" />
          </View>
        )}
      />

      {/* Team */}
      <SectionHeading label="Team" />
      <RepeatableListEditor<TeamMember>
        label="Team Members"
        items={landing.team_members}
        onChange={(v) => update('team_members', v)}
        fields={[]}
        createEmpty={() => ({ name: '', role: '', image_url: '', bio: '' })}
        renderItem={(item, _i, updateItem) => (
          <View style={{ gap: spacing.sm }}>
            <FormRow>
              <FormColumn><TextField label="Name" value={item.name} onChangeText={(v) => updateItem({ name: v })} /></FormColumn>
              <FormColumn><TextField label="Role" value={item.role} onChangeText={(v) => updateItem({ role: v })} /></FormColumn>
            </FormRow>
            <TextField label="Bio" value={item.bio} onChangeText={(v) => updateItem({ bio: v })} multiline numberOfLines={2} />
            <AdminImageUpload label="Photo" value={item.image_url} onChange={(v) => updateItem({ image_url: v })} bucket="media" folder="partners/team" />
          </View>
        )}
      />

      {/* Testimonials */}
      <SectionHeading label="Testimonials" />
      <RepeatableListEditor<TestimonialItem>
        label="Testimonials"
        items={landing.testimonials}
        onChange={(v) => update('testimonials', v)}
        fields={[]}
        createEmpty={() => ({ quote: '', author: '', role: '', image_url: '' })}
        renderItem={(item, _i, updateItem) => (
          <View style={{ gap: spacing.sm }}>
            <TextField label="Quote" value={item.quote} onChangeText={(v) => updateItem({ quote: v })} multiline numberOfLines={3} />
            <FormRow>
              <FormColumn><TextField label="Author" value={item.author} onChangeText={(v) => updateItem({ author: v })} /></FormColumn>
              <FormColumn><TextField label="Role / Title" value={item.role} onChangeText={(v) => updateItem({ role: v })} /></FormColumn>
            </FormRow>
          </View>
        )}
      />

      {/* Gallery */}
      <SectionHeading label="Gallery" />
      <RepeatableListEditor<GalleryItem>
        label="Gallery Images"
        items={landing.gallery_images}
        onChange={(v) => update('gallery_images', v)}
        fields={[]}
        createEmpty={() => ({ url: '', caption: '' })}
        maxItems={12}
        renderItem={(item, _i, updateItem) => (
          <View style={{ gap: spacing.sm }}>
            <AdminImageUpload label="Image" value={item.url} onChange={(v) => updateItem({ url: v })} bucket="media" folder="partners/gallery" />
            <TextField label="Caption" value={item.caption} onChangeText={(v) => updateItem({ caption: v })} />
          </View>
        )}
      />

      {/* Contact */}
      <SectionHeading label="Contact" />
      <FormRow>
        <FormColumn><TextField label="Phone" value={landing.contact_phone} onChangeText={(v) => update('contact_phone', v)} /></FormColumn>
        <FormColumn><TextField label="Email" value={landing.contact_email} onChangeText={(v) => update('contact_email', v)} /></FormColumn>
      </FormRow>
      <TextField label="Address" value={landing.contact_address} onChangeText={(v) => update('contact_address', v)} multiline numberOfLines={2} />
      <TextField label="Hours" value={landing.contact_hours} onChangeText={(v) => update('contact_hours', v)} multiline numberOfLines={3} hint="Plain text or markdown" />
      <FormRow>
        <FormColumn><TextField label="Facebook" value={landing.social_links.facebook} onChangeText={(v) => update('social_links', { ...landing.social_links, facebook: v })} placeholder="https://facebook.com/..." /></FormColumn>
        <FormColumn><TextField label="Instagram" value={landing.social_links.instagram} onChangeText={(v) => update('social_links', { ...landing.social_links, instagram: v })} placeholder="https://instagram.com/..." /></FormColumn>
      </FormRow>
      <FormRow>
        <FormColumn><TextField label="Twitter / X" value={landing.social_links.twitter} onChangeText={(v) => update('social_links', { ...landing.social_links, twitter: v })} placeholder="https://x.com/..." /></FormColumn>
        <FormColumn><TextField label="Website" value={landing.social_links.website} onChangeText={(v) => update('social_links', { ...landing.social_links, website: v })} placeholder="https://..." /></FormColumn>
      </FormRow>

      {/* Custom Sections */}
      <SectionHeading label="Custom Sections" />
      <RepeatableListEditor<CustomSection>
        label="Custom Sections"
        items={landing.custom_sections}
        onChange={(v) => update('custom_sections', v)}
        fields={[]}
        createEmpty={() => ({ title: '', body: '', image_url: '' })}
        hint="Add custom markdown sections that appear in the 'custom' slot of section order"
        renderItem={(item, _i, updateItem) => (
          <View style={{ gap: spacing.sm }}>
            <TextField label="Section Title" value={item.title} onChangeText={(v) => updateItem({ title: v })} />
            <AdminRichEditor label="Content" value={item.body} onChange={(v) => updateItem({ body: v })} />
            <AdminImageUpload label="Image" value={item.image_url} onChange={(v) => updateItem({ image_url: v })} bucket="media" folder="partners" />
          </View>
        )}
      />
    </View>
  );
}

/* ── Domain Settings Tab ── */

function DomainTab({
  customDomain,
  setCustomDomain,
  partnerSlug,
  onSave,
  saving,
  colors,
  styles,
}: {
  customDomain: string;
  setCustomDomain: (v: string) => void;
  partnerSlug: string;
  onSave: () => void;
  saving: boolean;
  colors: ThemeColors;
  styles: ReturnType<typeof createStyles>;
}) {
  const targetUrl = `https://unicorn.gives/partners/${partnerSlug}`;

  return (
    <View style={styles.tabContent}>
      <TextField
        label="Custom Domain"
        value={customDomain}
        onChangeText={setCustomDomain}
        placeholder="e.g. mane.love"
        hint="The domain that should redirect to this partner's page"
      />

      <Pressable style={styles.domainSaveBtn} onPress={onSave} disabled={saving}>
        <Text style={styles.domainSaveBtnText}>{saving ? 'Saving...' : 'Save Domain'}</Text>
      </Pressable>

      <View style={styles.dnsCard}>
        <View style={styles.dnsHeader}>
          <MaterialIcons name="info" size={20} color={colors.primary} />
          <Text style={styles.dnsTitle}>DNS Setup Instructions</Text>
        </View>
        <Text style={styles.dnsBody}>
          Point your domain to this partner page by configuring a redirect with your domain registrar.
        </Text>

        <View style={styles.dnsStep}>
          <Text style={styles.dnsStepLabel}>Target URL</Text>
          <View style={styles.dnsCodeBox}>
            <Text style={styles.dnsCode}>{targetUrl}</Text>
          </View>
        </View>

        <View style={styles.dnsStep}>
          <Text style={styles.dnsStepLabel}>Option 1: URL Redirect (Recommended)</Text>
          <Text style={styles.dnsStepBody}>
            Set up a URL redirect or forwarding rule with your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) to redirect{' '}
            {customDomain || 'yourdomain.com'} to the target URL above.
          </Text>
        </View>

        <View style={styles.dnsStep}>
          <Text style={styles.dnsStepLabel}>Option 2: DNS + Redirect Service</Text>
          <Text style={styles.dnsStepBody}>
            If your registrar doesn't support URL redirects, use a service like Cloudflare Pages or redirect.pizza to create a 301 redirect from{' '}
            {customDomain || 'yourdomain.com'} to the target URL.
          </Text>
        </View>

        <View style={styles.dnsStep}>
          <Text style={styles.dnsStepLabel}>Verify</Text>
          <Text style={styles.dnsStepBody}>
            After configuring the redirect, visit {customDomain || 'yourdomain.com'} in your browser to confirm it redirects to the partner page.
          </Text>
        </View>
      </View>
    </View>
  );
}

/* ── Section heading helper ── */

function SectionHeading({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: colors.outlineVariant, marginTop: spacing.xl, marginBottom: spacing.md, paddingBottom: spacing.sm }}>
      <Text style={{ fontFamily: fonts.sansBold, fontSize: fontSize.lg, color: colors.neutral }}>{label}</Text>
    </View>
  );
}

/* ── Styles ── */

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { fontFamily: fonts.sans, fontSize: 14, color: colors.neutralVariant },

    /* Tabs */
    tabBar: {
      flexDirection: 'row',
      gap: 2,
      backgroundColor: colors.surfaceContainer,
      borderRadius: radii.sm,
      padding: 3,
      marginBottom: spacing.xl,
    },
    tab: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm + 2,
      borderRadius: radii.sm - 1,
    },
    tabActive: {
      backgroundColor: colors.surface,
    },
    tabText: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm + 1,
      color: colors.neutralVariant,
    },
    tabTextActive: {
      fontFamily: fonts.sansMedium,
      color: colors.primary,
    },

    /* Tab content */
    tabContent: {
      maxWidth: 800,
    },

    /* General tab */
    slugDisplay: { marginBottom: spacing.md },
    slugLabel: { fontFamily: fonts.sansMedium, fontSize: fontSize.sm + 1, color: colors.neutral, marginBottom: 4 },
    slugValue: { fontFamily: 'monospace', fontSize: fontSize.md, color: colors.neutralVariant, backgroundColor: colors.surfaceContainer, padding: spacing.sm + 2, borderRadius: radii.sm },

    /* Section order */
    sectionOrderCard: {
      backgroundColor: colors.surfaceContainer,
      borderRadius: radii.sm,
      padding: spacing.md,
      marginBottom: spacing.xl,
    },
    sectionOrderTitle: { fontFamily: fonts.sansBold, fontSize: fontSize.md, color: colors.neutral, marginBottom: 4 },
    sectionOrderHint: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant, marginBottom: spacing.md },
    sectionOrderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.xs + 2,
      paddingHorizontal: spacing.sm,
      borderRadius: radii.sm,
      marginBottom: 2,
    },
    sectionOrderRowHidden: { opacity: 0.5 },
    sectionOrderLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    sectionOrderLabel: { fontFamily: fonts.sansMedium, fontSize: fontSize.sm + 1, color: colors.neutral },
    sectionOrderLabelHidden: { textDecorationLine: 'line-through', color: colors.neutralVariant },

    /* Domain tab */
    domainSaveBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.sm + 2,
      borderRadius: radii.sm,
      alignSelf: 'flex-start',
      marginBottom: spacing.xl,
    },
    domainSaveBtnText: { fontFamily: fonts.sansMedium, fontSize: fontSize.sm + 1, color: colors.onPrimary },
    dnsCard: {
      backgroundColor: colors.surfaceContainer,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radii.md,
      padding: spacing.lg,
    },
    dnsHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
    dnsTitle: { fontFamily: fonts.sansBold, fontSize: fontSize.md, color: colors.neutral },
    dnsBody: { fontFamily: fonts.sans, fontSize: fontSize.md, color: colors.neutralVariant, marginBottom: spacing.lg, lineHeight: 22 },
    dnsStep: { marginBottom: spacing.lg },
    dnsStepLabel: { fontFamily: fonts.sansBold, fontSize: fontSize.sm + 1, color: colors.neutral, marginBottom: 6 },
    dnsStepBody: { fontFamily: fonts.sans, fontSize: fontSize.sm + 1, color: colors.neutralVariant, lineHeight: 20 },
    dnsCodeBox: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.sm,
      padding: spacing.md,
    },
    dnsCode: { fontFamily: 'monospace', fontSize: fontSize.md, color: colors.primary },
  });

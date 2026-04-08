/**
 * Region landing-page admin editor. Mirrors /admin/partners/[id].tsx but
 * for regions. Lets super admins and region editors build a published
 * landing page with hero, quick-access bento, about, news/events settings,
 * custom sections, and newsletter capture.
 */
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { supabase } from '@/lib/supabase';
import { useAdminMutation } from '@/hooks/useAdminMutation';
import { AdminButton, AdminPageShell } from '@/components/admin/AdminPageShell';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import {
  CheckboxField,
  FormColumn,
  FormRow,
  TextField,
} from '@/components/admin/AdminForm';
import { AdminImageUpload } from '@/components/admin/AdminImageUpload';
import { AdminRichEditor } from '@/components/admin/AdminRichEditor';
import { RepeatableListEditor } from '@/components/admin/RepeatableListEditor';
import {
  fonts,
  fontSize,
  radii,
  spacing,
  type ThemeColors,
  useTheme,
} from '@/constants/theme';
import { toHref } from '@/lib/navigation';

/* ─────────────── Types ─────────────── */

interface RegionData {
  id: string;
  slug: string;
  name: string;
  type: string;
  parent_id: string | null;
}

interface QuickAccessItem {
  key: string;
  icon: string;
  title: string;
  description: string;
  href: string;
  color_scheme: string;
}

interface CustomSection {
  type: 'markdown' | 'gallery' | 'quote' | 'cta';
  title: string;
  body: string;
  image_url: string;
  quote: string;
  author: string;
  cta_label: string;
  cta_url: string;
  // images editor omitted from form for brevity; stored as JSONB
  images: { url: string; caption: string }[];
}

interface NewsSettings {
  enabled: boolean;
  title: string;
  subtitle: string;
  auto_limit: number;
  show_view_all: boolean;
}

interface EventsSettings {
  enabled: boolean;
  title: string;
  subtitle: string;
  auto_limit: number;
  include_parent_region: boolean;
  exclude_parent_categories: string[];
  show_view_all: boolean;
}

interface NewsletterSettings {
  enabled: boolean;
  title: string;
  body: string;
  placeholder: string;
  submit_label: string;
}

interface LandingData {
  id: string | null;
  status: 'draft' | 'published' | 'archived';

  hero_eyebrow: string;
  hero_headline: string;
  hero_headline_accent: string;
  hero_subheadline: string;
  hero_image_url: string;
  hero_cta_primary_label: string;
  hero_cta_primary_url: string;
  hero_cta_secondary_label: string;
  hero_cta_secondary_url: string;

  about_title: string;
  about_body: string;
  about_image_url: string;

  quick_access: QuickAccessItem[];
  quick_access_title: string;
  quick_access_subtitle: string;

  news_settings: NewsSettings;
  events_settings: EventsSettings;

  custom_sections: CustomSection[];
  newsletter: NewsletterSettings;

  section_order: string[];
  hidden_sections: string[];
}

const DEFAULT_SECTION_ORDER = [
  'hero',
  'quick_access',
  'about',
  'news',
  'events',
  'custom',
  'newsletter',
];

const ALL_SECTIONS = [
  { key: 'hero', label: 'Hero' },
  { key: 'quick_access', label: 'Quick Access' },
  { key: 'about', label: 'About' },
  { key: 'news', label: 'News' },
  { key: 'events', label: 'Events' },
  { key: 'custom', label: 'Custom Sections' },
  { key: 'newsletter', label: 'Newsletter' },
];

const EMPTY_LANDING: LandingData = {
  id: null,
  status: 'draft',
  hero_eyebrow: '',
  hero_headline: '',
  hero_headline_accent: '',
  hero_subheadline: '',
  hero_image_url: '',
  hero_cta_primary_label: '',
  hero_cta_primary_url: '',
  hero_cta_secondary_label: '',
  hero_cta_secondary_url: '',
  about_title: '',
  about_body: '',
  about_image_url: '',
  quick_access: [],
  quick_access_title: '',
  quick_access_subtitle: '',
  news_settings: {
    enabled: true,
    title: '',
    subtitle: '',
    auto_limit: 4,
    show_view_all: true,
  },
  events_settings: {
    enabled: true,
    title: '',
    subtitle: '',
    auto_limit: 4,
    include_parent_region: true,
    exclude_parent_categories: ['government'],
    show_view_all: true,
  },
  custom_sections: [],
  newsletter: {
    enabled: false,
    title: 'Stay Connected',
    body: 'Sign up for community updates.',
    placeholder: 'Email address',
    submit_label: 'Subscribe',
  },
  section_order: DEFAULT_SECTION_ORDER,
  hidden_sections: [],
};

/* ─────────────── Component ─────────────── */

export default function EditRegionLandingPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const landingMutation = useAdminMutation('region_landing_pages');

  const [region, setRegion] = useState<RegionData | null>(null);
  const [landing, setLanding] = useState<LandingData>({ ...EMPTY_LANDING });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load() {
    const { data: r } = await supabase
      .from('regions')
      .select('id, slug, name, type, parent_id')
      .eq('id', id)
      .single();
    if (!r) {
      setLoading(false);
      return;
    }
    setRegion(r as RegionData);

    const { data: lp } = await supabase
      .from('region_landing_pages')
      .select('*')
      .eq('region_id', r.id)
      .maybeSingle();

    if (lp) {
      setLanding({
        id: lp.id,
        status: lp.status ?? 'draft',
        hero_eyebrow: lp.hero_eyebrow ?? '',
        hero_headline: lp.hero_headline ?? '',
        hero_headline_accent: lp.hero_headline_accent ?? '',
        hero_subheadline: lp.hero_subheadline ?? '',
        hero_image_url: lp.hero_image_url ?? '',
        hero_cta_primary_label: lp.hero_cta_primary_label ?? '',
        hero_cta_primary_url: lp.hero_cta_primary_url ?? '',
        hero_cta_secondary_label: lp.hero_cta_secondary_label ?? '',
        hero_cta_secondary_url: lp.hero_cta_secondary_url ?? '',
        about_title: lp.about_title ?? '',
        about_body: lp.about_body ?? '',
        about_image_url: lp.about_image_url ?? '',
        quick_access: (lp.quick_access as QuickAccessItem[]) ?? [],
        quick_access_title: lp.quick_access_title ?? '',
        quick_access_subtitle: lp.quick_access_subtitle ?? '',
        news_settings: { ...EMPTY_LANDING.news_settings, ...(lp.news_settings ?? {}) },
        events_settings: {
          ...EMPTY_LANDING.events_settings,
          ...(lp.events_settings ?? {}),
        },
        custom_sections: (lp.custom_sections as CustomSection[]) ?? [],
        newsletter: { ...EMPTY_LANDING.newsletter, ...(lp.newsletter ?? {}) },
        section_order: (lp.section_order as string[]) ?? DEFAULT_SECTION_ORDER,
        hidden_sections: (lp.hidden_sections as string[]) ?? [],
      });
    }

    setLoading(false);
  }

  function update<K extends keyof LandingData>(key: K, value: LandingData[K]) {
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

  function moveSection(index: number, direction: 'up' | 'down') {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= landing.section_order.length) return;
    setLanding((prev) => {
      const order = [...prev.section_order];
      [order[index], order[newIndex]] = [order[newIndex], order[index]];
      return { ...prev, section_order: order };
    });
  }

  async function handleSave() {
    if (!region) return;
    const payload: Record<string, unknown> = {
      region_id: region.id,
      hero_eyebrow: landing.hero_eyebrow || null,
      hero_headline: landing.hero_headline || null,
      hero_headline_accent: landing.hero_headline_accent || null,
      hero_subheadline: landing.hero_subheadline || null,
      hero_image_url: landing.hero_image_url || null,
      hero_cta_primary_label: landing.hero_cta_primary_label || null,
      hero_cta_primary_url: landing.hero_cta_primary_url || null,
      hero_cta_secondary_label: landing.hero_cta_secondary_label || null,
      hero_cta_secondary_url: landing.hero_cta_secondary_url || null,
      about_title: landing.about_title || null,
      about_body: landing.about_body || null,
      about_image_url: landing.about_image_url || null,
      quick_access: landing.quick_access,
      quick_access_title: landing.quick_access_title || null,
      quick_access_subtitle: landing.quick_access_subtitle || null,
      news_settings: landing.news_settings,
      events_settings: landing.events_settings,
      custom_sections: landing.custom_sections,
      newsletter: landing.newsletter,
      section_order: landing.section_order,
      hidden_sections: landing.hidden_sections,
    };

    if (landing.id) {
      const ok = await landingMutation.update(landing.id, payload);
      if (ok && Platform.OS === 'web') window.alert('Landing page saved.');
    } else {
      const result = await landingMutation.insert(payload);
      if (result) {
        setLanding((prev) => ({ ...prev, id: result.id }));
        if (Platform.OS === 'web') window.alert('Landing page created.');
      }
    }
  }

  async function handlePublish() {
    if (!landing.id) return;
    const ok = await landingMutation.publish(landing.id);
    if (ok) setLanding((prev) => ({ ...prev, status: 'published' }));
  }

  async function handleUnpublish() {
    if (!landing.id) return;
    const ok = await landingMutation.unpublish(landing.id);
    if (ok) setLanding((prev) => ({ ...prev, status: 'draft' }));
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!region) {
    return (
      <AdminPageShell title="Region Not Found" backHref="/admin/regions">
        <Text style={styles.hint}>This region could not be found.</Text>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell
      title={`${region.name} — Landing Page`}
      subtitle={`${region.type} · ${region.slug}`}
      backHref="/admin/regions"
      actions={
        <>
          {landing.id && <AdminStatusBadge status={landing.status} />}
          {landing.id && landing.status === 'draft' && (
            <AdminButton
              label="Publish"
              icon="publish"
              onPress={handlePublish}
              disabled={landingMutation.loading}
            />
          )}
          {landing.id && landing.status === 'published' && (
            <AdminButton
              label="Unpublish"
              variant="secondary"
              icon="unpublished"
              onPress={handleUnpublish}
              disabled={landingMutation.loading}
            />
          )}
          <AdminButton
            label="Save"
            icon="save"
            onPress={handleSave}
            disabled={landingMutation.loading}
          />
          <AdminButton
            label="Preview"
            variant="secondary"
            icon="open-in-new"
            onPress={() =>
              router.push(toHref(`/government/clare-county/${region.slug}`) as never)
            }
          />
        </>
      }
    >
      <View style={styles.tabContent}>
        {/* Section order */}
        <View style={styles.sectionOrderCard}>
          <Text style={styles.sectionOrderTitle}>Section Order & Visibility</Text>
          <Text style={styles.sectionOrderHint}>
            Reorder sections with the arrows. Toggle visibility with the eye icon.
          </Text>
          {landing.section_order.map((key, index) => {
            const section = ALL_SECTIONS.find((s) => s.key === key);
            const hidden = landing.hidden_sections.includes(key);
            return (
              <View
                key={key}
                style={[styles.sectionOrderRow, hidden && styles.sectionOrderRowHidden]}
              >
                <View style={styles.sectionOrderLeft}>
                  <Pressable onPress={() => moveSection(index, 'up')} disabled={index === 0}>
                    <MaterialIcons
                      name="arrow-upward"
                      size={16}
                      color={index === 0 ? colors.outlineVariant : colors.neutralVariant}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => moveSection(index, 'down')}
                    disabled={index === landing.section_order.length - 1}
                  >
                    <MaterialIcons
                      name="arrow-downward"
                      size={16}
                      color={
                        index === landing.section_order.length - 1
                          ? colors.outlineVariant
                          : colors.neutralVariant
                      }
                    />
                  </Pressable>
                  <Text
                    style={[
                      styles.sectionOrderLabel,
                      hidden && styles.sectionOrderLabelHidden,
                    ]}
                  >
                    {section?.label ?? key}
                  </Text>
                </View>
                <Pressable onPress={() => toggleSection(key)}>
                  <MaterialIcons
                    name={hidden ? 'visibility-off' : 'visibility'}
                    size={18}
                    color={hidden ? colors.outlineVariant : colors.primary}
                  />
                </Pressable>
              </View>
            );
          })}
        </View>

        {/* Hero */}
        <SectionHeading label="Hero" />
        <TextField
          label="Eyebrow"
          value={landing.hero_eyebrow}
          onChangeText={(v) => update('hero_eyebrow', v)}
          placeholder="Proudly Local"
        />
        <FormRow>
          <FormColumn>
            <TextField
              label="Headline"
              value={landing.hero_headline}
              onChangeText={(v) => update('hero_headline', v)}
              placeholder="Rooted in Heritage,"
            />
          </FormColumn>
          <FormColumn>
            <TextField
              label="Headline Accent (italic)"
              value={landing.hero_headline_accent}
              onChangeText={(v) => update('hero_headline_accent', v)}
              placeholder="Growing Together."
            />
          </FormColumn>
        </FormRow>
        <TextField
          label="Subheadline"
          value={landing.hero_subheadline}
          onChangeText={(v) => update('hero_subheadline', v)}
          multiline
          numberOfLines={2}
        />
        <AdminImageUpload
          label="Hero Image"
          value={landing.hero_image_url}
          onChange={(v) => update('hero_image_url', v)}
          bucket="media"
          folder="regions"
        />
        <FormRow>
          <FormColumn>
            <TextField
              label="Primary CTA Label"
              value={landing.hero_cta_primary_label}
              onChangeText={(v) => update('hero_cta_primary_label', v)}
              placeholder="Discover Our Parks"
            />
          </FormColumn>
          <FormColumn>
            <TextField
              label="Primary CTA URL"
              value={landing.hero_cta_primary_url}
              onChangeText={(v) => update('hero_cta_primary_url', v)}
              placeholder="/community/events"
            />
          </FormColumn>
        </FormRow>
        <FormRow>
          <FormColumn>
            <TextField
              label="Secondary CTA Label"
              value={landing.hero_cta_secondary_label}
              onChangeText={(v) => update('hero_cta_secondary_label', v)}
              placeholder="Resident Services"
            />
          </FormColumn>
          <FormColumn>
            <TextField
              label="Secondary CTA URL"
              value={landing.hero_cta_secondary_url}
              onChangeText={(v) => update('hero_cta_secondary_url', v)}
              placeholder="/government/..."
            />
          </FormColumn>
        </FormRow>

        {/* Quick Access */}
        <SectionHeading label="Quick Access" />
        <FormRow>
          <FormColumn>
            <TextField
              label="Title"
              value={landing.quick_access_title}
              onChangeText={(v) => update('quick_access_title', v)}
              placeholder="How can we help?"
            />
          </FormColumn>
          <FormColumn>
            <TextField
              label="Subtitle"
              value={landing.quick_access_subtitle}
              onChangeText={(v) => update('quick_access_subtitle', v)}
              placeholder="Quickly access common services"
            />
          </FormColumn>
        </FormRow>
        <RepeatableListEditor<QuickAccessItem>
          label="Quick Access Items"
          items={landing.quick_access}
          onChange={(v) => update('quick_access', v)}
          fields={[]}
          createEmpty={() => ({
            key: `qa-${Date.now()}`,
            icon: 'description',
            title: '',
            description: '',
            href: '',
            color_scheme: 'surface',
          })}
          renderItem={(item, _i, updateItem) => (
            <View style={{ gap: spacing.sm }}>
              <FormRow>
                <FormColumn>
                  <TextField
                    label="Title"
                    value={item.title}
                    onChangeText={(v) => updateItem({ title: v })}
                  />
                </FormColumn>
                <FormColumn>
                  <TextField
                    label="Icon (MaterialIcons name)"
                    value={item.icon}
                    onChangeText={(v) => updateItem({ icon: v })}
                    placeholder="description, gavel, contacts"
                  />
                </FormColumn>
              </FormRow>
              <TextField
                label="Description"
                value={item.description}
                onChangeText={(v) => updateItem({ description: v })}
              />
              <TextField
                label="Link URL"
                value={item.href}
                onChangeText={(v) => updateItem({ href: v })}
                placeholder="/government/..."
              />
            </View>
          )}
        />

        {/* About */}
        <SectionHeading label="About" />
        <TextField
          label="Section Title"
          value={landing.about_title}
          onChangeText={(v) => update('about_title', v)}
          placeholder="About our township"
        />
        <AdminRichEditor
          label="About Body"
          value={landing.about_body}
          onChange={(v) => update('about_body', v)}
        />
        <AdminImageUpload
          label="About Image"
          value={landing.about_image_url}
          onChange={(v) => update('about_image_url', v)}
          bucket="media"
          folder="regions"
        />

        {/* News settings */}
        <SectionHeading label="News Feed" />
        <CheckboxField
          label="Show news section"
          value={landing.news_settings.enabled}
          onValueChange={(v) =>
            update('news_settings', { ...landing.news_settings, enabled: v })
          }
        />
        <FormRow>
          <FormColumn>
            <TextField
              label="Title override"
              value={landing.news_settings.title}
              onChangeText={(v) =>
                update('news_settings', { ...landing.news_settings, title: v })
              }
              placeholder="News & Updates"
            />
          </FormColumn>
          <FormColumn>
            <TextField
              label="Auto limit"
              value={String(landing.news_settings.auto_limit)}
              onChangeText={(v) =>
                update('news_settings', {
                  ...landing.news_settings,
                  auto_limit: parseInt(v, 10) || 4,
                })
              }
              placeholder="4"
            />
          </FormColumn>
        </FormRow>
        <TextField
          label="Subtitle"
          value={landing.news_settings.subtitle}
          onChangeText={(v) =>
            update('news_settings', { ...landing.news_settings, subtitle: v })
          }
        />
        <CheckboxField
          label="Show 'View all' link"
          value={landing.news_settings.show_view_all}
          onValueChange={(v) =>
            update('news_settings', { ...landing.news_settings, show_view_all: v })
          }
        />

        {/* Events settings */}
        <SectionHeading label="Events Feed" />
        <CheckboxField
          label="Show events section"
          value={landing.events_settings.enabled}
          onValueChange={(v) =>
            update('events_settings', { ...landing.events_settings, enabled: v })
          }
        />
        <FormRow>
          <FormColumn>
            <TextField
              label="Title override"
              value={landing.events_settings.title}
              onChangeText={(v) =>
                update('events_settings', { ...landing.events_settings, title: v })
              }
              placeholder="Upcoming Events"
            />
          </FormColumn>
          <FormColumn>
            <TextField
              label="Auto limit"
              value={String(landing.events_settings.auto_limit)}
              onChangeText={(v) =>
                update('events_settings', {
                  ...landing.events_settings,
                  auto_limit: parseInt(v, 10) || 4,
                })
              }
              placeholder="4"
            />
          </FormColumn>
        </FormRow>
        <CheckboxField
          label="Roll up events from parent region"
          value={landing.events_settings.include_parent_region}
          onValueChange={(v) =>
            update('events_settings', {
              ...landing.events_settings,
              include_parent_region: v,
            })
          }
          hint="When enabled, events on the parent region (e.g. county) also appear — excluding the 'government' category so township visitors don't see county town-hall meetings."
        />
        <CheckboxField
          label="Show 'View all' link"
          value={landing.events_settings.show_view_all}
          onValueChange={(v) =>
            update('events_settings', { ...landing.events_settings, show_view_all: v })
          }
        />

        {/* Custom sections */}
        <SectionHeading label="Custom Sections" />
        <RepeatableListEditor<CustomSection>
          label="Custom Sections"
          items={landing.custom_sections}
          onChange={(v) => update('custom_sections', v)}
          fields={[]}
          createEmpty={() => ({
            type: 'markdown',
            title: '',
            body: '',
            image_url: '',
            quote: '',
            author: '',
            cta_label: '',
            cta_url: '',
            images: [],
          })}
          hint="Markdown text blocks, pull-quotes, or call-to-action cards rendered in the 'custom' section slot."
          renderItem={(item, _i, updateItem) => (
            <View style={{ gap: spacing.sm }}>
              <FormRow>
                <FormColumn>
                  <TextField
                    label="Type"
                    value={item.type}
                    onChangeText={(v) => updateItem({ type: v as CustomSection['type'] })}
                    hint="markdown, quote, or cta"
                  />
                </FormColumn>
                <FormColumn>
                  <TextField
                    label="Title"
                    value={item.title}
                    onChangeText={(v) => updateItem({ title: v })}
                  />
                </FormColumn>
              </FormRow>
              {(item.type === 'markdown' || item.type === 'cta') && (
                <TextField
                  label="Body"
                  value={item.body}
                  onChangeText={(v) => updateItem({ body: v })}
                  multiline
                  numberOfLines={4}
                />
              )}
              {item.type === 'markdown' && (
                <AdminImageUpload
                  label="Image"
                  value={item.image_url}
                  onChange={(v) => updateItem({ image_url: v })}
                  bucket="media"
                  folder="regions"
                />
              )}
              {item.type === 'quote' && (
                <>
                  <TextField
                    label="Quote"
                    value={item.quote}
                    onChangeText={(v) => updateItem({ quote: v })}
                    multiline
                    numberOfLines={3}
                  />
                  <TextField
                    label="Author"
                    value={item.author}
                    onChangeText={(v) => updateItem({ author: v })}
                  />
                </>
              )}
              {item.type === 'cta' && (
                <FormRow>
                  <FormColumn>
                    <TextField
                      label="Button Label"
                      value={item.cta_label}
                      onChangeText={(v) => updateItem({ cta_label: v })}
                    />
                  </FormColumn>
                  <FormColumn>
                    <TextField
                      label="Button URL"
                      value={item.cta_url}
                      onChangeText={(v) => updateItem({ cta_url: v })}
                    />
                  </FormColumn>
                </FormRow>
              )}
            </View>
          )}
        />

        {/* Newsletter */}
        <SectionHeading label="Newsletter" />
        <CheckboxField
          label="Show newsletter signup"
          value={landing.newsletter.enabled}
          onValueChange={(v) =>
            update('newsletter', { ...landing.newsletter, enabled: v })
          }
        />
        <FormRow>
          <FormColumn>
            <TextField
              label="Title"
              value={landing.newsletter.title}
              onChangeText={(v) =>
                update('newsletter', { ...landing.newsletter, title: v })
              }
            />
          </FormColumn>
          <FormColumn>
            <TextField
              label="Submit Label"
              value={landing.newsletter.submit_label}
              onChangeText={(v) =>
                update('newsletter', { ...landing.newsletter, submit_label: v })
              }
            />
          </FormColumn>
        </FormRow>
        <TextField
          label="Body"
          value={landing.newsletter.body}
          onChangeText={(v) =>
            update('newsletter', { ...landing.newsletter, body: v })
          }
          multiline
          numberOfLines={2}
        />
        <TextField
          label="Input Placeholder"
          value={landing.newsletter.placeholder}
          onChangeText={(v) =>
            update('newsletter', { ...landing.newsletter, placeholder: v })
          }
        />
      </View>
    </AdminPageShell>
  );
}

/* ─────────────── Helpers ─────────────── */

function SectionHeading({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: colors.outlineVariant,
        marginTop: spacing.xl,
        marginBottom: spacing.md,
        paddingBottom: spacing.sm,
      }}
    >
      <Text style={{ fontFamily: fonts.sansBold, fontSize: fontSize.lg, color: colors.neutral }}>
        {label}
      </Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 12,
    },
    hint: {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: colors.neutralVariant,
    },
    tabContent: {
      maxWidth: 800,
    },
    sectionOrderCard: {
      backgroundColor: colors.surfaceContainer,
      borderRadius: radii.sm,
      padding: spacing.md,
      marginBottom: spacing.xl,
    },
    sectionOrderTitle: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.md,
      color: colors.neutral,
      marginBottom: 4,
    },
    sectionOrderHint: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.neutralVariant,
      marginBottom: spacing.md,
    },
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
    sectionOrderLabel: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.sm + 1,
      color: colors.neutral,
    },
    sectionOrderLabelHidden: {
      textDecorationLine: 'line-through',
      color: colors.neutralVariant,
    },
  });

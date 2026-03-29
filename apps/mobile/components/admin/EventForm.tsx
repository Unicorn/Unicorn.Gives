import { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Pressable,
  Text,
  Image,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { supabase } from '@/lib/supabase';
import { resolveAbsoluteAssetUrl } from '@/lib/resolveAssetUrl';
import { useSlugGenerator } from '@/hooks/useSlugGenerator';
import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';
import {
  TextField,
  SelectField,
  DateField,
  CheckboxField,
  TagsField,
  SlugField,
  FormRow,
  FormColumn,
} from './AdminForm';
import { AdminRichEditor } from './AdminRichEditor';
import { EventAiBodyModal, EventAiCoverModal } from './EventAiModals';

/* ── Constants ── */

const EVENT_CATEGORIES = [
  { label: 'Government', value: 'government' },
  { label: 'Community', value: 'community' },
  { label: 'Conservation', value: 'conservation' },
  { label: 'Seniors', value: 'seniors' },
  { label: 'Horn', value: 'horn' },
  { label: 'Unicorn Gives', value: 'unicorn-gives' },
  { label: 'The Mane', value: 'the-mane' },
];

const VISIBILITY_OPTIONS = [
  { label: 'Global', value: 'global' },
  { label: 'Scoped (region/partner only)', value: 'scoped' },
  { label: 'Both', value: 'both' },
];

/* ── Types ── */

export interface EventFormData {
  title: string;
  slug: string;
  description: string;
  body: string;
  date: string;
  end_date: string;
  time: string;
  location: string;
  category: string;
  visibility: string;
  recurring: boolean;
  recurrence_rule: string;
  registration_url: string;
  cost: string;
  image_url: string;
  tags: string[];
  region_id: string;
  partner_id: string;
}

export const EMPTY_EVENT: EventFormData = {
  title: '',
  slug: '',
  description: '',
  body: '',
  date: '',
  end_date: '',
  time: '',
  location: '',
  category: 'community',
  visibility: 'global',
  recurring: false,
  recurrence_rule: '',
  registration_url: '',
  cost: '',
  image_url: '',
  tags: [],
  region_id: '',
  partner_id: '',
};

interface EventFormProps {
  data: EventFormData;
  onChange: (data: EventFormData) => void;
  errors?: Record<string, string>;
  /** When editing an existing row, passed for AI audit context */
  eventId?: string | null;
  /**
   * When set (edit event only), cover URL changes are saved to the row:
   * after AI generate, Remove cover, and when the Image URL field loses focus.
   */
  onPersistImageUrl?: (url: string | null) => Promise<boolean>;
}

export function EventForm({
  data,
  onChange,
  errors = {},
  eventId = null,
  onPersistImageUrl,
}: EventFormProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [bodyAiOpen, setBodyAiOpen] = useState(false);
  const [coverAiOpen, setCoverAiOpen] = useState(false);
  const [coverPersisting, setCoverPersisting] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);
  const [imagePersistError, setImagePersistError] = useState<string | null>(null);
  const { slug, setSlug, manuallyEdited, resetManual } = useSlugGenerator(data.title);

  // Sync slug back to parent (only for new records — don't overwrite DB slug)
  useEffect(() => {
    if (slug && !data.slug) {
      onChange({ ...data, slug });
    }
  }, [slug]);

  // Region/partner pickers
  const [regions, setRegions] = useState<{ label: string; value: string }[]>([]);
  const [partners, setPartners] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    supabase
      .from('regions')
      .select('id, name')
      .eq('is_active', true)
      .order('display_order')
      .then(({ data: r }) => {
        if (r) setRegions(r.map((x) => ({ label: x.name, value: x.id })));
      });

    supabase
      .from('partners')
      .select('id, name')
      .eq('is_active', true)
      .then(({ data: p }) => {
        if (p) setPartners(p.map((x) => ({ label: x.name, value: x.id })));
      });
  }, []);

  function set<K extends keyof EventFormData>(key: K, value: EventFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  const canAutoPersistCover = Boolean(onPersistImageUrl && eventId);
  const absolutePreview = useMemo(
    () => resolveAbsoluteAssetUrl(data.image_url),
    [data.image_url],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: only reset thumbnail error when cover URL changes
  useEffect(() => {
    setThumbFailed(false);
  }, [data.image_url]);

  async function persistCoverUrl(url: string | null) {
    if (!canAutoPersistCover || !onPersistImageUrl) return;
    setCoverPersisting(true);
    setImagePersistError(null);
    try {
      const ok = await onPersistImageUrl(url);
      if (!ok) setImagePersistError('Could not save cover to the server.');
    } finally {
      setCoverPersisting(false);
    }
  }

  async function handleImageUrlBlur() {
    if (!canAutoPersistCover) return;
    await persistCoverUrl(data.image_url.trim() || null);
  }

  async function handleRemoveCover() {
    setThumbFailed(false);
    onChange({ ...data, image_url: '' });
    if (canAutoPersistCover) {
      await persistCoverUrl(null);
    }
  }

  async function handleApplyCoverFromAi(url: string) {
    setThumbFailed(false);
    onChange({ ...data, image_url: url });
    if (canAutoPersistCover) {
      await persistCoverUrl(url);
    }
  }

  function openPreview() {
    if (absolutePreview) {
      void Linking.openURL(absolutePreview);
    }
  }

  return (
    <View style={styles.form}>
      {/* Title + Slug */}
      <TextField
        label="Title"
        value={data.title}
        onChangeText={(v) => set('title', v)}
        placeholder="Event title"
        required
        error={errors.title}
      />
      <SlugField
        slug={data.slug || slug}
        onSlugChange={(v) => {
          setSlug(v);
          set('slug', v);
        }}
        manuallyEdited={manuallyEdited}
        onReset={resetManual}
      />

      <TextField
        label="Description"
        value={data.description}
        onChangeText={(v) => set('description', v)}
        placeholder="Short description for cards and previews"
        multiline
        numberOfLines={2}
      />

      {/* Date, Time, Location row */}
      <FormRow>
        <FormColumn>
          <DateField
            label="Date"
            value={data.date}
            onChangeText={(v) => set('date', v)}
            required
            error={errors.date}
          />
        </FormColumn>
        <FormColumn>
          <DateField
            label="End Date"
            value={data.end_date}
            onChangeText={(v) => set('end_date', v)}
          />
        </FormColumn>
        <FormColumn>
          <TextField
            label="Time"
            value={data.time}
            onChangeText={(v) => set('time', v)}
            placeholder="e.g. 6:00 PM - 8:00 PM"
          />
        </FormColumn>
      </FormRow>

      <TextField
        label="Location"
        value={data.location}
        onChangeText={(v) => set('location', v)}
        placeholder="Event location or address"
      />

      {/* Category + Visibility */}
      <FormRow>
        <FormColumn>
          <SelectField
            label="Category"
            value={data.category}
            onValueChange={(v) => set('category', v)}
            options={EVENT_CATEGORIES}
            required
            error={errors.category}
          />
        </FormColumn>
        <FormColumn>
          <SelectField
            label="Visibility"
            value={data.visibility}
            onValueChange={(v) => set('visibility', v)}
            options={VISIBILITY_OPTIONS}
          />
        </FormColumn>
      </FormRow>

      {/* Region + Partner scoping */}
      <FormRow>
        <FormColumn>
          <SelectField
            label="Region"
            value={data.region_id}
            onValueChange={(v) => set('region_id', v)}
            options={regions}
            placeholder="None (global)"
          />
        </FormColumn>
        <FormColumn>
          <SelectField
            label="Partner"
            value={data.partner_id}
            onValueChange={(v) => set('partner_id', v)}
            options={partners}
            placeholder="None"
          />
        </FormColumn>
      </FormRow>

      {/* Recurring */}
      <CheckboxField
        label="Recurring event"
        value={data.recurring}
        onValueChange={(v) => set('recurring', v)}
        hint="Check if this event repeats on a schedule"
      />
      {data.recurring && (
        <TextField
          label="Recurrence Rule"
          value={data.recurrence_rule}
          onChangeText={(v) => set('recurrence_rule', v)}
          placeholder="e.g. Every 2nd Tuesday"
        />
      )}

      {/* Registration + Cost */}
      <FormRow>
        <FormColumn>
          <TextField
            label="Registration URL"
            value={data.registration_url}
            onChangeText={(v) => set('registration_url', v)}
            placeholder="https://..."
          />
        </FormColumn>
        <FormColumn>
          <TextField
            label="Cost"
            value={data.cost}
            onChangeText={(v) => set('cost', v)}
            placeholder="e.g. Free, $10, Donation"
          />
        </FormColumn>
      </FormRow>

      {/* Image */}
      <View style={styles.imageRow}>
        <View style={styles.imageFieldCol}>
          <TextField
            label="Image URL"
            value={data.image_url}
            onChangeText={(v) => set('image_url', v)}
            onBlur={() => void handleImageUrlBlur()}
            placeholder="https://... (cover image)"
          />
          <View style={styles.imageActionsRow}>
            {Platform.OS === 'web' && (
              <Pressable
                style={styles.aiTextLink}
                onPress={() => setCoverAiOpen(true)}
                accessibilityRole="button"
              >
                <MaterialIcons name="auto-awesome" size={16} color={colors.primary} />
                <Text style={styles.aiTextLinkLabel}>Generate cover with AI</Text>
              </Pressable>
            )}
            {coverPersisting && (
              <ActivityIndicator size="small" color={colors.primary} style={styles.coverSpinner} />
            )}
          </View>
          {imagePersistError && <Text style={styles.imagePersistError}>{imagePersistError}</Text>}
        </View>

        {absolutePreview ? (
          <View style={styles.imagePreviewCol}>
            {!thumbFailed ? (
              <Image
                source={{ uri: absolutePreview }}
                style={styles.coverThumb}
                resizeMode="cover"
                accessibilityLabel="Cover preview"
                onError={() => setThumbFailed(true)}
              />
            ) : (
              <View style={[styles.coverThumb, styles.coverThumbFallback]}>
                <MaterialIcons name="broken-image" size={28} color={colors.outlineVariant} />
              </View>
            )}
            <Pressable onPress={openPreview} accessibilityRole="link">
              <Text style={styles.previewLink}>Preview</Text>
            </Pressable>
            <Pressable onPress={() => void handleRemoveCover()} accessibilityRole="button">
              <Text style={styles.removeCoverLink}>Remove cover</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      {/* Tags */}
      <TagsField
        label="Tags"
        value={data.tags}
        onChange={(v) => set('tags', v)}
        hint="Press Enter to add a tag"
      />

      {/* Body / Rich text editor */}
      <AdminRichEditor
        label="Body Content"
        value={data.body}
        onChange={(v) => set('body', v)}
        placeholder="Write the full event details..."
        headerRight={
          Platform.OS === 'web' ? (
            <Pressable
              style={styles.aiHeaderBtn}
              onPress={() => setBodyAiOpen(true)}
              accessibilityRole="button"
            >
              <MaterialIcons name="auto-awesome" size={16} color={colors.primary} />
              <Text style={styles.aiHeaderBtnLabel}>Create with AI</Text>
            </Pressable>
          ) : undefined
        }
      />

      <EventAiBodyModal
        visible={bodyAiOpen}
        onClose={() => setBodyAiOpen(false)}
        formData={data}
        eventId={eventId}
        onApplyHtml={(html) => set('body', html)}
      />
      <EventAiCoverModal
        visible={coverAiOpen}
        onClose={() => setCoverAiOpen(false)}
        formData={data}
        eventId={eventId}
        onApplyImageUrl={(url) => void handleApplyCoverFromAi(url)}
      />
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    form: {
      gap: 0,
    },
    aiHeaderBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: radii.sm,
      borderWidth: 1,
      borderColor: colors.outline,
      backgroundColor: colors.surfaceContainer,
    },
    aiHeaderBtnLabel: {
      fontFamily: fonts.sansMedium,
      fontSize: 12,
      color: colors.primary,
    },
    imageRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.lg,
      alignItems: 'flex-start',
      marginBottom: spacing.md,
    },
    imageFieldCol: {
      flex: 1,
      minWidth: 0,
    },
    imageActionsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginTop: -spacing.sm,
      flexWrap: 'wrap',
    },
    coverSpinner: {
      marginBottom: spacing.sm,
    },
    imagePersistError: {
      fontFamily: fonts.sans,
      fontSize: 12,
      color: colors.error,
      marginTop: spacing.xs,
    },
    imagePreviewCol: {
      width: 96,
      paddingTop: 22,
      gap: spacing.sm,
    },
    coverThumb: {
      width: 88,
      height: 56,
      borderRadius: radii.sm,
      borderWidth: 1,
      borderColor: colors.outline,
      backgroundColor: colors.surfaceContainer,
    },
    coverThumbFallback: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewLink: {
      fontFamily: fonts.sansMedium,
      fontSize: 13,
      color: colors.primary,
    },
    removeCoverLink: {
      fontFamily: fonts.sansMedium,
      fontSize: 12,
      color: colors.neutralVariant,
    },
    aiTextLink: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: spacing.sm,
      alignSelf: 'flex-start',
    },
    aiTextLinkLabel: {
      fontFamily: fonts.sansMedium,
      fontSize: 13,
      color: colors.primary,
    },
  });

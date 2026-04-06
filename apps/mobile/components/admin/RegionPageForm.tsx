import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { supabase } from '@/lib/supabase';
import { useSlugGenerator } from '@/hooks/useSlugGenerator';
import { useStorageUpload } from '@/hooks/useStorageUpload';
import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';
import { TextField, SelectField, SlugField, FormRow, FormColumn } from './AdminForm';
import { AdminRichEditor } from './AdminRichEditor';

export interface RegionPageAttachment {
  label: string;
  url: string;
  mime_type: string;
  size_label: string;
}

export interface RegionPageFormData {
  title: string;
  slug: string;
  description: string;
  body: string;
  category: string;
  display_order: number;
  region_id: string;
  parent_slug: string;
  attachments: RegionPageAttachment[];
}

export const EMPTY_REGION_PAGE: RegionPageFormData = {
  title: '', slug: '', description: '', body: '', category: '', display_order: 0, region_id: '',
  parent_slug: '', attachments: [],
};

const PARENT_SLUG_OPTIONS = [
  { label: 'None (top-level)', value: '' },
  { label: 'Resources', value: 'resources' },
];

interface RegionPageFormProps {
  data: RegionPageFormData;
  onChange: (data: RegionPageFormData) => void;
  errors?: Record<string, string>;
}

export function RegionPageForm({ data, onChange, errors = {} }: RegionPageFormProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { slug, setSlug, manuallyEdited, resetManual } = useSlugGenerator(data.title);

  // biome-ignore lint/correctness/useExhaustiveDependencies: sync slug
  useEffect(() => { if (slug && !data.slug) onChange({ ...data, slug }); }, [slug]);

  const [regions, setRegions] = useState<{ label: string; value: string }[]>([]);
  useEffect(() => {
    supabase.from('regions').select('id, name').eq('is_active', true).order('display_order')
      .then(({ data: r }) => { if (r) setRegions(r.map((x) => ({ label: x.name, value: x.id }))); });
  }, []);

  function set<K extends keyof RegionPageFormData>(key: K, value: RegionPageFormData[K]) {
    const next = { ...data, [key]: value };
    // Auto-set category when parent_slug changes
    if (key === 'parent_slug' && value === 'resources') {
      next.category = 'resources';
    }
    onChange(next);
  }

  function updateAttachment(index: number, field: keyof RegionPageAttachment, value: string) {
    const updated = [...data.attachments];
    updated[index] = { ...updated[index], [field]: value };
    set('attachments', updated);
  }

  function removeAttachment(index: number) {
    set('attachments', data.attachments.filter((_, i) => i !== index));
  }

  function addAttachment(att: RegionPageAttachment) {
    set('attachments', [...data.attachments, att]);
  }

  return (
    <View style={styles.form}>
      <SelectField label="Region" value={data.region_id} onValueChange={(v) => set('region_id', v)} options={regions} required error={errors.region_id} placeholder="Select region..." />
      <TextField label="Title" value={data.title} onChangeText={(v) => set('title', v)} placeholder="Page title" required error={errors.title} />
      <SlugField slug={data.slug || slug} onSlugChange={(v) => { setSlug(v); set('slug', v); }} manuallyEdited={manuallyEdited} onReset={resetManual} />
      <TextField label="Description" value={data.description} onChangeText={(v) => set('description', v)} placeholder="Short description" multiline numberOfLines={2} />
      <FormRow>
        <FormColumn>
          <SelectField label="Parent Page" value={data.parent_slug} onValueChange={(v) => set('parent_slug', v)} options={PARENT_SLUG_OPTIONS} placeholder="None" />
        </FormColumn>
        <FormColumn>
          <TextField label="Category" value={data.category} onChangeText={(v) => set('category', v)} placeholder="e.g. resources, info" />
        </FormColumn>
      </FormRow>
      <FormRow>
        <FormColumn>
          <TextField label="Display Order" value={String(data.display_order)} onChangeText={(v) => set('display_order', parseInt(v, 10) || 0)} placeholder="0" />
        </FormColumn>
        <FormColumn />
      </FormRow>
      <AdminRichEditor label="Page Content" value={data.body} onChange={(v) => set('body', v)} placeholder="Write page content..." />

      {/* Attachments */}
      <View style={styles.attachmentsSection}>
        <Text style={[styles.sectionLabel, { color: colors.neutral }]}>Attachments</Text>

        {data.attachments.map((att, i) => (
          <View key={`${att.url}-${i}`} style={[styles.attachmentRow, { borderColor: colors.outline }]}>
            <View style={styles.attachmentFields}>
              <TextField
                label="Label"
                value={att.label}
                onChangeText={(v) => updateAttachment(i, 'label', v)}
                placeholder="e.g. Master Plan (PDF, 11.3 MB)"
              />
              <TextField
                label="URL"
                value={att.url}
                onChangeText={(v) => updateAttachment(i, 'url', v)}
                placeholder="https://..."
              />
              <FormRow>
                <FormColumn>
                  <TextField
                    label="MIME Type"
                    value={att.mime_type}
                    onChangeText={(v) => updateAttachment(i, 'mime_type', v)}
                    placeholder="application/pdf"
                  />
                </FormColumn>
                <FormColumn>
                  <TextField
                    label="Size Label"
                    value={att.size_label}
                    onChangeText={(v) => updateAttachment(i, 'size_label', v)}
                    placeholder="e.g. 11.3 MB"
                  />
                </FormColumn>
              </FormRow>
            </View>
            <Pressable style={styles.removeBtn} onPress={() => removeAttachment(i)}>
              <MaterialIcons name="delete" size={18} color={colors.error} />
            </Pressable>
          </View>
        ))}

        <View style={styles.attachmentActions}>
          <AttachmentUploadButton onUploaded={addAttachment} colors={colors} styles={styles} />
          <Pressable
            style={[styles.addManualBtn, { borderColor: colors.outline }]}
            onPress={() => addAttachment({ label: '', url: '', mime_type: 'application/pdf', size_label: '' })}
          >
            <MaterialIcons name="add-link" size={16} color={colors.neutralVariant} />
            <Text style={[styles.addManualText, { color: colors.neutralVariant }]}>Add URL manually</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/** Upload button that uploads a file then calls onUploaded with the attachment data. */
function AttachmentUploadButton({
  onUploaded,
  colors,
  styles,
}: {
  onUploaded: (att: RegionPageAttachment) => void;
  colors: ThemeColors;
  styles: ReturnType<typeof createStyles>;
}) {
  const { uploading, error, upload } = useStorageUpload('media');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    const result = await upload(file, { folder: 'documents' });
    if (result) {
      const sizeLabel = file.size >= 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;
      onUploaded({
        label: file.name,
        url: result.publicUrl,
        mime_type: file.type || 'application/octet-stream',
        size_label: sizeLabel,
      });
    }
  }, [upload, onUploaded]);

  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View>
      <Pressable
        style={[styles.uploadBtn, { borderColor: colors.primary }]}
        onPress={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <>
            <MaterialIcons name="upload-file" size={16} color={colors.primary} />
            <Text style={[styles.uploadBtnText, { color: colors.primary }]}>Upload file</Text>
          </>
        )}
      </Pressable>
      <input
        ref={fileInputRef as any}
        type="file"
        accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
        style={{ display: 'none' }}
        onChange={(e: any) => {
          const file = e.target?.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  form: { gap: 0 },
  attachmentsSection: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  sectionLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  attachmentRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: radii.sm,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  attachmentFields: {
    flex: 1,
    gap: 0,
  },
  removeBtn: {
    alignSelf: 'flex-start',
    padding: spacing.xs,
    marginTop: spacing.lg,
  },
  attachmentActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.sm,
    borderWidth: 1,
  },
  uploadBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
  },
  addManualBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.sm,
    borderWidth: 1,
  },
  addManualText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
  },
  errorText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    marginTop: 4,
  },
});

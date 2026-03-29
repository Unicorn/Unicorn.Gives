/**
 * Image upload field with drag-and-drop, file picker, URL input, and preview.
 * Web-only component — uses HTML5 drag/drop and File API.
 */
import { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, Image, TextInput, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useStorageUpload } from '@/hooks/useStorageUpload';
import { resolveAbsoluteAssetUrl } from '@/lib/resolveAssetUrl';
import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';

interface AdminImageUploadProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  /** Supabase storage bucket */
  bucket?: string;
  /** Folder path within the bucket */
  folder?: string;
  /** Accept filter for file picker */
  accept?: string;
  hint?: string;
}

export function AdminImageUpload({
  label = 'Image',
  value,
  onChange,
  bucket = 'media',
  folder = 'images',
  accept = 'image/png,image/jpeg,image/webp,image/gif',
  hint,
}: AdminImageUploadProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { uploading, error, upload } = useStorageUpload(bucket);
  const [dragOver, setDragOver] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [thumbError, setThumbError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewUrl = useMemo(() => resolveAbsoluteAssetUrl(value), [value]);

  const handleFile = useCallback(async (file: File) => {
    const result = await upload(file, { folder });
    if (result) {
      onChange(result.publicUrl);
    }
  }, [upload, folder, onChange]);

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.field}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
          style={styles.urlInput}
          value={value}
          onChangeText={onChange}
          placeholder="Image URL"
          placeholderTextColor={colors.outlineVariant}
        />
      </View>
    );
  }

  return (
    <View style={styles.field}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.uploadRow}>
        {/* Upload zone / Preview */}
        <View style={styles.uploadZoneWrapper}>
          {previewUrl && !thumbError ? (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: previewUrl }}
                style={styles.previewImage}
                resizeMode="cover"
                onError={() => setThumbError(true)}
              />
              <View style={styles.previewOverlay}>
                <Pressable
                  style={styles.previewAction}
                  onPress={() => { onChange(''); setThumbError(false); }}
                >
                  <MaterialIcons name="close" size={16} color="#fff" />
                  <Text style={styles.previewActionText}>Remove</Text>
                </Pressable>
                <Pressable
                  style={styles.previewAction}
                  onPress={() => fileInputRef.current?.click()}
                >
                  <MaterialIcons name="swap-horiz" size={16} color="#fff" />
                  <Text style={styles.previewActionText}>Replace</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
                border: `2px dashed ${dragOver ? colors.primary : colors.outline}`,
                borderRadius: 8,
                backgroundColor: dragOver ? colors.primaryContainer : colors.surfaceContainer,
                cursor: 'pointer',
                transition: 'all 0.2s',
                minHeight: 120,
              }}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e: any) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e: any) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer?.files?.[0];
                if (file && file.type.startsWith('image/')) {
                  handleFile(file);
                }
              }}
            >
              {uploading ? (
                <>
                  <ActivityIndicator color={colors.primary} />
                  <Text style={styles.dropText}>Uploading...</Text>
                </>
              ) : (
                <>
                  <MaterialIcons name="cloud-upload" size={28} color={dragOver ? colors.primary : colors.neutralVariant} />
                  <Text style={styles.dropText}>
                    Drop image here or click to browse
                  </Text>
                  <Text style={styles.dropHint}>PNG, JPEG, WebP, GIF · Max 20 MB</Text>
                </>
              )}
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef as any}
            type="file"
            accept={accept}
            style={{ display: 'none' }}
            onChange={(e: any) => {
              const file = e.target?.files?.[0];
              if (file) handleFile(file);
              e.target.value = '';
            }}
          />
        </View>

        {/* URL input toggle */}
        <View style={styles.urlSection}>
          <Pressable style={styles.urlToggle} onPress={() => setUrlMode(!urlMode)}>
            <MaterialIcons name="link" size={14} color={colors.neutralVariant} />
            <Text style={styles.urlToggleText}>{urlMode ? 'Hide URL field' : 'Use URL instead'}</Text>
          </Pressable>

          {urlMode && (
            <TextInput
              style={styles.urlInput}
              value={value}
              onChangeText={(v) => { onChange(v); setThumbError(false); }}
              placeholder="https://... or /images/..."
              placeholderTextColor={colors.outlineVariant}
            />
          )}
        </View>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
    </View>
  );
}

/**
 * Simpler file upload for PDFs and other documents.
 */
export function AdminFileUpload({
  label = 'File',
  value,
  onChange,
  bucket = 'media',
  folder = 'documents',
  accept = 'application/pdf',
  hint,
}: AdminImageUploadProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { uploading, error, upload } = useStorageUpload(bucket);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    const result = await upload(file, { folder });
    if (result) onChange(result.publicUrl);
  }, [upload, folder, onChange]);

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.field}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput style={styles.urlInput} value={value} onChangeText={onChange} placeholder="File URL" placeholderTextColor={colors.outlineVariant} />
      </View>
    );
  }

  return (
    <View style={styles.field}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.fileRow}>
        {value ? (
          <View style={styles.fileAttached}>
            <MaterialIcons name="insert-drive-file" size={20} color={colors.primary} />
            <Text style={styles.fileName} numberOfLines={1}>{value.split('/').pop()}</Text>
            <Pressable onPress={() => onChange('')}>
              <MaterialIcons name="close" size={16} color={colors.neutralVariant} />
            </Pressable>
          </View>
        ) : null}

        <View style={styles.fileActions}>
          <Pressable
            style={styles.fileUploadBtn}
            onPress={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <>
                <MaterialIcons name="upload-file" size={16} color={colors.primary} />
                <Text style={styles.fileUploadText}>{value ? 'Replace file' : 'Upload file'}</Text>
              </>
            )}
          </Pressable>

          <TextInput
            style={styles.urlInput}
            value={value}
            onChangeText={onChange}
            placeholder="Or paste URL..."
            placeholderTextColor={colors.outlineVariant}
          />
        </View>

        <input
          ref={fileInputRef as any}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={(e: any) => {
            const file = e.target?.files?.[0];
            if (file) handleFile(file);
            e.target.value = '';
          }}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  field: { marginBottom: spacing.md },
  label: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.neutral, marginBottom: 4 },
  uploadRow: { gap: spacing.sm },
  uploadZoneWrapper: {},
  dropText: { fontFamily: fonts.sansMedium, fontSize: 13, color: colors.neutralVariant, marginTop: 8 },
  dropHint: { fontFamily: fonts.sans, fontSize: 11, color: colors.outlineVariant, marginTop: 4 },
  previewContainer: { position: 'relative', borderRadius: radii.sm, overflow: 'hidden', borderWidth: 1, borderColor: colors.outlineVariant },
  previewImage: { width: '100%' as any, height: 160, backgroundColor: colors.surfaceContainer },
  previewOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: spacing.sm, padding: spacing.sm, backgroundColor: 'rgba(0,0,0,0.6)' },
  previewAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  previewActionText: { fontFamily: fonts.sansMedium, fontSize: 12, color: '#fff' },
  urlSection: { gap: 4 },
  urlToggle: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  urlToggleText: { fontFamily: fonts.sans, fontSize: 12, color: colors.neutralVariant },
  urlInput: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.outline, borderRadius: radii.sm, paddingHorizontal: spacing.md, paddingVertical: 8, fontFamily: fonts.sans, fontSize: 13, color: colors.neutral },
  errorText: { fontFamily: fonts.sans, fontSize: 12, color: colors.error, marginTop: 4 },
  hintText: { fontFamily: fonts.sans, fontSize: 12, color: colors.neutralVariant, marginTop: 4 },
  /* File upload */
  fileRow: { gap: spacing.sm },
  fileAttached: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.primaryContainer, borderRadius: radii.sm, padding: spacing.sm, paddingHorizontal: spacing.md },
  fileName: { flex: 1, fontFamily: fonts.sans, fontSize: 13, color: colors.primary },
  fileActions: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  fileUploadBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.primary },
  fileUploadText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.primary },
});

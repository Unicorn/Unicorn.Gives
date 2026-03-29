/**
 * Media Library — browse uploaded files across all storage buckets.
 * Allows uploading new files and copying URLs.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { supabase } from '@/lib/supabase';
import { useStorageUpload } from '@/hooks/useStorageUpload';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';

interface StorageFile {
  name: string;
  bucket: string;
  publicUrl: string;
  created_at: string;
  size: number;
  mimeType: string;
}

const BUCKETS = ['media', 'event-covers'];

export default function MediaLibraryPage() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBucket, setActiveBucket] = useState('media');
  const [deleteTarget, setDeleteTarget] = useState<StorageFile | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const { uploading, error: uploadError, upload } = useStorageUpload(activeBucket);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    const allFiles: StorageFile[] = [];

    for (const bucket of BUCKETS) {
      const { data, error } = await supabase.storage.from(bucket).list('', {
        limit: 200,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (!error && data) {
        // Also check subfolders
        const folders = data.filter((f) => !f.id);
        const topFiles = data.filter((f) => f.id);

        for (const f of topFiles) {
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(f.name);
          allFiles.push({
            name: f.name,
            bucket,
            publicUrl: urlData.publicUrl,
            created_at: f.created_at ?? '',
            size: f.metadata?.size ?? 0,
            mimeType: f.metadata?.mimetype ?? '',
          });
        }

        // List files in subfolders
        for (const folder of folders) {
          const { data: subFiles } = await supabase.storage.from(bucket).list(folder.name, {
            limit: 100,
            sortBy: { column: 'created_at', order: 'desc' },
          });
          if (subFiles) {
            for (const sf of subFiles.filter((f) => f.id)) {
              const path = `${folder.name}/${sf.name}`;
              const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
              allFiles.push({
                name: path,
                bucket,
                publicUrl: urlData.publicUrl,
                created_at: sf.created_at ?? '',
                size: sf.metadata?.size ?? 0,
                mimeType: sf.metadata?.mimetype ?? '',
              });
            }
          }
        }
      }
    }

    setFiles(allFiles.sort((a, b) => (b.created_at > a.created_at ? 1 : -1)));
    setLoading(false);
  }, []);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  async function handleUpload(file: File) {
    const folder = file.type.startsWith('image/') ? 'images' : 'documents';
    const result = await upload(file, { folder });
    if (result) loadFiles();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await supabase.storage.from(deleteTarget.bucket).remove([deleteTarget.name]);
    setDeleteTarget(null);
    loadFiles();
  }

  function copyUrl(url: string) {
    if (Platform.OS === 'web') {
      navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    }
  }

  function formatSize(bytes: number): string {
    if (bytes === 0) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  const filteredFiles = activeBucket === 'all'
    ? files
    : files.filter((f) => f.bucket === activeBucket);

  return (
    <AdminPageShell
      title="Media Library"
      subtitle={`${files.length} files across ${BUCKETS.length} buckets`}
      actions={
        <AdminButton label="Upload File" icon="cloud-upload" onPress={() => fileInputRef.current?.click()} disabled={uploading} />
      }
    >
      {/* Bucket filter tabs */}
      <View style={styles.bucketTabs}>
        {[{ label: 'All', value: 'all' }, ...BUCKETS.map((b) => ({ label: b, value: b }))].map((tab) => (
          <Pressable
            key={tab.value}
            style={[styles.bucketTab, activeBucket === tab.value && styles.bucketTabActive]}
            onPress={() => setActiveBucket(tab.value)}
          >
            <Text style={[styles.bucketTabText, activeBucket === tab.value && styles.bucketTabTextActive]}>
              {tab.label} ({tab.value === 'all' ? files.length : files.filter((f) => f.bucket === tab.value).length})
            </Text>
          </Pressable>
        ))}
      </View>

      {uploadError && <Text style={styles.errorText}>{uploadError}</Text>}

      {loading ? (
        <View style={styles.center}><ActivityIndicator color={colors.primary} /><Text style={styles.loadingText}>Loading files...</Text></View>
      ) : filteredFiles.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="folder-open" size={32} color={colors.outlineVariant} />
          <Text style={styles.emptyText}>No files uploaded yet</Text>
          <Text style={styles.emptyHint}>Upload images or PDFs using the button above</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {filteredFiles.map((file) => {
            const isImage = file.mimeType?.startsWith('image/');
            const isCopied = copied === file.publicUrl;

            return (
              <View key={`${file.bucket}/${file.name}`} style={styles.fileCard}>
                {/* Preview */}
                {isImage ? (
                  <Image source={{ uri: file.publicUrl }} style={styles.fileThumb} resizeMode="cover" />
                ) : (
                  <View style={[styles.fileThumb, styles.fileThumbFallback]}>
                    <MaterialIcons name="insert-drive-file" size={28} color={colors.neutralVariant} />
                    <Text style={styles.fileExt}>{file.name.split('.').pop()?.toUpperCase()}</Text>
                  </View>
                )}

                {/* Info */}
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>{file.name.split('/').pop()}</Text>
                  <Text style={styles.fileMeta}>
                    {formatSize(file.size)} · {file.bucket}
                  </Text>
                </View>

                {/* Actions */}
                <View style={styles.fileActions}>
                  <Pressable style={styles.fileAction} onPress={() => copyUrl(file.publicUrl)}>
                    <MaterialIcons name={isCopied ? 'check' : 'content-copy'} size={14} color={isCopied ? colors.primary : colors.neutralVariant} />
                  </Pressable>
                  <Pressable style={styles.fileAction} onPress={() => setDeleteTarget(file)}>
                    <MaterialIcons name="delete-outline" size={14} color={colors.error} />
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Hidden file input */}
      {Platform.OS === 'web' && (
        <input
          ref={fileInputRef as any}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"
          style={{ display: 'none' }}
          onChange={(e: any) => {
            const file = e.target?.files?.[0];
            if (file) handleUpload(file);
            e.target.value = '';
          }}
        />
      )}

      <AdminConfirmDialog
        visible={!!deleteTarget}
        title="Delete File"
        message={`Delete "${deleteTarget?.name.split('/').pop()}" from ${deleteTarget?.bucket}? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminPageShell>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  bucketTabs: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  bucketTab: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.outline },
  bucketTabActive: { backgroundColor: colors.neutral, borderColor: colors.neutral },
  bucketTabText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.neutralVariant },
  bucketTabTextActive: { color: colors.onNeutral },
  center: { alignItems: 'center', gap: 8, padding: spacing.xxxl },
  loadingText: { fontFamily: fonts.sans, fontSize: 14, color: colors.neutralVariant },
  emptyState: { backgroundColor: colors.surface, borderRadius: radii.md, borderWidth: 1, borderColor: colors.outlineVariant, padding: spacing.xxxl, alignItems: 'center', gap: 8 },
  emptyText: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.neutral },
  emptyHint: { fontFamily: fonts.sans, fontSize: 13, color: colors.neutralVariant },
  errorText: { fontFamily: fonts.sans, fontSize: 12, color: colors.error, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  fileCard: { backgroundColor: colors.surface, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.outlineVariant, overflow: 'hidden', width: 180 },
  fileThumb: { width: '100%' as any, height: 100, backgroundColor: colors.surfaceContainer },
  fileThumbFallback: { alignItems: 'center', justifyContent: 'center' },
  fileExt: { fontFamily: fonts.sansBold, fontSize: 10, color: colors.outlineVariant, marginTop: 4 },
  fileInfo: { padding: spacing.sm },
  fileName: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.neutral },
  fileMeta: { fontFamily: fonts.sans, fontSize: 11, color: colors.neutralVariant, marginTop: 2 },
  fileActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.outlineVariant },
  fileAction: { flex: 1, alignItems: 'center', paddingVertical: 6 },
});

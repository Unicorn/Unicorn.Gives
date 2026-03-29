import { useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface UploadResult {
  path: string;
  publicUrl: string;
}

export interface UseStorageUploadReturn {
  uploading: boolean;
  progress: number;
  error: string | null;
  upload: (file: File, options?: { folder?: string }) => Promise<UploadResult | null>;
  uploadFromUrl: (url: string, filename: string, options?: { folder?: string }) => Promise<UploadResult | null>;
}

/**
 * Upload files to a Supabase Storage bucket.
 * Web-only — uses File API.
 */
export function useStorageUpload(bucket: string = 'media'): UseStorageUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File, options?: { folder?: string }): Promise<UploadResult | null> => {
      setUploading(true);
      setProgress(0);
      setError(null);

      try {
        // Generate a unique path: folder/timestamp-filename
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const folder = options?.folder ?? 'uploads';
        const path = `${folder}/${timestamp}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) throw uploadError;

        setProgress(100);

        // Get public URL
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

        return {
          path,
          publicUrl: urlData.publicUrl,
        };
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Upload failed';
        setError(msg);
        return null;
      } finally {
        setUploading(false);
      }
    },
    [bucket],
  );

  const uploadFromUrl = useCallback(
    async (
      url: string,
      filename: string,
      options?: { folder?: string },
    ): Promise<UploadResult | null> => {
      setUploading(true);
      setError(null);

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
        const blob = await response.blob();
        const file = new File([blob], filename, { type: blob.type });
        return upload(file, options);
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Download failed';
        setError(msg);
        setUploading(false);
        return null;
      }
    },
    [upload],
  );

  return { uploading, progress, error, upload, uploadFromUrl };
}

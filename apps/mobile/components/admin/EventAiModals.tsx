import { useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';
import { invokeAdminAi, type EventAiContext } from '@/lib/adminAi';
import type { EventFormData } from './EventForm';

function buildContext(
  data: EventFormData,
  eventId: string | null | undefined,
  extra: { instructions?: string; style?: string; existing_body?: string },
): EventAiContext {
  return {
    event_id: eventId ?? undefined,
    title: data.title || undefined,
    description: data.description || undefined,
    date: data.date || undefined,
    end_date: data.end_date || undefined,
    time: data.time || undefined,
    location: data.location || undefined,
    category: data.category || undefined,
    instructions: extra.instructions?.trim() || undefined,
    style: extra.style?.trim() || undefined,
    existing_body: extra.existing_body,
  };
}

type Mode = 'replace' | 'append';

interface EventAiBodyModalProps {
  visible: boolean;
  onClose: () => void;
  formData: EventFormData;
  eventId?: string | null;
  onApplyHtml: (html: string) => void;
}

export function EventAiBodyModal({
  visible,
  onClose,
  formData,
  eventId,
  onApplyHtml,
}: EventAiBodyModalProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [instructions, setInstructions] = useState('');
  const [mode, setMode] = useState<Mode>('replace');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setInstructions('');
    setMode('replace');
    setError(null);
    setLoading(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleGenerate() {
    setError(null);
    setLoading(true);
    try {
      const ctx = buildContext(formData, eventId, {
        instructions,
        existing_body: mode === 'append' ? formData.body : undefined,
      });
      const { html } = await invokeAdminAi({
        action: 'event_body',
        context: ctx,
        mode,
      });
      if (!html) throw new Error('No HTML returned');
      const merged =
        mode === 'append' && formData.body.trim()
          ? `${formData.body.trimEnd()}\n${html.trim()}`
          : html;
      onApplyHtml(merged);
      handleClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
          <ScrollView
            style={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={Platform.OS !== 'web'}
          >
            <Text style={styles.title}>Create body with AI</Text>
            <Text style={styles.disclaimer}>
              AI can make mistakes. Review and edit before publishing.
            </Text>

            <Text style={styles.fieldLabel}>Instructions (optional)</Text>
            <TextInput
              style={styles.textArea}
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Tone, sections to include, audience, etc."
              placeholderTextColor={colors.outlineVariant}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.fieldLabel}>How to apply</Text>
            <View style={styles.modeRow}>
              <Pressable
                style={[styles.modeChip, mode === 'replace' && styles.modeChipActive]}
                onPress={() => setMode('replace')}
              >
                <Text
                  style={[styles.modeChipText, mode === 'replace' && styles.modeChipTextActive]}
                >
                  Replace
                </Text>
              </Pressable>
              <Pressable
                style={[styles.modeChip, mode === 'append' && styles.modeChipActive]}
                onPress={() => setMode('append')}
              >
                <Text style={[styles.modeChipText, mode === 'append' && styles.modeChipTextActive]}>
                  Append
                </Text>
              </Pressable>
            </View>

            {error && <Text style={styles.error}>{error}</Text>}

            <View style={styles.actions}>
              <Pressable style={styles.cancelBtn} onPress={handleClose} disabled={loading}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmBtn, loading && { opacity: 0.6 }]}
                onPress={handleGenerate}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.onPrimary} size="small" />
                ) : (
                  <>
                    <MaterialIcons name="auto-awesome" size={18} color={colors.onPrimary} />
                    <Text style={styles.confirmText}>Generate</Text>
                  </>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

interface EventAiCoverModalProps {
  visible: boolean;
  onClose: () => void;
  formData: EventFormData;
  eventId?: string | null;
  onApplyImageUrl: (url: string) => void;
}

export function EventAiCoverModal({
  visible,
  onClose,
  formData,
  eventId,
  onApplyImageUrl,
}: EventAiCoverModalProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [styleHint, setStyleHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setStyleHint('');
    setError(null);
    setLoading(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleGenerate() {
    setError(null);
    setLoading(true);
    try {
      const ctx = buildContext(formData, eventId, { style: styleHint });
      const { imageUrl } = await invokeAdminAi({
        action: 'event_cover',
        context: ctx,
      });
      if (!imageUrl) throw new Error('No image URL returned');
      onApplyImageUrl(imageUrl);
      handleClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
          <ScrollView
            style={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={Platform.OS !== 'web'}
          >
            <Text style={styles.title}>Generate cover image</Text>
            <Text style={styles.disclaimer}>
              Uses your event fields as context. Covers are generated with Gemini (or OpenAI if
              configured) and stored in Supabase. Review before publishing.
            </Text>

            <Text style={styles.fieldLabel}>Style hints (optional)</Text>
            <TextInput
              style={styles.textArea}
              value={styleHint}
              onChangeText={setStyleHint}
              placeholder="e.g. outdoor festival, winter evening, family-friendly"
              placeholderTextColor={colors.outlineVariant}
              multiline
              numberOfLines={2}
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <View style={styles.actions}>
              <Pressable style={styles.cancelBtn} onPress={handleClose} disabled={loading}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmBtn, loading && { opacity: 0.6 }]}
                onPress={handleGenerate}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.onPrimary} size="small" />
                ) : (
                  <>
                    <MaterialIcons name="image" size={18} color={colors.onPrimary} />
                    <Text style={styles.confirmText}>Generate</Text>
                  </>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    dialog: {
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      maxWidth: 440,
      width: '100%',
      maxHeight: '85%',
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    scroll: {
      padding: spacing.xxl,
    },
    title: {
      fontFamily: fonts.sansBold,
      fontSize: 18,
      color: colors.neutral,
      marginBottom: spacing.sm,
    },
    disclaimer: {
      fontFamily: fonts.sans,
      fontSize: 12,
      color: colors.neutralVariant,
      lineHeight: 17,
      marginBottom: spacing.lg,
    },
    fieldLabel: {
      fontFamily: fonts.sansMedium,
      fontSize: 13,
      color: colors.neutral,
      marginBottom: spacing.xs,
    },
    textArea: {
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.sm,
      padding: spacing.md,
      fontFamily: fonts.sans,
      fontSize: 14,
      color: colors.neutral,
      minHeight: 72,
      textAlignVertical: 'top',
      marginBottom: spacing.lg,
    },
    modeRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    modeChip: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      borderRadius: radii.sm,
      borderWidth: 1,
      borderColor: colors.outline,
      backgroundColor: colors.surfaceContainer,
    },
    modeChipActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryContainer,
    },
    modeChipText: {
      fontFamily: fonts.sansMedium,
      fontSize: 14,
      color: colors.neutral,
    },
    modeChipTextActive: {
      color: colors.primary,
    },
    error: {
      fontFamily: fonts.sans,
      fontSize: 13,
      color: colors.error,
      marginBottom: spacing.md,
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    cancelBtn: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: radii.sm,
      backgroundColor: colors.surfaceContainer,
      alignItems: 'center',
    },
    cancelText: {
      fontFamily: fonts.sansMedium,
      fontSize: 14,
      color: colors.neutral,
    },
    confirmBtn: {
      flex: 1,
      flexDirection: 'row',
      gap: 8,
      paddingVertical: 12,
      borderRadius: radii.sm,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    confirmText: {
      fontFamily: fonts.sansMedium,
      fontSize: 14,
      color: colors.onPrimary,
    },
  });

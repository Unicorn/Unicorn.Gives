/**
 * Simple email capture block. Writes to the `newsletter_subscribers` table
 * via `subscribeToNewsletter()`. No provider wiring yet — provider
 * integration (Mailchimp/Beehiiv/etc.) can read from this table later.
 */
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import {
  breakpoints,
  fonts,
  fontSize,
  radii,
  spacing,
  useTheme,
} from '@/constants/theme';
import { useHydratedDimensions } from '@/hooks/useHydrated';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { subscribeToNewsletter, type NewsletterSettings } from '@/lib/municipal/regionLanding';

interface RegionNewsletterSectionProps {
  settings: NewsletterSettings;
  regionId: string;
}

export function RegionNewsletterSection({ settings, regionId }: RegionNewsletterSectionProps) {
  const { colors } = useTheme();
  const { width } = useHydratedDimensions();
  const isTablet = width >= breakpoints.tablet;

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit() {
    if (status === 'loading') return;
    setStatus('loading');
    const result = await subscribeToNewsletter(email, regionId);
    if (result.ok) {
      setStatus('success');
      setMessage('Thanks! You\u2019re on the list.');
      setEmail('');
    } else {
      setStatus('error');
      setMessage(result.error);
    }
  }

  if (!settings.enabled) return null;

  return (
    <View style={styles.section}>
      <View
        style={[
          styles.card,
          { backgroundColor: colors.heroBar },
          isTablet && styles.cardTablet,
        ]}
      >
        <View style={[styles.text, isTablet && styles.textTablet]}>
          <Text style={[styles.title, { color: colors.onHeroBar }]}>
            {settings.title || 'Stay Connected'}
          </Text>
          {settings.body ? (
            <Text style={[styles.body, { color: colors.onHeroBar }]}>
              {settings.body}
            </Text>
          ) : null}
        </View>

        <View style={[styles.form, isTablet && styles.formTablet]}>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: '#fff', color: colors.neutral },
            ]}
            value={email}
            onChangeText={setEmail}
            placeholder={settings.placeholder || 'Email address'}
            placeholderTextColor={colors.neutralVariant}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AnimatedPressable
            variant="button"
            onPress={handleSubmit}
            style={StyleSheet.flatten([
              styles.submit,
              { backgroundColor: colors.primary },
            ])}
          >
            <Text style={[styles.submitText, { color: colors.onPrimary }]}>
              {status === 'loading' ? '\u2026' : settings.submit_label || 'Subscribe'}
            </Text>
          </AnimatedPressable>
        </View>

        {message ? (
          <Text
            style={[
              styles.message,
              { color: status === 'error' ? '#ffb4b4' : colors.onHeroBar },
            ]}
          >
            {message}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
  },
  card: {
    maxWidth: 1000,
    width: '100%',
    alignSelf: 'center',
    borderRadius: radii.lg,
    padding: spacing.xxxl,
    gap: spacing.lg,
  },
  cardTablet: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xxxl + spacing.md,
    gap: spacing.xxxl,
  },
  text: {
    gap: spacing.sm,
  },
  textTablet: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.serifBold,
    fontSize: 28,
    lineHeight: 34,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: fontSize.base,
    lineHeight: 22,
    opacity: 0.85,
  },
  form: {
    gap: spacing.sm,
  },
  formTablet: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: 260,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
  },
  submit: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md + 2,
    borderRadius: radii.sm,
    alignItems: 'center',
  },
  submitText: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.md,
  },
  message: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
});

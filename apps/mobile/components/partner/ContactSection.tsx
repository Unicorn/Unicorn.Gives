import { useMemo } from 'react';
import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';

interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  website?: string;
}

interface ContactSectionProps {
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  hours?: string | null;
  socialLinks?: SocialLinks | null;
}

export function ContactSection({ phone, email, address, hours, socialLinks }: ContactSectionProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const hasContact = phone || email || address;
  const hasSocial = socialLinks && Object.values(socialLinks).some(Boolean);
  if (!hasContact && !hours && !hasSocial) return null;

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.heading}>Contact</Text>
        <View style={styles.grid}>
          {/* Contact info */}
          {hasContact && (
            <View style={styles.card}>
              {phone && (
                <Pressable style={styles.contactRow} onPress={() => Linking.openURL(`tel:${phone}`)}>
                  <MaterialIcons name="phone" size={18} color={colors.primary} />
                  <Text style={styles.contactText}>{phone}</Text>
                </Pressable>
              )}
              {email && (
                <Pressable style={styles.contactRow} onPress={() => Linking.openURL(`mailto:${email}`)}>
                  <MaterialIcons name="email" size={18} color={colors.primary} />
                  <Text style={styles.contactText}>{email}</Text>
                </Pressable>
              )}
              {address && (
                <View style={styles.contactRow}>
                  <MaterialIcons name="place" size={18} color={colors.primary} />
                  <Text style={styles.contactText}>{address}</Text>
                </View>
              )}
            </View>
          )}

          {/* Hours */}
          {hours && (
            <View style={styles.card}>
              <View style={styles.hoursHeader}>
                <MaterialIcons name="schedule" size={18} color={colors.primary} />
                <Text style={styles.hoursTitle}>Hours</Text>
              </View>
              <MarkdownRenderer content={hours} />
            </View>
          )}
        </View>

        {/* Social links */}
        {hasSocial && (
          <View style={styles.socialRow}>
            {socialLinks?.facebook && (
              <Pressable style={styles.socialBtn} onPress={() => Linking.openURL(socialLinks.facebook!)}>
                <MaterialIcons name="facebook" size={22} color={colors.neutral} />
              </Pressable>
            )}
            {socialLinks?.instagram && (
              <Pressable style={styles.socialBtn} onPress={() => Linking.openURL(socialLinks.instagram!)}>
                <MaterialIcons name="camera-alt" size={22} color={colors.neutral} />
              </Pressable>
            )}
            {socialLinks?.twitter && (
              <Pressable style={styles.socialBtn} onPress={() => Linking.openURL(socialLinks.twitter!)}>
                <MaterialIcons name="alternate-email" size={22} color={colors.neutral} />
              </Pressable>
            )}
            {socialLinks?.website && (
              <Pressable style={styles.socialBtn} onPress={() => Linking.openURL(socialLinks.website!)}>
                <MaterialIcons name="language" size={22} color={colors.neutral} />
              </Pressable>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxl,
      backgroundColor: colors.surfaceContainer,
    },
    inner: {
      maxWidth: 900,
      alignSelf: 'center',
      width: '100%' as any,
    },
    heading: {
      fontFamily: fonts.sansBold,
      fontSize: 28,
      color: colors.neutral,
      marginBottom: spacing.xl,
      textAlign: 'center',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.lg,
      justifyContent: 'center',
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radii.md,
      padding: spacing.xl,
      flex: 1,
      minWidth: 260,
      gap: spacing.md,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    contactText: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutral,
    },
    hoursHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    hoursTitle: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.md,
      color: colors.neutral,
    },
    socialRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.md,
      marginTop: spacing.xl,
    },
    socialBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

import { useMemo } from 'react';
import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useTheme, fonts, fontSize, spacing, radii, teal, type ThemeColors } from '@/constants/theme';

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
        <Text style={styles.heading}>Get in Touch</Text>
        <View style={styles.grid}>
          {/* Contact info */}
          {hasContact && (
            <View style={styles.card}>
              {phone && (
                <Pressable style={styles.contactRow} onPress={() => Linking.openURL(`tel:${phone}`)}>
                  <View style={styles.iconCircle}>
                    <MaterialIcons name="phone" size={18} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.contactLabel}>Phone</Text>
                    <Text style={styles.contactText}>{phone}</Text>
                  </View>
                </Pressable>
              )}
              {email && (
                <Pressable style={styles.contactRow} onPress={() => Linking.openURL(`mailto:${email}`)}>
                  <View style={styles.iconCircle}>
                    <MaterialIcons name="email" size={18} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.contactLabel}>Email</Text>
                    <Text style={styles.contactText}>{email}</Text>
                  </View>
                </Pressable>
              )}
              {address && (
                <View style={styles.contactRow}>
                  <View style={styles.iconCircle}>
                    <MaterialIcons name="place" size={18} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.contactLabel}>Address</Text>
                    <Text style={styles.contactText}>{address}</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Hours */}
          {hours && (
            <View style={styles.card}>
              <View style={styles.contactRow}>
                <View style={styles.iconCircle}>
                  <MaterialIcons name="schedule" size={18} color={colors.primary} />
                </View>
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
                <MaterialIcons name="facebook" size={24} color={colors.primary} />
              </Pressable>
            )}
            {socialLinks?.instagram && (
              <Pressable style={styles.socialBtn} onPress={() => Linking.openURL(socialLinks.instagram!)}>
                <MaterialIcons name="camera-alt" size={24} color={colors.primary} />
              </Pressable>
            )}
            {socialLinks?.twitter && (
              <Pressable style={styles.socialBtn} onPress={() => Linking.openURL(socialLinks.twitter!)}>
                <MaterialIcons name="alternate-email" size={24} color={colors.primary} />
              </Pressable>
            )}
            {socialLinks?.website && (
              <Pressable style={styles.socialBtn} onPress={() => Linking.openURL(socialLinks.website!)}>
                <MaterialIcons name="language" size={24} color={colors.primary} />
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
      paddingVertical: spacing.xxxl + 16,
      backgroundColor: teal[50],
    },
    inner: {
      maxWidth: 1000,
      alignSelf: 'center',
      width: '100%' as any,
    },
    heading: {
      fontFamily: fonts.sansBold,
      fontSize: 32,
      color: colors.neutral,
      marginBottom: spacing.xxl,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xl,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radii.lg,
      padding: spacing.xxl,
      flex: 1,
      minWidth: 260,
      gap: spacing.lg,
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    iconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primaryContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    contactLabel: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.xs,
      color: colors.neutralVariant,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    contactText: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutral,
    },
    hoursTitle: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.lg,
      color: colors.neutral,
    },
    socialRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.xxl,
    },
    socialBtn: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

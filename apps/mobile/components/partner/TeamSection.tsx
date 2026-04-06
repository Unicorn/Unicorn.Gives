import { useMemo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';

interface TeamMember {
  name: string;
  role: string;
  image_url?: string;
  bio?: string;
}

interface TeamSectionProps {
  members: TeamMember[];
}

export function TeamSection({ members }: TeamSectionProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!members || members.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.heading}>Meet Our Team</Text>
        <View style={styles.list}>
          {members.map((member, i) => (
            <View key={i} style={styles.card}>
              {member.image_url ? (
                <Image source={{ uri: member.image_url }} style={styles.photo} resizeMode="cover" />
              ) : (
                <View style={[styles.photo, styles.photoPlaceholder]}>
                  <MaterialIcons name="person" size={48} color={colors.neutralVariant} />
                </View>
              )}
              <View style={styles.textCol}>
                <Text style={styles.name}>{member.name}</Text>
                {member.role && <Text style={styles.role}>{member.role}</Text>}
                {member.bio && <Text style={styles.bio}>{member.bio}</Text>}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxxl + 16,
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
    list: {
      gap: spacing.xxxl,
    },
    card: {
      flexDirection: 'row',
      gap: spacing.xxl,
      flexWrap: 'wrap',
    },
    photo: {
      width: 200,
      height: 240,
      borderRadius: radii.lg,
    },
    photoPlaceholder: {
      backgroundColor: colors.surfaceContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textCol: {
      flex: 1,
      minWidth: 240,
      gap: spacing.xs,
      justifyContent: 'center',
    },
    name: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize['2xl'],
      color: colors.neutral,
    },
    role: {
      fontFamily: fonts.sansMedium,
      fontSize: fontSize.md,
      color: colors.primary,
      marginBottom: spacing.sm,
    },
    bio: {
      fontFamily: fonts.sans,
      fontSize: fontSize.base,
      color: colors.neutralVariant,
      lineHeight: 24,
    },
  });

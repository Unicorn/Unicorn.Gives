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
        <Text style={styles.heading}>Our Team</Text>
        <View style={styles.grid}>
          {members.map((member, i) => (
            <View key={i} style={styles.card}>
              {member.image_url ? (
                <Image source={{ uri: member.image_url }} style={styles.avatar} resizeMode="cover" />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <MaterialIcons name="person" size={32} color={colors.neutralVariant} />
                </View>
              )}
              <Text style={styles.name}>{member.name}</Text>
              {member.role && <Text style={styles.role}>{member.role}</Text>}
              {member.bio && <Text style={styles.bio}>{member.bio}</Text>}
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
      paddingVertical: spacing.xxl,
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
      alignItems: 'center',
      width: 200,
      gap: spacing.xs,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: spacing.sm,
    },
    avatarPlaceholder: {
      backgroundColor: colors.surfaceContainer,
      alignItems: 'center',
      justifyContent: 'center',
    },
    name: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.md,
      color: colors.neutral,
      textAlign: 'center',
    },
    role: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.primary,
      textAlign: 'center',
    },
    bio: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.neutralVariant,
      textAlign: 'center',
      lineHeight: 20,
      marginTop: spacing.xs,
    },
  });

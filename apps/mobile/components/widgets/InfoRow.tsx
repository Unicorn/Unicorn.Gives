import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme, fonts, fontSize, spacing, radii, shadows } from '@/constants/theme';

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  secondaryValue?: string;
  href?: string;
}

export function InfoRow({ icon, label, value, secondaryValue, href }: InfoRowProps) {
  const { colors } = useTheme();

  const content = (
    <View style={styles.row}>
      <MaterialIcons name={icon as any} size={22} color={colors.neutralVariant} style={styles.icon} />
      <View style={styles.textBlock}>
        <Text style={[styles.label, { color: colors.neutral }]}>{label}</Text>
        <Text style={[styles.value, { color: colors.neutralVariant }]}>{value}</Text>
        {secondaryValue && <Text style={[styles.secondaryValue, { color: colors.neutralVariant }]}>{secondaryValue}</Text>}
      </View>
    </View>
  );

  if (href) {
    return (
      <TouchableOpacity onPress={() => Linking.openURL(href)}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

interface InfoRowGroupProps {
  title?: string;
  rows: InfoRowProps[];
}

export function InfoRowGroup({ title, rows }: InfoRowGroupProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.group, { backgroundColor: colors.surface }]}>
      {title && <Text style={[styles.groupTitle, { color: colors.primary }]}>{title}</Text>}
      <View style={styles.groupRows}>
        {rows.map((row, i) => (
          <InfoRow key={i} {...row} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.lg - 2,
    paddingVertical: spacing.md,
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: fontSize['2xl'],
    width: 32,
    textAlign: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontFamily: fonts.sansBold,
    fontSize: fontSize.md,
  },
  value: {
    fontFamily: fonts.sans,
    fontSize: fontSize.md,
    lineHeight: 20,
  },
  secondaryValue: {
    fontFamily: fonts.sans,
    fontSize: fontSize.sm + 1,
    lineHeight: 19,
  },
  group: {
    borderRadius: radii.md,
    padding: spacing.xl,
    gap: spacing.xs,
    ...shadows.cardElevated,
  },
  groupTitle: {
    fontFamily: fonts.serifItalic,
    fontSize: fontSize['3xl'],
    marginBottom: spacing.sm,
  },
  groupRows: {
    gap: 0,
  },
});

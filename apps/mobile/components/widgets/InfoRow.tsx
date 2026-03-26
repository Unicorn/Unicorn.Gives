import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useTheme, fonts, radii } from '@/constants/theme';

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
      <Text style={styles.icon}>{icon}</Text>
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
    <View style={[styles.group, { borderColor: colors.outline }]}>
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
    gap: 14,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  icon: {
    fontSize: 22,
    width: 32,
    textAlign: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
  },
  value: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  secondaryValue: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 19,
  },
  group: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: 20,
    gap: 4,
  },
  groupTitle: {
    fontFamily: fonts.serifItalic,
    fontSize: 24,
    marginBottom: 8,
  },
  groupRows: {
    gap: 0,
  },
});

import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { homeColors, homeFonts, homeRadii } from '@/constants/homeTheme';

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  secondaryValue?: string;
  href?: string;
}

export function InfoRow({ icon, label, value, secondaryValue, href }: InfoRowProps) {
  const content = (
    <View style={styles.row}>
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.textBlock}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
        {secondaryValue && <Text style={styles.secondaryValue}>{secondaryValue}</Text>}
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
  return (
    <View style={styles.group}>
      {title && <Text style={styles.groupTitle}>{title}</Text>}
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
    fontFamily: homeFonts.sansBold,
    fontSize: 14,
    color: homeColors.onSurface,
  },
  value: {
    fontFamily: homeFonts.sans,
    fontSize: 14,
    color: homeColors.onSurfaceVariant,
    lineHeight: 20,
  },
  secondaryValue: {
    fontFamily: homeFonts.sans,
    fontSize: 13,
    color: homeColors.muted,
    lineHeight: 19,
  },
  group: {
    backgroundColor: homeColors.surface,
    borderRadius: homeRadii.md,
    borderWidth: 1,
    borderColor: homeColors.outline,
    padding: 20,
    gap: 4,
  },
  groupTitle: {
    fontFamily: homeFonts.serifItalic,
    fontSize: 24,
    color: homeColors.primary,
    marginBottom: 8,
  },
  groupRows: {
    gap: 0,
  },
});

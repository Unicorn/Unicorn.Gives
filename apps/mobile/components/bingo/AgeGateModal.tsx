import { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useTheme, fonts, fontSize, spacing, type ThemeColors } from '@/constants/theme';

interface AgeGateModalProps {
  visible: boolean;
  minAge: number;
  disclaimerMd?: string | null;
  onAccept: () => void;
  onDecline: () => void;
}

export function AgeGateModal({
  visible,
  minAge,
  disclaimerMd,
  onAccept,
  onDecline,
}: AgeGateModalProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal
      visible={visible}
      onClose={onDecline}
      title={`${minAge}+ to play`}
      icon="info"
      iconColor={colors.error}
      maxWidth={520}
      actions={
        <>
          <Button label={`I'm under ${minAge}`} variant="secondary" onPress={onDecline} />
          <Button label="I agree — I'm of age" variant="primary" onPress={onAccept} />
        </>
      }
    >
      <Text style={styles.intro}>
        This game is for grown folks. Confirm you are {minAge} or older and accept the terms below.
      </Text>
      {disclaimerMd ? (
        <ScrollView style={styles.disclaimerScroll}>
          <MarkdownRenderer content={disclaimerMd} />
        </ScrollView>
      ) : null}
      <View style={styles.spacer} />
    </Modal>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    intro: {
      fontFamily: fonts.sans,
      fontSize: fontSize.md,
      color: colors.neutral,
      marginBottom: spacing.md,
    },
    disclaimerScroll: {
      maxHeight: 280,
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: 8,
      padding: spacing.md,
      backgroundColor: colors.surfaceContainer,
    },
    spacer: { height: spacing.sm },
  });

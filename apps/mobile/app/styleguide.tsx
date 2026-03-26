import { ScrollView, View, Text, StyleSheet, TextInput, Pressable, Switch } from 'react-native';
import { useState } from 'react';
import {
  useTheme,
  fonts,
  spacing,
  radii,
  teal,
  gray,
  purple as purpleScale,
  gold as goldScale,
  type ThemeColors,
  ThemeOverrideContext,
} from '@/constants/theme';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={sectionStyles.section}>
      <Text style={[sectionStyles.heading, { color: colors.neutral, fontFamily: fonts.sansBold, borderBottomColor: colors.outline }]}>
        {title}
      </Text>
      <View style={sectionStyles.body}>{children}</View>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  section: { marginBottom: 32 },
  heading: { fontSize: 20, marginBottom: 16, borderBottomWidth: 1, paddingBottom: 8 },
  body: { gap: 12 },
});

// ---------------------------------------------------------------------------
// Theme Switcher
// ---------------------------------------------------------------------------

function ThemeSwitcher({ mode, onToggle }: { mode: 'light' | 'dark'; onToggle: () => void }) {
  const { colors } = useTheme();
  const isDark = mode === 'dark';
  return (
    <View style={ts.row}>
      <Text style={[ts.label, { color: colors.neutralVariant }]}>☀️</Text>
      <Pressable onPress={onToggle} style={[ts.track, { backgroundColor: isDark ? colors.primary : colors.outline }]}>
        <View style={[ts.thumb, isDark ? ts.thumbRight : ts.thumbLeft, { backgroundColor: colors.surface }]} />
      </Pressable>
      <Text style={[ts.label, { color: colors.neutralVariant }]}>🌙</Text>
      <Text style={[ts.modeLabel, { color: colors.neutral }]}>{isDark ? 'Dark' : 'Light'} Mode</Text>
    </View>
  );
}

const ts = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  track: { width: 48, height: 26, borderRadius: 13, justifyContent: 'center', paddingHorizontal: 3 },
  thumb: { width: 20, height: 20, borderRadius: 10 },
  thumbLeft: { alignSelf: 'flex-start' },
  thumbRight: { alignSelf: 'flex-end' },
  label: { fontSize: 16 },
  modeLabel: { fontFamily: fonts.sansMedium, fontSize: 14, marginLeft: 4 },
});

// ---------------------------------------------------------------------------
// Palette Scales
// ---------------------------------------------------------------------------

type ScaleMap = Record<string, string>;

function PaletteRow({ name, scale, anchor }: { name: string; scale: ScaleMap; anchor: string }) {
  const { colors } = useTheme();
  const steps = Object.entries(scale);
  return (
    <View style={ps.row}>
      <Text style={[ps.name, { color: colors.neutral }]}>{name}</Text>
      <View style={ps.swatches}>
        {steps.map(([step, hex]) => {
          const isAnchor = hex.toLowerCase() === anchor.toLowerCase();
          const stepNum = parseInt(step, 10);
          const textColor = stepNum >= 500 ? '#ffffff' : gray[800];
          return (
            <View key={step} style={[ps.swatch, { backgroundColor: hex }, isAnchor && { borderWidth: 2, borderColor: colors.neutral }]}>
              <Text style={[ps.step, { color: textColor }]}>{step}</Text>
              <Text style={[ps.hex, { color: textColor }]}>{hex}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const ps = StyleSheet.create({
  row: { marginBottom: 16 },
  name: { fontFamily: fonts.sansBold, fontSize: 14, marginBottom: 6 },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  swatch: { width: 72, height: 52, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 4, justifyContent: 'space-between' },
  step: { fontFamily: fonts.sansBold, fontSize: 10 },
  hex: { fontFamily: fonts.sans, fontSize: 8 },
});

function PaletteScales() {
  return (
    <Section title="Color Scales">
      <PaletteRow name="Teal (Primary)" scale={teal} anchor="#07877a" />
      <PaletteRow name="Gray (Neutral)" scale={gray} anchor="#4e4e5a" />
      <PaletteRow name="Purple (Date Taxonomy)" scale={purpleScale} anchor="#866bff" />
      <PaletteRow name="Gold (Feature Taxonomy)" scale={goldScale} anchor="#d6bd3f" />
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Semantic Colors
// ---------------------------------------------------------------------------

function SemanticColors() {
  const { colors } = useTheme();
  const swatches: { label: string; key: keyof ThemeColors }[] = [
    { label: 'Primary', key: 'primary' },
    { label: 'Primary Container', key: 'primaryContainer' },
    { label: 'Gold', key: 'gold' },
    { label: 'Gold Container', key: 'goldContainer' },
    { label: 'Purple', key: 'purple' },
    { label: 'Purple Container', key: 'purpleContainer' },
    { label: 'Neutral', key: 'neutral' },
    { label: 'Neutral Variant', key: 'neutralVariant' },
    { label: 'Surface', key: 'surface' },
    { label: 'Surface Container', key: 'surfaceContainer' },
    { label: 'Background', key: 'background' },
    { label: 'Outline', key: 'outline' },
    { label: 'Error', key: 'error' },
    { label: 'Hero Bar', key: 'heroBar' },
  ];

  return (
    <Section title="Semantic Colors">
      <View style={s.swatchGrid}>
        {swatches.map(({ label, key }) => (
          <View key={key} style={s.swatchItem}>
            <View style={[s.swatchBox, { backgroundColor: colors[key], borderColor: colors.outline }]} />
            <Text style={[s.swatchLabel, { color: colors.neutral }]}>{label}</Text>
            <Text style={[s.swatchHex, { color: colors.neutralVariant }]}>{colors[key]}</Text>
          </View>
        ))}
      </View>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

function TypographyScale() {
  const { typography, colors } = useTheme();
  const entries: { name: string; style: Record<string, any>; spec: string }[] = [
    { name: 'Display', style: typography.display, spec: 'Newsreader Bold · 30px' },
    { name: 'Headline', style: typography.headline, spec: 'Newsreader Italic · 24px' },
    { name: 'Title', style: typography.title, spec: 'Manrope Bold · 18px' },
    { name: 'Subtitle', style: typography.subtitle, spec: 'Manrope Semi · 15px' },
    { name: 'Body', style: typography.body, spec: 'Manrope Regular · 14px' },
    { name: 'Caption', style: typography.caption, spec: 'Manrope Regular · 12px' },
    { name: 'Eyebrow', style: typography.eyebrow, spec: 'Manrope Bold · 11px · UPPERCASE' },
  ];

  return (
    <Section title="Typography">
      {entries.map(({ name, style, spec }) => (
        <View key={name} style={s.typeRow}>
          <Text style={style}>{name} — The quick brown fox</Text>
          <Text style={[s.typeSpec, { color: colors.neutralVariant }]}>{spec}</Text>
        </View>
      ))}
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

function Buttons() {
  const { colors } = useTheme();

  return (
    <Section title="Buttons">
      <Text style={[s.note, { color: colors.neutralVariant }]}>
        Primary teal is used exclusively for interactive elements.
      </Text>
      <View style={s.buttonRow}>
        <Pressable style={[s.btn, { backgroundColor: colors.primary }]}>
          <Text style={[s.btnText, { color: colors.onPrimary }]}>Primary</Text>
        </Pressable>
        <Pressable style={[s.btn, s.btnOutline, { borderColor: colors.primary }]}>
          <Text style={[s.btnText, { color: colors.primary }]}>Outline</Text>
        </Pressable>
        <Pressable style={[s.btn, { backgroundColor: 'transparent' }]}>
          <Text style={[s.btnText, { color: colors.primary }]}>Ghost</Text>
        </Pressable>
        <Pressable style={[s.btn, { backgroundColor: colors.outline, opacity: 0.5 }]} disabled>
          <Text style={[s.btnText, { color: colors.neutralVariant }]}>Disabled</Text>
        </Pressable>
      </View>

      <Text style={[s.subsection, { color: colors.neutral, fontFamily: fonts.sansMedium }]}>Sizes</Text>
      <View style={s.buttonRow}>
        <Pressable style={[s.btn, s.btnSm, { backgroundColor: colors.primary }]}>
          <Text style={[s.btnTextSm, { color: colors.onPrimary }]}>Small</Text>
        </Pressable>
        <Pressable style={[s.btn, { backgroundColor: colors.primary }]}>
          <Text style={[s.btnText, { color: colors.onPrimary }]}>Medium</Text>
        </Pressable>
        <Pressable style={[s.btn, s.btnLg, { backgroundColor: colors.primary }]}>
          <Text style={[s.btnTextLg, { color: colors.onPrimary }]}>Large</Text>
        </Pressable>
      </View>

      <Text style={[s.subsection, { color: colors.neutral, fontFamily: fonts.sansMedium }]}>Destructive</Text>
      <View style={s.buttonRow}>
        <Pressable style={[s.btn, { backgroundColor: colors.error }]}>
          <Text style={[s.btnText, { color: colors.onError }]}>Delete</Text>
        </Pressable>
        <Pressable style={[s.btn, s.btnOutline, { borderColor: colors.error }]}>
          <Text style={[s.btnText, { color: colors.error }]}>Cancel</Text>
        </Pressable>
      </View>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Form Controls
// ---------------------------------------------------------------------------

function FormControls() {
  const { colors } = useTheme();
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState(0);
  const [toggle, setToggle] = useState(true);
  const [slider, setSlider] = useState(60);

  return (
    <Section title="Form Controls">
      <Text style={[s.note, { color: colors.neutralVariant }]}>
        All interactive controls use the primary teal.
      </Text>

      <Text style={[s.inputLabel, { color: colors.neutral }]}>Text Input</Text>
      <TextInput
        style={[s.input, { borderColor: colors.outline, color: colors.neutral, backgroundColor: colors.surface }]}
        placeholder="Placeholder text..."
        placeholderTextColor={colors.neutralVariant}
      />
      <TextInput
        style={[s.input, { borderColor: colors.primary, color: colors.neutral, backgroundColor: colors.surface }]}
        value="Focused input"
      />

      <Text style={[s.inputLabel, { color: colors.neutral, marginTop: 12 }]}>Checkboxes</Text>
      <View style={s.controlRow}>
        <Pressable
          onPress={() => setChecked(!checked)}
          style={[s.checkbox, { borderColor: checked ? colors.primary : colors.outline, backgroundColor: checked ? colors.primary : 'transparent' }]}
        >
          {checked && <Text style={s.checkmark}>✓</Text>}
        </Pressable>
        <Text style={[s.controlLabel, { color: colors.neutral }]}>{checked ? 'Checked' : 'Unchecked'}</Text>
        <Pressable style={[s.checkbox, { borderColor: colors.outline, backgroundColor: 'transparent', marginLeft: 16 }]}>
          <Text style={{ color: 'transparent' }}>✓</Text>
        </Pressable>
        <Text style={[s.controlLabel, { color: colors.neutral }]}>Unchecked</Text>
      </View>

      <Text style={[s.inputLabel, { color: colors.neutral, marginTop: 12 }]}>Radio Buttons</Text>
      <View style={s.controlRow}>
        {['Option A', 'Option B', 'Option C'].map((label, i) => (
          <Pressable key={i} onPress={() => setRadio(i)} style={s.radioRow}>
            <View style={[s.radioOuter, { borderColor: radio === i ? colors.primary : colors.outline }]}>
              {radio === i && <View style={[s.radioInner, { backgroundColor: colors.primary }]} />}
            </View>
            <Text style={[s.controlLabel, { color: colors.neutral }]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={[s.inputLabel, { color: colors.neutral, marginTop: 12 }]}>Toggle</Text>
      <View style={s.controlRow}>
        <Switch value={toggle} onValueChange={setToggle} trackColor={{ false: colors.outline, true: colors.primary }} thumbColor={colors.onPrimary} />
        <Text style={[s.controlLabel, { color: colors.neutral }]}>{toggle ? 'On' : 'Off'}</Text>
      </View>

      <Text style={[s.inputLabel, { color: colors.neutral, marginTop: 12 }]}>Range Slider</Text>
      <View style={[s.sliderTrack, { backgroundColor: colors.outlineVariant }]}>
        <View style={[s.sliderFill, { backgroundColor: colors.primary, width: `${slider}%` }]} />
        <View style={[s.sliderThumb, { backgroundColor: colors.primary, left: `${slider}%` }]} />
      </View>
      <View style={s.sliderButtons}>
        <Pressable onPress={() => setSlider(Math.max(0, slider - 10))}>
          <Text style={{ color: colors.primary, fontFamily: fonts.sansBold, fontSize: 16 }}>−</Text>
        </Pressable>
        <Text style={[s.sliderValue, { color: colors.neutral }]}>{slider}%</Text>
        <Pressable onPress={() => setSlider(Math.min(100, slider + 10))}>
          <Text style={{ color: colors.primary, fontFamily: fonts.sansBold, fontSize: 16 }}>+</Text>
        </Pressable>
      </View>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Taxonomy Chips
// ---------------------------------------------------------------------------

function TaxonomyChips() {
  const { colors, chips } = useTheme();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const goldLabels = ['Featured', 'New', 'Filling Up Fast', 'Limited Spots'];
  const purpleLabels = ['Monday', 'Oct 12', 'This Weekend', 'Ends Soon'];
  const filterLabels = ['All', 'Music', 'Food', 'Outdoors', 'Arts', 'Sports'];

  return (
    <Section title="Taxonomy Chips">
      <Text style={[s.subsection, { color: colors.neutral, fontFamily: fonts.sansMedium }]}>Gold — Feature / Status</Text>
      <Text style={[s.note, { color: colors.neutralVariant }]}>Dark border and text on lighter same-color background.</Text>
      <View style={s.chipRow}>
        {goldLabels.map((label) => (
          <View key={label} style={[s.chip, { backgroundColor: chips.gold.backgroundColor, borderColor: chips.gold.borderColor }]}>
            <Text style={[s.chipText, { color: chips.gold.color }]}>{label}</Text>
          </View>
        ))}
      </View>

      <Text style={[s.subsection, { color: colors.neutral, fontFamily: fonts.sansMedium, marginTop: 16 }]}>Purple — Date / Time</Text>
      <Text style={[s.note, { color: colors.neutralVariant }]}>Same pattern: dark border and text on lighter same-color background.</Text>
      <View style={s.chipRow}>
        {purpleLabels.map((label) => (
          <View key={label} style={[s.chip, { backgroundColor: chips.purple.backgroundColor, borderColor: chips.purple.borderColor }]}>
            <Text style={[s.chipText, { color: chips.purple.color }]}>{label}</Text>
          </View>
        ))}
      </View>

      <Text style={[s.subsection, { color: colors.neutral, fontFamily: fonts.sansMedium, marginTop: 16 }]}>Category Filters</Text>
      <Text style={[s.note, { color: colors.neutralVariant }]}>Neutral outline when inactive. Dark heroBar fill when active.</Text>
      <View style={s.chipRow}>
        {filterLabels.map((label) => {
          const isActive = activeFilter === label || (!activeFilter && label === 'All');
          const chipStyle = isActive ? chips.filterActive : chips.filterInactive;
          return (
            <Pressable
              key={label}
              onPress={() => setActiveFilter(label === 'All' ? null : label)}
              style={[s.chip, { backgroundColor: chipStyle.backgroundColor, borderColor: chipStyle.borderColor }]}
            >
              <Text style={[s.chipText, { color: chipStyle.color, fontFamily: isActive ? fonts.sansBold : fonts.sans }]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

function Cards() {
  const { colors, chips, typography } = useTheme();

  return (
    <Section title="Cards">
      <Text style={[s.subsection, { color: colors.neutral, fontFamily: fonts.sansMedium }]}>Event Card</Text>
      <View style={[s.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
        <View style={[s.dateBox, { borderWidth: 1.5, borderColor: colors.neutral, backgroundColor: 'transparent' }]}>
          <Text style={[s.dateMonth, { color: colors.neutralVariant }]}>MAR</Text>
          <Text style={[s.dateDay, { color: colors.neutral }]}>28</Text>
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[typography.subtitle, { color: colors.neutral }]}>Clare County Spring Festival</Text>
          <Text style={typography.caption}>10:00 AM — Fairgrounds Park</Text>
          <View style={s.chipRow}>
            <View style={[s.chip, { backgroundColor: chips.gold.backgroundColor, borderColor: chips.gold.borderColor }]}>
              <Text style={[s.chipText, { color: chips.gold.color }]}>Featured</Text>
            </View>
            <View style={[s.chip, { backgroundColor: chips.purple.backgroundColor, borderColor: chips.purple.borderColor }]}>
              <Text style={[s.chipText, { color: chips.purple.color }]}>This Weekend</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={[s.subsection, { color: colors.neutral, fontFamily: fonts.sansMedium, marginTop: 16 }]}>Editorial Card</Text>
      <View style={[s.editorialCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
        <View style={[s.editorialImage, { backgroundColor: colors.surfaceContainer }]}>
          <Text style={{ color: colors.neutralVariant, fontSize: 24 }}>📷</Text>
        </View>
        <View style={{ padding: 16, gap: 6 }}>
          <Text style={typography.eyebrow}>Community News</Text>
          <Text style={typography.title}>New Trail System Opens in Harrison</Text>
          <Text style={[typography.body, { color: colors.neutralVariant }]} numberOfLines={2}>
            The city of Harrison announced the completion of a new 5-mile trail system connecting downtown to the lakefront park area.
          </Text>
          <Pressable style={{ marginTop: 4 }}>
            <Text style={{ color: colors.primary, fontFamily: fonts.sansMedium, fontSize: 14 }}>Read more →</Text>
          </Pressable>
        </View>
      </View>

      <Text style={[s.subsection, { color: colors.neutral, fontFamily: fonts.sansMedium, marginTop: 16 }]}>Bento Grid Item</Text>
      <View style={s.bentoRow}>
        <View style={[s.bentoItem, { backgroundColor: colors.surfaceContainer, borderColor: colors.outline }]}>
          <Text style={{ fontSize: 28 }}>🗺️</Text>
          <Text style={typography.subtitle}>Explore Trails</Text>
          <Text style={typography.caption}>12 trails nearby</Text>
        </View>
        <View style={[s.bentoItem, { backgroundColor: colors.primaryContainer, borderColor: colors.outline }]}>
          <Text style={{ fontSize: 28 }}>📅</Text>
          <Text style={[typography.subtitle, { color: colors.onPrimaryContainer }]}>Upcoming Events</Text>
          <Text style={[typography.caption, { color: colors.onPrimaryContainer }]}>8 this week</Text>
        </View>
      </View>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Spacing & Radii
// ---------------------------------------------------------------------------

function SpacingAndRadii() {
  const { colors } = useTheme();

  const spacingEntries = [
    { name: 'xs', value: spacing.xs },
    { name: 'sm', value: spacing.sm },
    { name: 'md', value: spacing.md },
    { name: 'lg', value: spacing.lg },
    { name: 'xl', value: spacing.xl },
    { name: 'xxl', value: spacing.xxl },
    { name: 'xxxl', value: spacing.xxxl },
  ];

  const radiiEntries = [
    { name: 'sm', value: radii.sm },
    { name: 'md', value: radii.md },
    { name: 'lg', value: radii.lg },
    { name: 'pill', value: radii.pill },
  ];

  return (
    <Section title="Spacing & Radii">
      <Text style={[s.subsection, { color: colors.neutral, fontFamily: fonts.sansMedium }]}>Spacing Scale</Text>
      <View style={{ gap: 6 }}>
        {spacingEntries.map(({ name, value }) => (
          <View key={name} style={s.spacingRow}>
            <Text style={[s.spacingLabel, { color: colors.neutral }]}>{name} ({value}px)</Text>
            <View style={[s.spacingBar, { width: value * 4, backgroundColor: colors.primary }]} />
          </View>
        ))}
      </View>

      <Text style={[s.subsection, { color: colors.neutral, fontFamily: fonts.sansMedium, marginTop: 20 }]}>Border Radii</Text>
      <View style={s.radiiRow}>
        {radiiEntries.map(({ name, value }) => (
          <View key={name} style={{ alignItems: 'center', gap: 4 }}>
            <View style={[s.radiiBox, { borderRadius: value, borderColor: colors.primary, backgroundColor: colors.primaryContainer }]} />
            <Text style={[s.spacingLabel, { color: colors.neutral }]}>{name}</Text>
            <Text style={[s.swatchHex, { color: colors.neutralVariant }]}>{value}px</Text>
          </View>
        ))}
      </View>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

export default function StyleguideScreen() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  return (
    <ThemeOverrideContext.Provider value={mode}>
      <StyleguideContent mode={mode} onToggle={() => setMode(m => m === 'light' ? 'dark' : 'light')} />
    </ThemeOverrideContext.Provider>
  );
}

function StyleguideContent({ mode, onToggle }: { mode: 'light' | 'dark'; onToggle: () => void }) {
  const { colors, typography } = useTheme();

  return (
    <ScrollView style={[s.page, { backgroundColor: colors.background }]} contentContainerStyle={s.content}>
      <View style={s.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={[typography.display, { color: colors.neutral }]}>Styleguide</Text>
          <Text style={[typography.body, { color: colors.neutralVariant, marginTop: 4 }]}>
            UNI-Gives Design System
          </Text>
        </View>
        <ThemeSwitcher mode={mode} onToggle={onToggle} />
      </View>

      <PaletteScales />
      <SemanticColors />
      <TypographyScale />
      <Buttons />
      <FormControls />
      <TaxonomyChips />
      <Cards />
      <SpacingAndRadii />
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const s = StyleSheet.create({
  page: { flex: 1 },
  content: { padding: 20, paddingBottom: 60, maxWidth: 800, alignSelf: 'center', width: '100%', flexGrow: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, gap: 16 },

  // Swatches
  swatchGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  swatchItem: { alignItems: 'center', width: 80 },
  swatchBox: { width: 60, height: 60, borderRadius: 8, borderWidth: 1 },
  swatchLabel: { fontSize: 10, fontFamily: fonts.sansMedium, marginTop: 4, textAlign: 'center' },
  swatchHex: { fontSize: 9, fontFamily: fonts.sans },

  // Typography
  typeRow: { marginBottom: 8 },
  typeSpec: { fontSize: 11, fontFamily: fonts.sans, marginTop: 2 },

  // Buttons
  buttonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  btn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center' },
  btnOutline: { backgroundColor: 'transparent', borderWidth: 1.5 },
  btnText: { fontFamily: fonts.sansMedium, fontSize: 14 },
  btnSm: { paddingHorizontal: 14, paddingVertical: 6 },
  btnTextSm: { fontFamily: fonts.sansMedium, fontSize: 12 },
  btnLg: { paddingHorizontal: 28, paddingVertical: 14 },
  btnTextLg: { fontFamily: fonts.sansMedium, fontSize: 16 },
  note: { fontSize: 12, fontFamily: fonts.sans, fontStyle: 'italic', marginBottom: 8 },
  subsection: { fontSize: 14, marginBottom: 8, marginTop: 4 },

  // Form Controls
  inputLabel: { fontFamily: fonts.sansMedium, fontSize: 13, marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: radii.sm, paddingHorizontal: 12, paddingVertical: 10, fontFamily: fonts.sans, fontSize: 14 },
  controlRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: '700', marginTop: -1 },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 12 },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  controlLabel: { fontFamily: fonts.sans, fontSize: 14 },
  sliderTrack: { height: 6, borderRadius: 3, marginTop: 8, position: 'relative' },
  sliderFill: { height: 6, borderRadius: 3, position: 'absolute', left: 0, top: 0 },
  sliderThumb: { width: 20, height: 20, borderRadius: 10, position: 'absolute', top: -7, marginLeft: -10 },
  sliderButtons: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 12 },
  sliderValue: { fontFamily: fonts.sansMedium, fontSize: 14 },

  // Chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radii.pill, borderWidth: 1 },
  chipText: { fontFamily: fonts.sansMedium, fontSize: 12 },

  // Cards
  card: { flexDirection: 'row', borderWidth: 1, borderRadius: radii.md, padding: 12, gap: 14 },
  dateBox: { width: 50, alignItems: 'center', borderRadius: 6, paddingVertical: 6 },
  dateMonth: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  dateDay: { fontSize: 22, fontWeight: '800' },
  editorialCard: { borderWidth: 1, borderRadius: radii.md, overflow: 'hidden' },
  editorialImage: { height: 140, alignItems: 'center', justifyContent: 'center' },
  bentoRow: { flexDirection: 'row', gap: 12 },
  bentoItem: { flex: 1, borderWidth: 1, borderRadius: radii.md, padding: 16, gap: 6, alignItems: 'center' },

  // Spacing
  spacingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  spacingLabel: { fontFamily: fonts.sansMedium, fontSize: 12, width: 80 },
  spacingBar: { height: 12, borderRadius: 3 },
  radiiRow: { flexDirection: 'row', gap: 20 },
  radiiBox: { width: 60, height: 60, borderWidth: 2 },
});

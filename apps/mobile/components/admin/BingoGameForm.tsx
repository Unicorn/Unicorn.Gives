import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { fonts, fontSize, spacing, useTheme, type ThemeColors } from '@/constants/theme';
import { useSlugGenerator } from '@/hooks/useSlugGenerator';
import { supabase } from '@/lib/supabase';
import type { BingoCategory, WinPattern, WinTier } from '@/lib/bingo/engine';
import {
  CheckboxField,
  DateField,
  FormColumn,
  FormRow,
  SelectField,
  SlugField,
  TextField,
} from './AdminForm';
import { AdminImageUpload } from './AdminImageUpload';
import { AdminRichEditor } from './AdminRichEditor';
import { RepeatableListEditor } from './RepeatableListEditor';

const WIN_PATTERNS: { label: string; value: WinPattern }[] = [
  { label: 'Bingo (any line)', value: 'bingo' },
  { label: 'Row', value: 'row' },
  { label: 'Column', value: 'column' },
  { label: 'Diagonal', value: 'diagonal' },
  { label: 'Four Corners', value: 'corners' },
  { label: 'The Plus', value: 'plus' },
  { label: 'The X', value: 'x' },
  { label: 'Blackout', value: 'blackout' },
];

export interface BingoGameFormData {
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  body: string;
  cover_image_url: string;
  region_id: string;
  partner_id: string;
  featured: boolean;
  starts_on: string;
  ends_on: string;
  claim_event_date: string;
  board_size: string;
  hard_cap: string;
  free_space_label: string;
  allow_reroll: boolean;
  age_gate_required: boolean;
  age_gate_min: string;
  categories: BingoCategory[];
  win_tiers: WinTier[];
  rules_md: string;
  disclaimer_md: string;
}

export const EMPTY_BINGO_GAME: BingoGameFormData = {
  title: '',
  slug: '',
  subtitle: '',
  description: '',
  body: '',
  cover_image_url: '',
  region_id: '',
  partner_id: '',
  featured: false,
  starts_on: '',
  ends_on: '',
  claim_event_date: '',
  board_size: '5',
  hard_cap: '6',
  free_space_label: 'FREE',
  allow_reroll: false,
  age_gate_required: true,
  age_gate_min: '18',
  categories: [],
  win_tiers: [],
  rules_md: '',
  disclaimer_md: '',
};

interface BingoGameFormProps {
  data: BingoGameFormData;
  onChange: (data: BingoGameFormData) => void;
  errors?: Record<string, string>;
}

export function BingoGameForm({ data, onChange, errors = {} }: BingoGameFormProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { slug, setSlug, manuallyEdited, resetManual } = useSlugGenerator(data.title);

  useEffect(() => {
    if (slug && !data.slug) onChange({ ...data, slug });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const [regions, setRegions] = useState<{ label: string; value: string }[]>([]);
  const [partners, setPartners] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    supabase
      .from('regions')
      .select('id, name')
      .eq('is_active', true)
      .order('display_order')
      .then(({ data: r }) => {
        if (r) setRegions(r.map((x) => ({ label: x.name, value: x.id })));
      });
    supabase
      .from('partners')
      .select('id, name')
      .eq('is_active', true)
      .order('name')
      .then(({ data: p }) => {
        if (p) setPartners(p.map((x) => ({ label: x.name, value: x.id })));
      });
  }, []);

  function set<K extends keyof BingoGameFormData>(key: K, value: BingoGameFormData[K]) {
    onChange({ ...data, [key]: value });
  }

  const regionOptions = [{ label: 'None', value: '' }, ...regions];
  const partnerOptions = [{ label: 'None', value: '' }, ...partners];

  return (
    <View style={styles.form}>
      {/* ── Details ── */}
      <Text style={styles.sectionHeading}>Details</Text>
      <TextField
        label="Title"
        value={data.title}
        onChangeText={(v) => set('title', v)}
        placeholder="Lake George Summer Bingo"
        required
        error={errors.title}
      />
      <SlugField
        slug={data.slug || slug}
        onSlugChange={(v) => {
          setSlug(v);
          set('slug', v);
        }}
        manuallyEdited={manuallyEdited}
        onReset={resetManual}
      />
      <TextField
        label="Subtitle"
        value={data.subtitle}
        onChangeText={(v) => set('subtitle', v)}
        placeholder="Land of the Unicorns"
      />
      <TextField
        label="Short description"
        value={data.description}
        onChangeText={(v) => set('description', v)}
        placeholder="One or two lines shown on the game card."
        multiline
        numberOfLines={3}
      />
      <AdminRichEditor
        label="Body"
        value={data.body}
        onChange={(v) => set('body', v)}
        placeholder="Longer description shown on the game landing page..."
      />
      <AdminImageUpload
        label="Cover image"
        value={data.cover_image_url}
        onChange={(v) => set('cover_image_url', v)}
        folder="bingo"
      />
      <FormRow>
        <FormColumn>
          <SelectField
            label="Partner"
            value={data.partner_id}
            onValueChange={(v) => set('partner_id', v)}
            options={partnerOptions}
          />
        </FormColumn>
        <FormColumn>
          <SelectField
            label="Region"
            value={data.region_id}
            onValueChange={(v) => set('region_id', v)}
            options={regionOptions}
          />
        </FormColumn>
      </FormRow>
      <FormRow>
        <FormColumn>
          <DateField label="Starts on" value={data.starts_on} onChangeText={(v) => set('starts_on', v)} />
        </FormColumn>
        <FormColumn>
          <DateField label="Ends on" value={data.ends_on} onChangeText={(v) => set('ends_on', v)} />
        </FormColumn>
        <FormColumn>
          <DateField
            label="Claim event date"
            value={data.claim_event_date}
            onChangeText={(v) => set('claim_event_date', v)}
          />
        </FormColumn>
      </FormRow>
      <CheckboxField
        label="Featured"
        value={data.featured}
        onValueChange={(v) => set('featured', v)}
        hint="Highlight this game on the public bingo index."
      />

      {/* ── Board configuration ── */}
      <Text style={styles.sectionHeading}>Board configuration</Text>
      <FormRow>
        <FormColumn>
          <TextField
            label="Board size"
            value={data.board_size}
            onChangeText={(v) => set('board_size', v)}
            placeholder="5"
            hint="Cells per side (5 = a 5×5 board)."
          />
        </FormColumn>
        <FormColumn>
          <TextField
            label="Hard-task cap"
            value={data.hard_cap}
            onChangeText={(v) => set('hard_cap', v)}
            placeholder="6"
            hint="Max difficulty-3 squares per board."
          />
        </FormColumn>
        <FormColumn>
          <TextField
            label="Free space label"
            value={data.free_space_label}
            onChangeText={(v) => set('free_space_label', v)}
            placeholder="FREE"
          />
        </FormColumn>
      </FormRow>
      <CheckboxField
        label="Allow rerolls"
        value={data.allow_reroll}
        onValueChange={(v) => set('allow_reroll', v)}
        hint="Let players draw a new board (replaces their existing one)."
      />
      <FormRow>
        <FormColumn>
          <CheckboxField
            label="Require age gate"
            value={data.age_gate_required}
            onValueChange={(v) => set('age_gate_required', v)}
            hint="Players must confirm their age before playing."
          />
        </FormColumn>
        <FormColumn>
          <TextField
            label="Minimum age"
            value={data.age_gate_min}
            onChangeText={(v) => set('age_gate_min', v)}
            placeholder="18"
          />
        </FormColumn>
      </FormRow>

      {/* ── Categories ── */}
      <Text style={styles.sectionHeading}>Categories</Text>
      <Text style={styles.sectionHint}>
        Each square belongs to a category by its key. The minimum guarantees that many squares of
        the category land on every board.
      </Text>
      <RepeatableListEditor<BingoCategory>
        label="Categories"
        items={data.categories}
        onChange={(items) => set('categories', items)}
        createEmpty={() => ({ key: '', label: '', color: '#0e7490', min: 0 })}
        fields={[]}
        maxItems={12}
        renderItem={(item, _index, updateItem) => (
          <View style={{ gap: spacing.sm }}>
            <FormRow>
              <FormColumn>
                <TextField
                  label="Key"
                  value={item.key}
                  onChangeText={(v) => updateItem({ key: v })}
                  placeholder="biz"
                />
              </FormColumn>
              <FormColumn>
                <TextField
                  label="Label"
                  value={item.label}
                  onChangeText={(v) => updateItem({ label: v })}
                  placeholder="Local Business"
                />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn>
                <TextField
                  label="Color (hex)"
                  value={item.color ?? ''}
                  onChangeText={(v) => updateItem({ color: v })}
                  placeholder="#0e7490"
                />
              </FormColumn>
              <FormColumn>
                <TextField
                  label="Minimum per board"
                  value={String(item.min ?? 0)}
                  onChangeText={(v) => updateItem({ min: parseInt(v, 10) || 0 })}
                  placeholder="3"
                />
              </FormColumn>
            </FormRow>
          </View>
        )}
      />

      {/* ── Win tiers ── */}
      <Text style={styles.sectionHeading}>Win tiers</Text>
      <Text style={styles.sectionHint}>
        The highest-rank tier a player achieves drives their prize. Rank ascending: low = easy win,
        high = grand prize.
      </Text>
      <RepeatableListEditor<WinTier>
        label="Win tiers"
        items={data.win_tiers}
        onChange={(items) => set('win_tiers', items)}
        createEmpty={() => ({ key: '', label: '', pattern: 'bingo', prize: '', rank: data.win_tiers.length + 1 })}
        fields={[]}
        maxItems={12}
        renderItem={(item, _index, updateItem) => (
          <View style={{ gap: spacing.sm }}>
            <FormRow>
              <FormColumn>
                <TextField
                  label="Key"
                  value={item.key}
                  onChangeText={(v) => updateItem({ key: v })}
                  placeholder="bingo"
                />
              </FormColumn>
              <FormColumn>
                <TextField
                  label="Label"
                  value={item.label}
                  onChangeText={(v) => updateItem({ label: v })}
                  placeholder="Bingo"
                />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn>
                <SelectField
                  label="Pattern"
                  value={item.pattern}
                  onValueChange={(v) => updateItem({ pattern: v as WinPattern })}
                  options={WIN_PATTERNS}
                />
              </FormColumn>
              <FormColumn>
                <TextField
                  label="Rank"
                  value={String(item.rank ?? 0)}
                  onChangeText={(v) => updateItem({ rank: parseInt(v, 10) || 0 })}
                  placeholder="1"
                />
              </FormColumn>
            </FormRow>
            <TextField
              label="Prize"
              value={item.prize ?? ''}
              onChangeText={(v) => updateItem({ prize: v })}
              placeholder="Grand prize"
            />
          </View>
        )}
      />

      {/* ── Rules & legal ── */}
      <Text style={styles.sectionHeading}>Rules &amp; legal</Text>
      <TextField
        label="How to Play (markdown)"
        value={data.rules_md}
        onChangeText={(v) => set('rules_md', v)}
        placeholder="Rendered verbatim on the About / How to Play screen."
        multiline
        numberOfLines={10}
      />
      <TextField
        label="Disclaimer (markdown)"
        value={data.disclaimer_md}
        onChangeText={(v) => set('disclaimer_md', v)}
        placeholder="Legal terms shown in the age gate and footer."
        multiline
        numberOfLines={10}
        hint="Have a licensed attorney review before public launch."
      />
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    form: {
      gap: spacing.lg,
      paddingBottom: spacing.xxl,
    },
    sectionHeading: {
      fontFamily: fonts.sansBold,
      fontSize: fontSize.md + 2,
      color: colors.neutral,
      marginTop: spacing.md,
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.outlineVariant,
    },
    sectionHint: {
      fontFamily: fonts.sans,
      fontSize: fontSize.sm,
      color: colors.neutralVariant,
      marginTop: -spacing.sm,
    },
  });

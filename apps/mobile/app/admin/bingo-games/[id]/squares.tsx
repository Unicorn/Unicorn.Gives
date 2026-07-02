import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { supabase } from '@/lib/supabase';
import { AdminPageShell, AdminButton } from '@/components/admin/AdminPageShell';
import { AdminConfirmDialog } from '@/components/admin/AdminConfirmDialog';
import { SelectField, TextField, FormRow, FormColumn, CheckboxField } from '@/components/admin/AdminForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { BingoGrid } from '@/components/bingo/BingoGrid';
import {
  buildBoard,
  type BingoCategory,
  type BingoSquare,
  type BoardCell,
  type BoardConfig,
} from '@/lib/bingo/engine';
import { useTheme, fonts, fontSize, spacing, radii, type ThemeColors } from '@/constants/theme';

interface SquareRow {
  id: string;
  text: string;
  category: string;
  difficulty: 1 | 2 | 3;
  is_active: boolean;
  display_order: number;
}

interface GameConfig {
  title: string;
  board_size: number;
  hard_cap: number;
  free_space_label: string;
  categories: BingoCategory[];
}

const DIFFICULTY_OPTIONS = [
  { label: 'Easy (1)', value: '1' },
  { label: 'Medium (2)', value: '2' },
  { label: 'Hard (3)', value: '3' },
];

const EMPTY_EDIT = { id: '', text: '', category: '', difficulty: '1', is_active: true };

export default function BingoSquaresPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [game, setGame] = useState<GameConfig | null>(null);
  const [squares, setSquares] = useState<SquareRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  const [editor, setEditor] = useState<typeof EMPTY_EDIT | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SquareRow | null>(null);
  const [preview, setPreview] = useState<BoardCell[] | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const loadSquares = useCallback(async () => {
    if (!id) return;
    const { data } = await supabase
      .from('bingo_squares')
      .select('id, text, category, difficulty, is_active, display_order')
      .eq('game_id', id)
      .order('display_order', { ascending: true });
    setSquares((data as SquareRow[]) ?? []);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase
        .from('bingo_games')
        .select('title, board_size, hard_cap, free_space_label, categories')
        .eq('id', id)
        .single(),
      supabase
        .from('bingo_squares')
        .select('id, text, category, difficulty, is_active, display_order')
        .eq('game_id', id)
        .order('display_order', { ascending: true }),
    ]).then(([g, s]) => {
      if (g.data) {
        setGame({
          title: g.data.title,
          board_size: g.data.board_size,
          hard_cap: g.data.hard_cap,
          free_space_label: g.data.free_space_label ?? 'FREE',
          categories: Array.isArray(g.data.categories) ? g.data.categories : [],
        });
      }
      setSquares((s.data as SquareRow[]) ?? []);
      setLoading(false);
    });
  }, [id]);

  const categoryOptions = useMemo(
    () => (game?.categories ?? []).map((c) => ({ label: `${c.label} (${c.key})`, value: c.key })),
    [game],
  );

  const filtered = useMemo(() => {
    return squares.filter((s) => {
      if (categoryFilter && s.category !== categoryFilter) return false;
      if (difficultyFilter && String(s.difficulty) !== difficultyFilter) return false;
      if (search && !s.text.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [squares, categoryFilter, difficultyFilter, search]);

  const counts = useMemo(() => {
    const byCat: Record<string, number> = {};
    let active = 0;
    for (const s of squares) {
      if (!s.is_active) continue;
      active++;
      byCat[s.category] = (byCat[s.category] ?? 0) + 1;
    }
    return { byCat, active };
  }, [squares]);

  async function handleSaveSquare() {
    if (!editor || !id) return;
    const payload = {
      game_id: id,
      text: editor.text.trim(),
      category: editor.category,
      difficulty: parseInt(editor.difficulty, 10) || 1,
      is_active: editor.is_active,
    };
    if (!payload.text || !payload.category) return;
    if (editor.id) {
      await supabase.from('bingo_squares').update(payload).eq('id', editor.id);
    } else {
      await supabase
        .from('bingo_squares')
        .insert({ ...payload, display_order: squares.length });
    }
    setEditor(null);
    await loadSquares();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    await supabase.from('bingo_squares').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    await loadSquares();
  }

  function handlePreview() {
    if (!game) return;
    const activePool: BingoSquare[] = squares
      .filter((s) => s.is_active)
      .map((s) => ({ id: s.id, text: s.text, category: s.category, difficulty: s.difficulty }));
    const need = game.board_size * game.board_size - 1;
    if (activePool.length < need) {
      setPreviewError(`Need at least ${need} active squares to build a board (have ${activePool.length}).`);
      setPreview(null);
      return;
    }
    const config: BoardConfig = {
      boardSize: game.board_size,
      hardCap: game.hard_cap,
      freeSpaceLabel: game.free_space_label,
      categories: game.categories,
    };
    const seed = `preview-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    setPreviewError(null);
    setPreview(buildBoard(config, activePool, seed));
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.loadingText}>Loading squares...</Text>
      </View>
    );
  }

  return (
    <AdminPageShell
      title={game ? `Squares — ${game.title}` : 'Squares'}
      subtitle={`${squares.length} squares · ${counts.active} active`}
      backHref={`/admin/bingo-games/${id}`}
      actions={
        <>
          <AdminButton label="Preview board" variant="secondary" icon="grid-view" onPress={handlePreview} />
          <AdminButton label="Add square" icon="add" onPress={() => setEditor({ ...EMPTY_EDIT })} />
        </>
      }
    >
      {/* Category minimum guidance */}
      {game && game.categories.length > 0 && (
        <View style={styles.minRow}>
          {game.categories.map((c) => {
            const have = counts.byCat[c.key] ?? 0;
            const ok = have >= (c.min ?? 0);
            return (
              <View key={c.key} style={styles.minChip}>
                <Text style={[styles.minChipText, { color: ok ? colors.primary : colors.error }]}>
                  {c.label}: {have}/{c.min ?? 0}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      <View style={styles.filtersRow}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search squares..."
          placeholderTextColor={colors.outlineVariant}
        />
        <View style={styles.selectWrap}>
          <select value={categoryFilter} onChange={(e: any) => setCategoryFilter(e.target.value)} style={selectStyle(colors)}>
            <option value="">All categories</option>
            {categoryOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </View>
        <View style={styles.selectWrap}>
          <select value={difficultyFilter} onChange={(e: any) => setDifficultyFilter(e.target.value)} style={selectStyle(colors)}>
            <option value="">All difficulty</option>
            {DIFFICULTY_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </View>
      </View>

      <View style={styles.table}>
        {filtered.map((s) => (
          <Pressable key={s.id} style={styles.row} onPress={() => setEditor({ id: s.id, text: s.text, category: s.category, difficulty: String(s.difficulty), is_active: s.is_active })}>
            <Text style={styles.rowText} numberOfLines={1}>
              {s.text}
            </Text>
            <Text style={styles.rowMeta}>{s.category}</Text>
            <Text style={styles.rowMeta}>d{s.difficulty}</Text>
            {!s.is_active && <Text style={styles.inactive}>inactive</Text>}
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                setDeleteTarget(s);
              }}
            >
              <MaterialIcons name="delete-outline" size={18} color={colors.error} />
            </Pressable>
          </Pressable>
        ))}
        {filtered.length === 0 && <Text style={styles.empty}>No squares match.</Text>}
      </View>

      {/* Square editor */}
      <Modal
        visible={!!editor}
        onClose={() => setEditor(null)}
        title={editor?.id ? 'Edit square' : 'Add square'}
        maxWidth={520}
        actions={
          <>
            <Button label="Cancel" variant="secondary" onPress={() => setEditor(null)} />
            <Button label="Save" variant="primary" onPress={handleSaveSquare} />
          </>
        }
      >
        {editor && (
          <View style={{ gap: spacing.md, width: '100%' }}>
            <TextField
              label="Text"
              value={editor.text}
              onChangeText={(v) => setEditor({ ...editor, text: v })}
              placeholder="Day drink at the Horn"
              hint="Aim for ~15–29 characters, imperative phrasing."
            />
            <FormRow>
              <FormColumn>
                <SelectField
                  label="Category"
                  value={editor.category}
                  onValueChange={(v) => setEditor({ ...editor, category: v })}
                  options={categoryOptions}
                  required
                />
              </FormColumn>
              <FormColumn>
                <SelectField
                  label="Difficulty"
                  value={editor.difficulty}
                  onValueChange={(v) => setEditor({ ...editor, difficulty: v })}
                  options={DIFFICULTY_OPTIONS}
                />
              </FormColumn>
            </FormRow>
            <CheckboxField
              label="Active"
              value={editor.is_active}
              onValueChange={(v) => setEditor({ ...editor, is_active: v })}
              hint="Only active squares are drawn onto boards."
            />
          </View>
        )}
      </Modal>

      {/* Board preview */}
      <Modal
        visible={!!preview || !!previewError}
        onClose={() => {
          setPreview(null);
          setPreviewError(null);
        }}
        title="Sample board"
        maxWidth={520}
        actions={
          <>
            <Button label="Reshuffle" variant="secondary" onPress={handlePreview} />
            <Button
              label="Close"
              variant="primary"
              onPress={() => {
                setPreview(null);
                setPreviewError(null);
              }}
            />
          </>
        }
      >
        {previewError ? (
          <Text style={styles.previewError}>{previewError}</Text>
        ) : preview && game ? (
          <View style={{ width: '100%' }}>
            <BingoGrid cells={preview} boardSize={game.board_size} marked={[]} categories={game.categories} readOnly />
          </View>
        ) : null}
      </Modal>

      <AdminConfirmDialog
        visible={!!deleteTarget}
        title="Delete square"
        message={`Delete "${deleteTarget?.text}"?`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminPageShell>
  );
}

function selectStyle(colors: ThemeColors) {
  return {
    padding: '8px 12px',
    fontSize: 13,
    fontFamily: 'inherit',
    border: 'none',
    backgroundColor: 'transparent',
    color: colors.neutral,
    outline: 'none',
    cursor: 'pointer',
    width: '100%',
  } as const;
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    loadingText: { fontFamily: fonts.sans, fontSize: 14, color: colors.neutralVariant },
    minRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md },
    minChip: {
      backgroundColor: colors.surfaceContainer,
      borderRadius: radii.pill,
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
    },
    minChipText: { fontFamily: fonts.sansMedium, fontSize: fontSize.sm },
    filtersRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg, flexWrap: 'wrap' },
    searchInput: {
      flex: 1,
      minWidth: 200,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: 8,
      fontFamily: fonts.sans,
      fontSize: 13,
      color: colors.neutral,
    },
    selectWrap: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.sm,
      overflow: 'hidden',
      minWidth: 150,
    },
    table: {
      borderWidth: 1,
      borderColor: colors.outlineVariant,
      borderRadius: radii.sm,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.outlineVariant,
      backgroundColor: colors.surface,
    },
    rowText: { flex: 1, fontFamily: fonts.sansMedium, fontSize: 13, color: colors.neutral },
    rowMeta: { fontFamily: fonts.sans, fontSize: 12, color: colors.neutralVariant, width: 60 },
    inactive: { fontFamily: fonts.sans, fontSize: 11, color: colors.error },
    empty: { fontFamily: fonts.sans, fontSize: 13, color: colors.neutralVariant, padding: spacing.lg },
    previewError: { fontFamily: fonts.sans, fontSize: 14, color: colors.error },
  });

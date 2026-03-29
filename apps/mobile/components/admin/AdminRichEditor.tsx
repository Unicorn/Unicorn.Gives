/**
 * TipTap WYSIWYG editor — web-only admin component.
 *
 * Outputs HTML for storage in Supabase `body` columns.
 * Toolbar: bold, italic, headings, lists, links, code blocks.
 */
import { useMemo, type ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme, fonts, spacing, radii, type ThemeColors } from '@/constants/theme';

// TipTap — web-only imports
let useEditor: any;
let EditorContent: any;
let StarterKit: any;
let LinkExtension: any;
let ImageExtension: any;
let PlaceholderExtension: any;

if (Platform.OS === 'web') {
  try {
    const tiptapReact = require('@tiptap/react');
    useEditor = tiptapReact.useEditor;
    EditorContent = tiptapReact.EditorContent;
    StarterKit = require('@tiptap/starter-kit').default;
    LinkExtension = require('@tiptap/extension-link').default;
    ImageExtension = require('@tiptap/extension-image').default;
    PlaceholderExtension = require('@tiptap/extension-placeholder').default;
  } catch {
    // Graceful fallback if TipTap is not installed
  }
}

interface AdminRichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  label?: string;
  /** Shown on the same row as the label (e.g. admin AI actions). Web-only callers typical. */
  headerRight?: ReactNode;
}

export function AdminRichEditor({
  value,
  onChange,
  placeholder = 'Write content...',
  label,
  headerRight,
}: AdminRichEditorProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (Platform.OS !== 'web' || !useEditor || !EditorContent) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>
          Rich text editor is only available on web.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.field}>
      {(label || headerRight) && (
        <View style={styles.labelRow}>
          {label ? <Text style={styles.label}>{label}</Text> : <View />}
          {headerRight}
        </View>
      )}
      <TipTapEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        colors={colors}
        styles={styles}
      />
    </View>
  );
}

/* ── Inner editor component (web only) ── */

function TipTapEditor({
  value,
  onChange,
  placeholder,
  colors,
  styles,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder: string;
  colors: ThemeColors;
  styles: ReturnType<typeof createStyles>;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      ImageExtension,
      PlaceholderExtension.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor: e }: any) => {
      onChange(e.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'admin-rich-editor-content',
        style: `
          min-height: 200px;
          padding: 12px;
          outline: none;
          font-family: Manrope_400Regular, system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: ${colors.neutral};
        `,
      },
    },
  });

  if (!editor) return null;

  return (
    <View style={styles.editorWrapper}>
      {/* Toolbar */}
      <View style={styles.toolbar}>
        <ToolbarGroup>
          <ToolbarBtn
            icon="format-bold"
            active={editor.isActive('bold')}
            onPress={() => editor.chain().focus().toggleBold().run()}
            colors={colors}
            styles={styles}
          />
          <ToolbarBtn
            icon="format-italic"
            active={editor.isActive('italic')}
            onPress={() => editor.chain().focus().toggleItalic().run()}
            colors={colors}
            styles={styles}
          />
          <ToolbarBtn
            icon="strikethrough-s"
            active={editor.isActive('strike')}
            onPress={() => editor.chain().focus().toggleStrike().run()}
            colors={colors}
            styles={styles}
          />
        </ToolbarGroup>

        <View style={styles.toolbarDivider} />

        <ToolbarGroup>
          <ToolbarBtn
            label="H2"
            active={editor.isActive('heading', { level: 2 })}
            onPress={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            colors={colors}
            styles={styles}
          />
          <ToolbarBtn
            label="H3"
            active={editor.isActive('heading', { level: 3 })}
            onPress={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            colors={colors}
            styles={styles}
          />
          <ToolbarBtn
            label="H4"
            active={editor.isActive('heading', { level: 4 })}
            onPress={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            colors={colors}
            styles={styles}
          />
        </ToolbarGroup>

        <View style={styles.toolbarDivider} />

        <ToolbarGroup>
          <ToolbarBtn
            icon="format-list-bulleted"
            active={editor.isActive('bulletList')}
            onPress={() => editor.chain().focus().toggleBulletList().run()}
            colors={colors}
            styles={styles}
          />
          <ToolbarBtn
            icon="format-list-numbered"
            active={editor.isActive('orderedList')}
            onPress={() => editor.chain().focus().toggleOrderedList().run()}
            colors={colors}
            styles={styles}
          />
        </ToolbarGroup>

        <View style={styles.toolbarDivider} />

        <ToolbarGroup>
          <ToolbarBtn
            icon="code"
            active={editor.isActive('codeBlock')}
            onPress={() => editor.chain().focus().toggleCodeBlock().run()}
            colors={colors}
            styles={styles}
          />
          <ToolbarBtn
            icon="format-quote"
            active={editor.isActive('blockquote')}
            onPress={() => editor.chain().focus().toggleBlockquote().run()}
            colors={colors}
            styles={styles}
          />
          <ToolbarBtn
            icon="link"
            active={editor.isActive('link')}
            onPress={() => {
              if (editor.isActive('link')) {
                editor.chain().focus().unsetLink().run();
              } else {
                const url = window.prompt('Enter URL:');
                if (url) {
                  editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
                }
              }
            }}
            colors={colors}
            styles={styles}
          />
        </ToolbarGroup>
      </View>

      {/* Editor content */}
      <View style={styles.editorContent}>
        <EditorContent editor={editor} />
      </View>
    </View>
  );
}

/* ── Toolbar helpers ── */

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', gap: 2 }}>{children}</View>;
}

function ToolbarBtn({
  icon,
  label,
  active,
  onPress,
  colors,
  styles,
}: {
  icon?: keyof typeof MaterialIcons.glyphMap;
  label?: string;
  active: boolean;
  onPress: () => void;
  colors: ThemeColors;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <Pressable
      style={[styles.toolbarBtn, active && styles.toolbarBtnActive]}
      onPress={onPress}
    >
      {icon ? (
        <MaterialIcons
          name={icon}
          size={16}
          color={active ? colors.primary : colors.neutralVariant}
        />
      ) : (
        <Text
          style={[
            styles.toolbarBtnLabel,
            { color: active ? colors.primary : colors.neutralVariant },
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

/* ── Styles ── */

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    field: {
      gap: 4,
      marginBottom: spacing.md,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.sm,
      marginBottom: 4,
    },
    label: {
      fontFamily: fonts.sansMedium,
      fontSize: 13,
      color: colors.neutral,
      flexShrink: 1,
    },
    editorWrapper: {
      borderWidth: 1,
      borderColor: colors.outline,
      borderRadius: radii.sm,
      overflow: 'hidden',
      backgroundColor: colors.surface,
    },
    toolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.sm,
      paddingVertical: 6,
      backgroundColor: colors.surfaceContainer,
      borderBottomWidth: 1,
      borderBottomColor: colors.outlineVariant,
      flexWrap: 'wrap',
    },
    toolbarDivider: {
      width: 1,
      height: 20,
      backgroundColor: colors.outlineVariant,
      marginHorizontal: 4,
    },
    toolbarBtn: {
      width: 28,
      height: 28,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    toolbarBtnActive: {
      backgroundColor: colors.primaryContainer,
    },
    toolbarBtnLabel: {
      fontFamily: fonts.sansBold,
      fontSize: 11,
    },
    editorContent: {
      minHeight: 200,
    },
    fallback: {
      padding: spacing.xl,
      backgroundColor: colors.surfaceContainer,
      borderRadius: radii.sm,
      alignItems: 'center',
    },
    fallbackText: {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: colors.neutralVariant,
    },
  });

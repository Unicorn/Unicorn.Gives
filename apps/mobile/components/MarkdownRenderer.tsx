import { Text, StyleSheet, View, Linking } from 'react-native';

/**
 * Lightweight markdown-to-RN renderer. Handles headings, paragraphs,
 * bold, italic, links, lists, and horizontal rules. Good enough for
 * our content bodies; we can swap in a full library later.
 */
export function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null;
  const blocks = content.split('\n\n');

  return (
    <View style={styles.container}>
      {blocks.map((block) => (
        <Block key={stableKey(block)} text={block.trim()} />
      ))}
    </View>
  );
}

function Block({ text }: { text: string }) {
  if (!text) return null;

  // Headings
  const h3 = text.match(/^###\s+(.+)/);
  if (h3) return <Text style={styles.h3}>{renderInline(h3[1])}</Text>;
  const h2 = text.match(/^##\s+(.+)/);
  if (h2) return <Text style={styles.h2}>{renderInline(h2[1])}</Text>;
  const h1 = text.match(/^#\s+(.+)/);
  if (h1) return <Text style={styles.h1}>{renderInline(h1[1])}</Text>;

  // Horizontal rule
  if (/^---+$/.test(text)) return <View style={styles.hr} />;

  // List (unordered)
  if (text.match(/^[-*]\s/m)) {
    const items = text.split('\n').filter(l => l.match(/^[-*]\s/));
    return (
      <View style={styles.list}>
        {items.map((item) => (
          <View key={stableKey(item)} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listText}>{renderInline(item.replace(/^[-*]\s+/, ''))}</Text>
          </View>
        ))}
      </View>
    );
  }

  // Ordered list
  if (text.match(/^\d+\.\s/m)) {
    const items = text.split('\n').filter(l => l.match(/^\d+\.\s/));
    return (
      <View style={styles.list}>
        {items.map((item, i) => (
          <View key={stableKey(item)} style={styles.listItem}>
            <Text style={styles.bullet}>{i + 1}.</Text>
            <Text style={styles.listText}>{renderInline(item.replace(/^\d+\.\s+/, ''))}</Text>
          </View>
        ))}
      </View>
    );
  }

  // Paragraph (may contain multiple lines)
  const lines = text.split('\n');
  return (
    <Text style={styles.paragraph}>
      {lines.map((line) => (
        <Text key={stableKey(line)}>
          {line ? null : null}
          {renderInline(line)}
        </Text>
      ))}
    </Text>
  );
}

function stableKey(input: string): string {
  const t = input.trim();
  // Simple deterministic key to avoid React index keys.
  // Content may repeat across documents, but this is sufficient for our CMS markdown.
  let hash = 0;
  for (let i = 0; i < t.length; i++) hash = (hash * 31 + t.charCodeAt(i)) >>> 0;
  return `${t.slice(0, 24)}-${hash}`;
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) {
        parts.push(<Text key={key++}>{remaining.slice(0, boldMatch.index)}</Text>);
      }
      parts.push(<Text key={key++} style={styles.bold}>{boldMatch[1]}</Text>);
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      continue;
    }

    // Italic
    const italicMatch = remaining.match(/\*(.+?)\*/);
    if (italicMatch && italicMatch.index !== undefined) {
      if (italicMatch.index > 0) {
        parts.push(<Text key={key++}>{remaining.slice(0, italicMatch.index)}</Text>);
      }
      parts.push(<Text key={key++} style={styles.italic}>{italicMatch[1]}</Text>);
      remaining = remaining.slice(italicMatch.index + italicMatch[0].length);
      continue;
    }

    // Link
    const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);
    if (linkMatch && linkMatch.index !== undefined) {
      if (linkMatch.index > 0) {
        parts.push(<Text key={key++}>{remaining.slice(0, linkMatch.index)}</Text>);
      }
      const rawUrl = linkMatch[2];
      const url = normalizeMarkdownUrl(rawUrl);
      parts.push(
        <Text
          key={key++}
          style={styles.link}
          onPress={() => Linking.openURL(url)}
        >
          {linkMatch[1]}
        </Text>
      );
      remaining = remaining.slice(linkMatch.index + linkMatch[0].length);
      continue;
    }

    // Plain text
    parts.push(<Text key={key++}>{remaining}</Text>);
    break;
  }

  return parts;
}

function normalizeMarkdownUrl(rawUrl: string): string {
  // Preserve common schemes and fragments.
  if (
    rawUrl.startsWith('http://') ||
    rawUrl.startsWith('https://') ||
    rawUrl.startsWith('mailto:') ||
    rawUrl.startsWith('tel:') ||
    rawUrl.startsWith('#')
  ) {
    return rawUrl;
  }

  // In our legacy markdown, many asset links are written like `docs/foo.pdf`
  // (no leading `/`). On web, those can resolve incorrectly relative to the
  // current route, so we force them to root-relative.
  if (rawUrl.startsWith('/')) return rawUrl;
  return '/' + rawUrl;
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  h1: { fontSize: 28, fontWeight: '800', color: '#2d4a4a', marginTop: 8 },
  h2: { fontSize: 22, fontWeight: '700', color: '#2d4a4a', marginTop: 8 },
  h3: { fontSize: 18, fontWeight: '700', color: '#356565', marginTop: 4 },
  paragraph: { fontSize: 15, lineHeight: 24, color: '#43493e' },
  bold: { fontWeight: '700' },
  italic: { fontStyle: 'italic' },
  link: { color: '#3d6060', textDecorationLine: 'underline' },
  hr: { height: 1, backgroundColor: '#c3c8bb', marginVertical: 8 },
  list: { gap: 4, paddingLeft: 4 },
  listItem: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  bullet: { fontSize: 15, color: '#73796d', width: 16 },
  listText: { flex: 1, fontSize: 15, lineHeight: 24, color: '#43493e' },
});

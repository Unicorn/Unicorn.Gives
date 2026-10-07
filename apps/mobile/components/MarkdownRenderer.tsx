import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Linking, Platform, Text, View } from "react-native";
import { fonts, letterSpacing, spacing, useTheme } from "@/constants/theme";
import { contentPathToAppHref, toHref } from "@/lib/navigation";
import { detectContentFormat } from "@/lib/contentFormat";

/**
 * Long-form content is capped to a readable column. Body text here was running
 * the full container width — measured at ~124 characters per line on a meeting
 * minutes page, against a 65–75 character target. At 15px this lands around 68.
 */
const READING_MEASURE = 660;

/**
 * Lightweight content renderer. Handles both markdown (legacy seeded content)
 * and HTML (content saved from the TipTap admin editor).
 *
 * For markdown: custom parser with headings, paragraphs, bold, italic, links, lists, and HRs.
 * For HTML on web: renders via dangerouslySetInnerHTML with scoped styles.
 * For HTML on native: strips tags and falls back to plain text (swap for a proper HTML renderer later).
 */
export function MarkdownRenderer({ content }: { content: string }) {
	const { colors } = useTheme();
	const router = useRouter();

	if (!content) return null;

	// If content is HTML (from the admin editor), render it differently
	if (detectContentFormat(content) === "html") {
		if (Platform.OS === "web") {
			return (
				<View style={{ gap: spacing.md, maxWidth: READING_MEASURE, width: "100%" as any }}>
					<div
						className="cms-html-content"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: admin-authored HTML content
						dangerouslySetInnerHTML={{ __html: content }}
						style={{
							fontFamily: "Manrope_400Regular, system-ui, sans-serif",
							fontSize: 15,
							lineHeight: 1.6,
							color: colors.neutral,
						}}
					/>
					<style>{`
						/* More space above a heading than below it, so a heading groups with
						   the text it introduces rather than floating between blocks. */
						.cms-html-content h1 { font-family: Newsreader_700Bold, Georgia, serif; font-size: 30px; line-height: 1.2; margin: 32px 0 10px; letter-spacing: -0.5px; }
						.cms-html-content h2 { font-family: Newsreader_700Bold, Georgia, serif; font-size: 24px; line-height: 1.25; margin: 28px 0 8px; letter-spacing: -0.4px; color: ${colors.neutral}; }
						.cms-html-content h3 { font-size: 18px; font-weight: 700; margin: 24px 0 6px; color: ${colors.neutral}; }
						.cms-html-content h4 { font-size: 16px; font-weight: 700; margin: 20px 0 4px; }
						.cms-html-content > *:first-child { margin-top: 0; }
						.cms-html-content p { margin: 0 0 12px; }
						.cms-html-content ul, .cms-html-content ol { padding-left: 24px; margin: 0 0 12px; }
						.cms-html-content li { margin-bottom: 4px; }
						.cms-html-content a { color: ${colors.primary}; text-decoration: underline; }
						.cms-html-content blockquote { border-left: 1px solid ${colors.outline}; padding-left: 20px; margin: 16px 0; color: ${colors.neutralVariant}; font-style: italic; }
						.cms-html-content pre { background: ${colors.surfaceContainer}; padding: 12px; border-radius: 8px; overflow-x: auto; font-size: 13px; }
						.cms-html-content code { background: ${colors.surfaceContainer}; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
						.cms-html-content hr { border: none; border-top: 1px solid ${colors.outline}; margin: 12px 0; }
						.cms-html-content img { max-width: 100%; border-radius: 8px; }
						/* Tables had no rules at all, so columns collided — the dog licence
						   fee table was unreadable. */
						.cms-html-content table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
						.cms-html-content th, .cms-html-content td { padding: 8px 12px; text-align: left; border-bottom: 1px solid ${colors.outlineVariant}; vertical-align: top; }
						.cms-html-content th { font-weight: 700; color: ${colors.neutral}; border-bottom-color: ${colors.outline}; white-space: nowrap; }
						.cms-html-content td:not(:first-child), .cms-html-content th:not(:first-child) { font-variant-numeric: tabular-nums; }
						.cms-html-content tr:last-child td { border-bottom: none; }
						.cms-html-content strong { font-weight: 700; }
						.cms-html-content em { font-style: italic; }
					`}</style>
				</View>
			);
		}

		// Native fallback: strip HTML tags and render as plain text
		const plainText = content.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
		return (
			<View style={{ gap: spacing.md, maxWidth: READING_MEASURE }}>
				<Text style={{ fontSize: 15, fontFamily: fonts.sans, lineHeight: 24, color: colors.neutral }}>
					{plainText}
				</Text>
			</View>
		);
	}

	const openMarkdownUrl = useCallback(
		(rawUrl: string) => {
			const normalized = normalizeMarkdownUrl(rawUrl);
			if (
				normalized.startsWith("http://") ||
				normalized.startsWith("https://") ||
				normalized.startsWith("mailto:") ||
				normalized.startsWith("tel:") ||
				normalized.startsWith("#")
			) {
				void Linking.openURL(normalized);
				return;
			}

			const mapped = contentPathToAppHref(normalized);
			if (mapped != null) {
				router.push(mapped);
				return;
			}

			if (normalized.startsWith("/")) {
				router.push(toHref(normalized));
				return;
			}

			void Linking.openURL(normalized);
		},
		[router],
	);

	if (!content) return null;
	const blocks = content.split("\n\n");

	return (
		<View style={{ gap: spacing.md, maxWidth: READING_MEASURE, width: "100%" as any }}>
			{blocks.map((block) => (
				<Block
					key={stableKey(block)}
					text={block.trim()}
					colors={colors}
					onPressLink={openMarkdownUrl}
				/>
			))}
		</View>
	);
}

function Block({
	text,
	colors,
	onPressLink,
}: {
	text: string;
	colors: ReturnType<typeof useTheme>["colors"];
	onPressLink: (rawUrl: string) => void;
}) {
	if (!text) return null;

	// Headings
	const h3 = text.match(/^###\s+(.+)/);
	if (h3)
		return (
			<Text
				style={{
					fontSize: 18,
					fontFamily: fonts.sansBold,
					// Neutral, not teal: a heading is not an interactive element.
					color: colors.neutral,
					marginTop: spacing.lg,
				}}
			>
				{renderInline(h3[1], colors, onPressLink)}
			</Text>
		);
	const h2 = text.match(/^##\s+(.+)/);
	if (h2)
		return (
			<Text
				style={{
					fontSize: 24,
					lineHeight: 30,
					fontFamily: fonts.serifBold,
					letterSpacing: letterSpacing.display,
					color: colors.neutral,
					// More space above a heading than below it; the parent View
					// supplies the smaller gap underneath.
					marginTop: spacing.xl,
				}}
			>
				{renderInline(h2[1], colors, onPressLink)}
			</Text>
		);
	const h1 = text.match(/^#\s+(.+)/);
	if (h1)
		return (
			<Text
				style={{
					fontSize: 30,
					lineHeight: 36,
					fontFamily: fonts.serifBold,
					letterSpacing: letterSpacing.display,
					color: colors.neutral,
					marginTop: spacing.xxl,
				}}
			>
				{renderInline(h1[1], colors, onPressLink)}
			</Text>
		);

	// Horizontal rule
	if (/^---+$/.test(text))
		return (
			<View
				style={{
					height: 1,
					backgroundColor: colors.outline,
					marginVertical: spacing.sm,
				}}
			/>
		);

	// List (unordered)
	if (text.match(/^[-*]\s/m)) {
		const items = text.split("\n").filter((l) => l.match(/^[-*]\s/));
		return (
			<View style={{ gap: spacing.xs, paddingLeft: spacing.xs }}>
				{items.map((item) => (
					<View
						key={stableKey(item)}
						style={{
							flexDirection: "row",
							gap: spacing.sm,
							alignItems: "flex-start",
						}}
					>
						<Text
							style={{
								fontSize: 15,
								fontFamily: fonts.sans,
								color: colors.neutralVariant,
								width: 16,
							}}
						>
							•
						</Text>
						<Text
							style={{
								flex: 1,
								fontSize: 15,
								fontFamily: fonts.sans,
								lineHeight: 24,
								color: colors.neutral,
							}}
						>
							{renderInline(item.replace(/^[-*]\s+/, ""), colors, onPressLink)}
						</Text>
					</View>
				))}
			</View>
		);
	}

	// Ordered list
	if (text.match(/^\d+\.\s/m)) {
		const items = text.split("\n").filter((l) => l.match(/^\d+\.\s/));
		return (
			<View style={{ gap: spacing.xs, paddingLeft: spacing.xs }}>
				{items.map((item, i) => (
					<View
						key={stableKey(item)}
						style={{
							flexDirection: "row",
							gap: spacing.sm,
							alignItems: "flex-start",
						}}
					>
						<Text
							style={{
								fontSize: 15,
								fontFamily: fonts.sans,
								color: colors.neutralVariant,
								width: 16,
							}}
						>
							{i + 1}.
						</Text>
						<Text
							style={{
								flex: 1,
								fontSize: 15,
								fontFamily: fonts.sans,
								lineHeight: 24,
								color: colors.neutral,
							}}
						>
							{renderInline(item.replace(/^\d+\.\s+/, ""), colors, onPressLink)}
						</Text>
					</View>
				))}
			</View>
		);
	}

	// Paragraph (may contain multiple lines)
	const lines = text.split("\n");
	return (
		<Text
			style={{
				fontSize: 15,
				fontFamily: fonts.sans,
				lineHeight: 24,
				color: colors.neutral,
			}}
		>
			{lines.map((line) => (
				<Text key={stableKey(line)}>
					{line ? null : null}
					{renderInline(line, colors, onPressLink)}
				</Text>
			))}
		</Text>
	);
}

function stableKey(input: string): string {
	const t = input.trim();
	let hash = 0;
	for (let i = 0; i < t.length; i++) hash = (hash * 31 + t.charCodeAt(i)) >>> 0;
	return `${t.slice(0, 24)}-${hash}`;
}

function renderInline(
	text: string,
	colors: ReturnType<typeof useTheme>["colors"],
	onPressLink: (rawUrl: string) => void,
): React.ReactNode[] {
	const parts: React.ReactNode[] = [];
	let remaining = text;
	let key = 0;

	while (remaining.length > 0) {
		const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
		if (boldMatch && boldMatch.index !== undefined) {
			if (boldMatch.index > 0) {
				parts.push(
					<Text key={key++}>{remaining.slice(0, boldMatch.index)}</Text>,
				);
			}
			parts.push(
				<Text key={key++} style={{ fontFamily: fonts.sansBold }}>
					{boldMatch[1]}
				</Text>,
			);
			remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
			continue;
		}

		const italicMatch = remaining.match(/\*(.+?)\*/);
		if (italicMatch && italicMatch.index !== undefined) {
			if (italicMatch.index > 0) {
				parts.push(
					<Text key={key++}>{remaining.slice(0, italicMatch.index)}</Text>,
				);
			}
			parts.push(
				<Text key={key++} style={{ fontStyle: "italic" }}>
					{italicMatch[1]}
				</Text>,
			);
			remaining = remaining.slice(italicMatch.index + italicMatch[0].length);
			continue;
		}

		const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);
		if (linkMatch && linkMatch.index !== undefined) {
			if (linkMatch.index > 0) {
				parts.push(
					<Text key={key++}>{remaining.slice(0, linkMatch.index)}</Text>,
				);
			}
			const rawUrl = linkMatch[2];
			parts.push(
				<Text
					key={key++}
					style={{ color: colors.primary, textDecorationLine: "underline" }}
					onPress={() => onPressLink(rawUrl)}
				>
					{linkMatch[1]}
				</Text>,
			);
			remaining = remaining.slice(linkMatch.index + linkMatch[0].length);
			continue;
		}

		parts.push(<Text key={key++}>{remaining}</Text>);
		break;
	}

	return parts;
}

function normalizeMarkdownUrl(rawUrl: string): string {
	if (
		rawUrl.startsWith("http://") ||
		rawUrl.startsWith("https://") ||
		rawUrl.startsWith("mailto:") ||
		rawUrl.startsWith("tel:") ||
		rawUrl.startsWith("#")
	) {
		return rawUrl;
	}

  if (rawUrl.startsWith("/")) return rawUrl;
  return `/${rawUrl}`;
}

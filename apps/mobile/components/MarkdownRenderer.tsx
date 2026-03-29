import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Linking, Text, View } from "react-native";
import { fonts, spacing, useTheme } from "@/constants/theme";
import { contentPathToAppHref, toHref } from "@/lib/navigation";

/**
 * Lightweight markdown-to-RN renderer. Handles headings, paragraphs,
 * bold, italic, links, lists, and horizontal rules. Good enough for
 * our content bodies; we can swap in a full library later.
 */
export function MarkdownRenderer({ content }: { content: string }) {
	const { colors } = useTheme();
	const router = useRouter();

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
		<View style={{ gap: spacing.md }}>
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
					color: colors.primary,
					marginTop: spacing.xs,
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
					fontSize: 22,
					fontFamily: fonts.sansBold,
					color: colors.neutral,
					marginTop: spacing.sm,
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
					fontSize: 28,
					fontFamily: fonts.sansBold,
					color: colors.neutral,
					marginTop: spacing.sm,
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

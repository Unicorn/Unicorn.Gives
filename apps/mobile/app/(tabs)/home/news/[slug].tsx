import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Linking,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { Container } from "@/components/layout/Container";
import { DetailEditBar } from "@/components/layout/DetailEditBar";
import { Wrapper } from "@/components/layout/Wrapper";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { radii, spacing, useTheme } from "@/constants/theme";
import { routes } from "@/lib/navigation";
import { supabase } from "@/lib/supabase";

interface NewsArticle {
	id: string;
	title: string;
	date: string;
	category: string;
	description: string | null;
	body: string;
	author_name: string | null;
	source: string | null;
	source_url: string | null;
}

function normalizeSlug(
	param: string | string[] | undefined,
): string | undefined {
	if (param === undefined) return undefined;
	return Array.isArray(param) ? param[0] : param;
}

export default function NewsArticleDetail() {
	const { colors, typography } = useTheme();
	const rawSlug = useLocalSearchParams<{ slug: string | string[] }>().slug;
	const slug = normalizeSlug(rawSlug);

	const [item, setItem] = useState<NewsArticle | null>(null);
	const [phase, setPhase] = useState<"loading" | "done">("loading");

	useEffect(() => {
		if (!slug) {
			setItem(null);
			setPhase("done");
			return;
		}

		setPhase("loading");
		let cancelled = false;

		void supabase
			.from("news")
			.select(
				"id, title, date, category, description, body, author_name, source, source_url",
			)
			.eq("slug", slug)
			.eq("status", "published")
			.in("visibility", ["global", "both"])
			.single()
			.then(({ data, error }) => {
				if (cancelled) return;
				setPhase("done");
				if (error || !data) {
					setItem(null);
					return;
				}
				setItem(data as NewsArticle);
			});

		return () => {
			cancelled = true;
		};
	}, [slug]);

	const styles = useMemo(() => createStyles(typography), [typography]);

	if (!slug || (phase === "done" && !item)) {
		return (
			<View style={[styles.centered, { backgroundColor: colors.background }]}>
				<Text style={[styles.message, { color: colors.neutralVariant }]}>
					{!slug
						? "This article link is invalid."
						: "We couldn't find that article. It may have been removed or isn't published yet."}
				</Text>
			</View>
		);
	}

	if (phase === "loading" || !item) {
		return (
			<View style={[styles.centered, { backgroundColor: colors.background }]}>
				<ActivityIndicator color={colors.primary} />
				<Text style={[styles.loadingLabel, { color: colors.neutralVariant }]}>
					Loading…
				</Text>
			</View>
		);
	}

	const categoryLabel = item.category.replace(/-/g, " ").toUpperCase();
	const formattedDate = new Date(`${item.date}T00:00:00`).toLocaleDateString(
		"en-US",
		{ weekday: "long", month: "long", day: "numeric", year: "numeric" },
	);

	return (
		<Wrapper contentContainerStyle={styles.content}>
			<Container>
				<DetailEditBar editHref={routes.admin.editNews(item.id)} />
				<Text style={[styles.category, { color: colors.neutralVariant }]}>
					{categoryLabel}
				</Text>
				<Text style={[styles.title, { color: colors.neutral }]}>
					{item.title}
				</Text>
				<View
					style={[styles.metaBox, { backgroundColor: colors.surfaceContainer }]}
				>
					<Text style={[styles.metaLabel, { color: colors.neutralVariant }]}>
						Date
					</Text>
					<Text style={[styles.metaValue, { color: colors.neutral }]}>
						{formattedDate}
					</Text>
					{item.author_name ? (
						<>
							<Text
								style={[styles.metaLabel, { color: colors.neutralVariant }]}
							>
								Author
							</Text>
							<Text style={[styles.metaValue, { color: colors.neutral }]}>
								{item.author_name}
							</Text>
						</>
					) : null}
					{item.source && item.source_url ? (
						<>
							<Text
								style={[styles.metaLabel, { color: colors.neutralVariant }]}
							>
								Source
							</Text>
							<Pressable
								onPress={() => {
									const url = item.source_url;
									if (url) void Linking.openURL(url);
								}}
								accessibilityRole="link"
							>
								<Text style={[styles.sourceLink, { color: colors.primary }]}>
									{item.source}
								</Text>
							</Pressable>
						</>
					) : null}
				</View>
				{item.description ? (
					<Text style={[styles.lede, { color: colors.neutral }]}>
						{item.description}
					</Text>
				) : null}
				<MarkdownRenderer content={item.body} />
			</Container>
		</Wrapper>
	);
}

const createStyles = (typography: ReturnType<typeof useTheme>["typography"]) =>
	StyleSheet.create({
		content: { padding: spacing.xl, paddingBottom: 60 },
		centered: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			padding: spacing.xl,
		},
		message: {
			...typography.body,
			textAlign: "center",
			lineHeight: 22,
		},
		loadingLabel: {
			marginTop: spacing.md,
			...typography.body,
		},
		category: {
			fontSize: 11,
			fontWeight: "700",
			letterSpacing: 0.5,
			marginBottom: spacing.xs,
		},
		title: {
			fontSize: 24,
			fontWeight: "800",
			marginBottom: spacing.lg,
		},
		metaBox: {
			borderRadius: radii.sm,
			padding: 14,
			marginBottom: spacing.xl,
			gap: spacing.xs,
		},
		metaLabel: {
			fontSize: 11,
			fontWeight: "700",
			textTransform: "uppercase",
			letterSpacing: 0.5,
			marginTop: 6,
		},
		metaValue: { fontSize: 15, fontWeight: "500" },
		sourceLink: {
			fontSize: 15,
			fontWeight: "600",
			textDecorationLine: "underline",
		},
		lede: {
			fontSize: 16,
			lineHeight: 24,
			marginBottom: spacing.lg,
		},
	});

import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Container } from "@/components/layout/Container";
import { Wrapper } from "@/components/layout/Wrapper";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { HeroFeature } from "@/components/widgets";
import { NEWS_TAB_HERO } from "@/constants/eventsTabContent";
import { radii, shadows, spacing, useTheme } from "@/constants/theme";
import { routes } from "@/lib/navigation";
import { supabase } from "@/lib/supabase";

interface NewsItem {
	id: string;
	slug: string;
	title: string;
	date: string;
	category: string;
	description: string | null;
}

export default function NewsTab() {
	const { colors } = useTheme();
	const [items, setItems] = useState<NewsItem[]>([]);

	useEffect(() => {
		supabase
			.from("news")
			.select("id, slug, title, date, category, description")
			.eq("status", "published")
			.in("visibility", ["global", "both"])
			.order("date", { ascending: false })
			.limit(50)
			.then(({ data }) => {
				if (data) setItems(data);
			});
	}, []);

	const styles = useMemo(() => createStyles(colors), [colors]);

	return (
		<Wrapper style={styles.container} contentContainerStyle={styles.content}>
			<Container>
				<View style={styles.stack}>
					<HeroFeature
						eyebrow={NEWS_TAB_HERO.eyebrow}
						title={NEWS_TAB_HERO.title}
						description={NEWS_TAB_HERO.description}
						ctaLabel={NEWS_TAB_HERO.ctaLabel}
						ctaHref={routes.community.events.index()}
						secondaryCta={{
							label: NEWS_TAB_HERO.secondaryCtaLabel,
							href: routes.partners.index("the-horn"),
						}}
					/>

					<View style={styles.listSection}>
						{items.map((n) => (
							<Link
								key={n.id}
								href={routes.community.news.detail(n.slug)}
								asChild
							>
								<AnimatedPressable variant="card" style={styles.card}>
									<Text style={styles.category}>
										{n.category.replace(/-/g, " ").toUpperCase()}
									</Text>
									<Text style={styles.title}>{n.title}</Text>
									{n.description && (
										<Text style={styles.desc} numberOfLines={2}>
											{n.description}
										</Text>
									)}
									<Text style={styles.date}>
										{new Date(`${n.date}T00:00:00`).toLocaleDateString(
											"en-US",
											{
												month: "short",
												day: "numeric",
												year: "numeric",
											},
										)}
									</Text>
								</AnimatedPressable>
							</Link>
						))}
						{items.length === 0 && (
							<Text style={styles.empty}>
								No published news items yet. Check back soon for civic updates.
							</Text>
						)}
					</View>
				</View>
			</Container>
		</Wrapper>
	);
}

const createStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
	StyleSheet.create({
		container: { flex: 1 },
		content: { padding: spacing.lg, paddingBottom: 40 },
		stack: { width: "100%", gap: spacing.xxxl + spacing.sm },
		listSection: { gap: spacing.sm },
		card: {
			borderRadius: radii.sm,
			padding: 14,
			backgroundColor: colors.surface,
			...shadows.card,
		},
		category: {
			fontSize: 11,
			fontWeight: "700",
			color: colors.neutralVariant,
			letterSpacing: 0.5,
			marginBottom: 4,
		},
		title: {
			fontSize: 16,
			fontWeight: "700",
			color: colors.neutral,
			marginBottom: 4,
		},
		desc: {
			fontSize: 14,
			color: colors.neutral,
			lineHeight: 20,
			marginBottom: 4,
		},
		date: { fontSize: 12, color: colors.neutralVariant },
		empty: { textAlign: "center", color: colors.neutralVariant, marginTop: 40 },
	});

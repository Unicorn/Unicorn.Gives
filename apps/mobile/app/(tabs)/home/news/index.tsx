import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ContentCoverImage } from "@/components/ContentCoverImage";
import { Container } from "@/components/layout/Container";
import { Wrapper } from "@/components/layout/Wrapper";
import { AnimatedPressable } from "@/components/ui/AnimatedPressable";
import { HeroFeature } from "@/components/widgets";
import { NEWS_TAB_HERO } from "@/constants/eventsTabContent";
import { fonts, fontSize, letterSpacing, radii, shadows, spacing, useTheme, type ThemeColors } from "@/constants/theme";
import { routes } from "@/lib/navigation";
import { supabase } from "@/lib/supabase";

interface NewsItem {
	id: string;
	slug: string;
	title: string;
	date: string;
	category: string;
	description: string | null;
	image_url: string | null;
}

export default function NewsTab() {
	const { colors } = useTheme();
	const [items, setItems] = useState<NewsItem[]>([]);

	useEffect(() => {
		supabase
			.from("news")
			.select("id, slug, title, date, category, description, image_url")
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
									<ContentCoverImage
										imageUrl={n.image_url}
										variant="card"
										accessibilityLabel={n.title}
									/>
									<View style={styles.cardBody}>
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
									</View>
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

const createStyles = (colors: ThemeColors) =>
	StyleSheet.create({
		container: { flex: 1 },
		content: { padding: spacing.lg, paddingBottom: spacing.xxxl + spacing.sm },
		stack: { width: "100%", gap: spacing.xxxl + spacing.sm },
		listSection: { gap: spacing.sm },
		card: {
			borderRadius: radii.sm,
			overflow: "hidden",
			backgroundColor: colors.surface,
			...shadows.card,
		},
		cardBody: {
			padding: spacing.lg - 2,
		},
		category: {
			fontFamily: fonts.sansBold,
			fontSize: fontSize.xs,
			color: colors.neutralVariant,
			letterSpacing: letterSpacing.normal,
			marginBottom: spacing.xs,
		},
		title: {
			fontFamily: fonts.sansBold,
			fontSize: fontSize.lg,
			color: colors.neutral,
			marginBottom: spacing.xs,
		},
		desc: {
			fontFamily: fonts.sans,
			fontSize: fontSize.md,
			color: colors.neutral,
			lineHeight: 20,
			marginBottom: spacing.xs,
		},
		date: { fontFamily: fonts.sans, fontSize: fontSize.sm, color: colors.neutralVariant },
		empty: { fontFamily: fonts.sans, textAlign: "center", color: colors.neutralVariant, marginTop: spacing.xxxl + spacing.sm },
	});

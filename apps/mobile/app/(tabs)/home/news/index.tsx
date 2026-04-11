import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Container } from "@/components/layout/Container";
import { Wrapper } from "@/components/layout/Wrapper";
import { RegionHeroSection } from "@/components/municipal/sections/RegionHeroSection";
import {
	EditorialCard,
	FeaturedContentCard,
} from "@/components/widgets";
import { NEWS_TAB_HERO } from "@/constants/eventsTabContent";
import { fonts, spacing, useTheme, type ThemeColors } from "@/constants/theme";
import { eventDateBoxFromIso } from "@/lib/events/eventDateFormat";
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
	featured: boolean | null;
}

export default function NewsTab() {
	const { colors } = useTheme();
	const [items, setItems] = useState<NewsItem[]>([]);

	useEffect(() => {
		supabase
			.from("news")
			.select("id, slug, title, date, category, description, image_url, featured")
			.eq("status", "published")
			.in("visibility", ["global", "both"])
			.order("date", { ascending: false })
			.limit(50)
			.then(({ data }) => {
				if (data) setItems(data);
			});
	}, []);

	const styles = useMemo(() => createStyles(colors), [colors]);

	const featuredItems = items.filter((n) => n.featured);
	const regularItems = items.filter((n) => !n.featured);

	return (
		<Wrapper style={styles.container} contentContainerStyle={styles.content}>
			<RegionHeroSection
				eyebrow={NEWS_TAB_HERO.eyebrow}
				headline={NEWS_TAB_HERO.title}
				subheadline={NEWS_TAB_HERO.description}
				primaryCta={{
					label: NEWS_TAB_HERO.ctaLabel,
					url: routes.community.events.index() as string,
				}}
				secondaryCta={{
					label: NEWS_TAB_HERO.secondaryCtaLabel,
					url: routes.partners.index("the-horn") as string,
				}}
			/>
			<Container style={styles.section}>
				<View style={styles.stack}>
					{featuredItems.map((n) => (
						<FeaturedContentCard
							key={n.id}
							href={routes.community.news.detail(n.slug)}
							title={n.title}
							description={n.description}
							date={n.date}
							category={n.category}
							imageUrl={n.image_url}
							ctaLabel="Read article"
						/>
					))}

					<View style={styles.listSection}>
						{regularItems.map((n) => (
							<EditorialCard
								key={n.id}
								title={n.title}
								description={n.description || undefined}
								href={routes.community.news.detail(n.slug)}
								dateBox={eventDateBoxFromIso(n.date)}
								thumbnailUrl={n.image_url}
								badge={{
									label: n.category.replace(/-/g, " "),
									bg: colors.surfaceContainer,
									text: colors.neutral,
								}}
							/>
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
		content: { paddingBottom: spacing.xxxl + spacing.sm },
		section: { paddingTop: spacing.xxl },
		stack: { width: "100%", gap: spacing.xxxl + spacing.sm },
		listSection: { gap: spacing.sm },
		empty: {
			fontFamily: fonts.sans,
			textAlign: "center",
			color: colors.neutralVariant,
			marginTop: spacing.xxxl + spacing.sm,
		},
	});

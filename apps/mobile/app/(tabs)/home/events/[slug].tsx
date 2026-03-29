import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ContentCoverImage } from "@/components/ContentCoverImage";
import { Container } from "@/components/layout/Container";
import { DetailEditBar } from "@/components/layout/DetailEditBar";
import { Wrapper } from "@/components/layout/Wrapper";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { fonts, fontSize, letterSpacing, radii, spacing, useTheme } from "@/constants/theme";
import { SeoHead } from "@/components/SeoHead";
import { routes } from "@/lib/navigation";
import { getDefaultDescription } from "@/lib/seo";
import { supabase } from "@/lib/supabase";
import { fetchHomeEventsSlugParams } from "@/lib/static-build-queries";

export async function generateStaticParams() {
	return fetchHomeEventsSlugParams();
}

interface EventRow {
	id: string;
	title: string;
	description: string | null;
	date: string;
	time: string | null;
	location: string | null;
	cost: string | null;
	recurring: boolean | null;
	recurrence_rule: string | null;
	body: string | null;
	image_url: string | null;
}

function normalizeSlug(
	param: string | string[] | undefined,
): string | undefined {
	if (param === undefined) return undefined;
	return Array.isArray(param) ? param[0] : param;
}

export default function EventDetail() {
	const { colors } = useTheme();
	const rawSlug = useLocalSearchParams<{ slug: string | string[] }>().slug;
	const slug = normalizeSlug(rawSlug);
	const [item, setItem] = useState<EventRow | null>(null);

	useEffect(() => {
		if (!slug) return;
		void supabase
			.from("events")
			.select(
				"id, title, description, date, time, location, cost, recurring, recurrence_rule, body, image_url",
			)
			.eq("slug", slug)
			.single()
			.then(({ data }) => {
				if (data) setItem(data as EventRow);
			});
	}, [slug]);

	if (!item) {
		return (
			<View style={{ flex: 1, backgroundColor: colors.background }}>
				<SeoHead
					title={slug ? `Events · ${slug}` : "Events"}
					description={getDefaultDescription()}
				/>
				<Text style={[styles.loading, { color: colors.neutralVariant }]}>
					Loading…
				</Text>
			</View>
		);
	}

	return (
		<Wrapper contentContainerStyle={styles.content}>
			<SeoHead
				title={item.title}
				description={item.description ?? undefined}
				imageUrl={item.image_url}
			/>
			<Container>
				<DetailEditBar editHref={routes.admin.editEvent(item.id)} />
				<ContentCoverImage
					imageUrl={item.image_url}
					variant="hero"
					accessibilityLabel={item.title}
					style={styles.heroImage}
				/>
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
						{new Date(`${item.date}T00:00:00`).toLocaleDateString("en-US", {
							weekday: "long",
							month: "long",
							day: "numeric",
							year: "numeric",
						})}
					</Text>
					{item.time ? (
						<>
							<Text
								style={[styles.metaLabel, { color: colors.neutralVariant }]}
							>
								Time
							</Text>
							<Text style={[styles.metaValue, { color: colors.neutral }]}>
								{item.time}
							</Text>
						</>
					) : null}
					{item.location ? (
						<>
							<Text
								style={[styles.metaLabel, { color: colors.neutralVariant }]}
							>
								Location
							</Text>
							<Text style={[styles.metaValue, { color: colors.neutral }]}>
								{item.location}
							</Text>
						</>
					) : null}
					{item.cost ? (
						<>
							<Text
								style={[styles.metaLabel, { color: colors.neutralVariant }]}
							>
								Cost
							</Text>
							<Text style={[styles.metaValue, { color: colors.neutral }]}>
								{item.cost}
							</Text>
						</>
					) : null}
					{item.recurring ? (
						<>
							<Text
								style={[styles.metaLabel, { color: colors.neutralVariant }]}
							>
								Recurrence
							</Text>
							<Text style={[styles.metaValue, { color: colors.neutral }]}>
								{item.recurrence_rule || "Recurring"}
							</Text>
						</>
					) : null}
				</View>
				<MarkdownRenderer content={item.body ?? ""} />
			</Container>
		</Wrapper>
	);
}

const styles = StyleSheet.create({
	content: { padding: spacing.xl, paddingBottom: spacing.xxxl * 2 },
	heroImage: {
		marginBottom: spacing.lg,
	},
	loading: { fontFamily: fonts.sans, padding: spacing.xxl, textAlign: "center" },
	title: { fontFamily: fonts.sansBold, fontSize: fontSize["3xl"], marginBottom: spacing.lg },
	metaBox: {
		borderRadius: radii.sm,
		padding: spacing.lg - 2,
		marginBottom: spacing.xl,
		gap: spacing.xs,
	},
	metaLabel: {
		fontFamily: fonts.sansBold,
		fontSize: fontSize.xs,
		textTransform: "uppercase",
		letterSpacing: letterSpacing.normal,
		marginTop: spacing.xs + 2,
	},
	metaValue: { fontFamily: fonts.sansMedium, fontSize: fontSize.base },
});

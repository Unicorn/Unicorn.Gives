import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Container } from "@/components/layout/Container";
import { DetailEditBar } from "@/components/layout/DetailEditBar";
import { Wrapper } from "@/components/layout/Wrapper";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { radii, spacing, useTheme } from "@/constants/theme";
import { routes } from "@/lib/navigation";
import { supabase } from "@/lib/supabase";

interface EventRow {
	id: string;
	title: string;
	date: string;
	time: string | null;
	location: string | null;
	cost: string | null;
	recurring: boolean | null;
	recurrence_rule: string | null;
	body: string | null;
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
				"id, title, date, time, location, cost, recurring, recurrence_rule, body",
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
				<Text style={[styles.loading, { color: colors.neutralVariant }]}>
					Loading…
				</Text>
			</View>
		);
	}

	return (
		<Wrapper contentContainerStyle={styles.content}>
			<Container>
				<DetailEditBar editHref={routes.admin.editEvent(item.id)} />
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
	content: { padding: spacing.xl, paddingBottom: 60 },
	loading: { padding: spacing.xxl, textAlign: "center" },
	title: { fontSize: 24, fontWeight: "800", marginBottom: spacing.lg },
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
});

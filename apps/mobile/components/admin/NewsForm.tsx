import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { spacing, useTheme } from "@/constants/theme";
import { useSlugGenerator } from "@/hooks/useSlugGenerator";
import { supabase } from "@/lib/supabase";
import {
	CheckboxField,
	DateField,
	FormColumn,
	FormRow,
	SelectField,
	SlugField,
	TextField,
} from "./AdminForm";
import { AdminRichEditor } from "./AdminRichEditor";
import { AdminImageUpload } from "./AdminImageUpload";

const NEWS_CATEGORIES = [
	{ label: "Ordinance change", value: "ordinance-change" },
	{ label: "Government action", value: "government-action" },
	{ label: "Public safety", value: "public-safety" },
	{ label: "Public notice", value: "public-notice" },
	{ label: "Community", value: "community" },
	{ label: "Infrastructure", value: "infrastructure" },
	{ label: "Election", value: "election" },
];

const VISIBILITY_OPTIONS = [
	{ label: "Global", value: "global" },
	{ label: "Scoped (region/partner only)", value: "scoped" },
	{ label: "Both", value: "both" },
];

const IMPACT_OPTIONS = [
	{ label: "None", value: "" },
	{ label: "High", value: "high" },
	{ label: "Medium", value: "medium" },
	{ label: "Low", value: "low" },
];

export interface NewsFormData {
	title: string;
	slug: string;
	description: string;
	body: string;
	date: string;
	category: string;
	visibility: string;
	author_name: string;
	source: string;
	source_url: string;
	image_url: string;
	featured: boolean;
	impact: string;
	region_id: string;
	partner_id: string;
}

export const EMPTY_NEWS: NewsFormData = {
	title: "",
	slug: "",
	description: "",
	body: "",
	date: "",
	category: "community",
	visibility: "global",
	author_name: "",
	source: "",
	source_url: "",
	image_url: "",
	featured: false,
	impact: "",
	region_id: "",
	partner_id: "",
};

interface NewsFormProps {
	data: NewsFormData;
	onChange: (data: NewsFormData) => void;
	errors?: Record<string, string>;
}

export function NewsForm({ data, onChange, errors = {} }: NewsFormProps) {
	const { colors } = useTheme();
	const styles = useMemo(() => createStyles(), []);
	const { slug, setSlug, manuallyEdited, resetManual } = useSlugGenerator(
		data.title,
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: sync generated slug into form (same pattern as EventForm)
	useEffect(() => {
		if (slug !== data.slug) {
			onChange({ ...data, slug });
		}
	}, [slug]);

	const [regions, setRegions] = useState<{ label: string; value: string }[]>(
		[],
	);
	const [partners, setPartners] = useState<{ label: string; value: string }[]>(
		[],
	);

	useEffect(() => {
		supabase
			.from("regions")
			.select("id, name")
			.eq("is_active", true)
			.order("display_order")
			.then(({ data: r }) => {
				if (r) setRegions(r.map((x) => ({ label: x.name, value: x.id })));
			});

		supabase
			.from("partners")
			.select("id, name")
			.eq("is_active", true)
			.then(({ data: p }) => {
				if (p) setPartners(p.map((x) => ({ label: x.name, value: x.id })));
			});
	}, []);

	function set<K extends keyof NewsFormData>(key: K, value: NewsFormData[K]) {
		onChange({ ...data, [key]: value });
	}

	const regionOptions = [{ label: "None", value: "" }, ...regions];
	const partnerOptions = [{ label: "None", value: "" }, ...partners];

	return (
		<View style={styles.form}>
			<TextField
				label="Title"
				value={data.title}
				onChangeText={(v) => set("title", v)}
				placeholder="Article headline"
				required
				error={errors.title}
			/>
			<SlugField
				slug={data.slug || slug}
				onSlugChange={(v) => {
					setSlug(v);
					set("slug", v);
				}}
				manuallyEdited={manuallyEdited}
				onReset={resetManual}
			/>

			<TextField
				label="Description"
				value={data.description}
				onChangeText={(v) => set("description", v)}
				placeholder="Short summary for lists"
				multiline
				numberOfLines={2}
			/>

			<View style={styles.fieldBlock}>
				<AdminRichEditor
					label="Body content"
					value={data.body}
					onChange={(v) => set("body", v)}
					placeholder="Write the full article…"
				/>
				{errors.body ? (
					<Text style={{ color: colors.error, fontSize: 13, marginTop: 4 }}>
						{errors.body}
					</Text>
				) : null}
			</View>

			<FormRow>
				<FormColumn>
					<DateField
						label="Date"
						value={data.date}
						onChangeText={(v) => set("date", v)}
						required
						error={errors.date}
					/>
				</FormColumn>
				<FormColumn>
					<SelectField
						label="Category"
						value={data.category}
						onValueChange={(v) => set("category", v)}
						options={NEWS_CATEGORIES}
						required
						error={errors.category}
					/>
				</FormColumn>
				<FormColumn>
					<SelectField
						label="Visibility"
						value={data.visibility}
						onValueChange={(v) => set("visibility", v)}
						options={VISIBILITY_OPTIONS}
					/>
				</FormColumn>
			</FormRow>

			<FormRow>
				<FormColumn>
					<TextField
						label="Author name"
						value={data.author_name}
						onChangeText={(v) => set("author_name", v)}
						placeholder="Display name"
					/>
				</FormColumn>
				<FormColumn>
					<TextField
						label="Source"
						value={data.source}
						onChangeText={(v) => set("source", v)}
						placeholder="e.g. The Horn"
					/>
				</FormColumn>
			</FormRow>

			<TextField
				label="Source URL"
				value={data.source_url}
				onChangeText={(v) => set("source_url", v)}
				placeholder="https://…"
			/>

			<AdminImageUpload
				label="Cover Image"
				value={data.image_url}
				onChange={(v) => set("image_url", v)}
				folder="news"
				hint="Upload or paste a URL for the article cover image"
			/>

			<FormRow>
				<FormColumn>
					<SelectField
						label="Impact"
						value={data.impact}
						onValueChange={(v) => set("impact", v)}
						options={IMPACT_OPTIONS}
					/>
				</FormColumn>
				<FormColumn>
					<CheckboxField
						label="Featured"
						value={data.featured}
						onValueChange={(v) => set("featured", v)}
					/>
				</FormColumn>
			</FormRow>

			<FormRow>
				<FormColumn>
					<SelectField
						label="Region (optional)"
						value={data.region_id}
						onValueChange={(v) => set("region_id", v)}
						options={regionOptions}
					/>
				</FormColumn>
				<FormColumn>
					<SelectField
						label="Partner (optional)"
						value={data.partner_id}
						onValueChange={(v) => set("partner_id", v)}
						options={partnerOptions}
					/>
				</FormColumn>
			</FormRow>
		</View>
	);
}

const createStyles = () =>
	StyleSheet.create({
		form: {
			gap: spacing.lg,
			paddingBottom: spacing.xxl,
		},
		fieldBlock: {
			gap: spacing.xs,
		},
	});

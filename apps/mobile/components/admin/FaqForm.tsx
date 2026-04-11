import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { spacing } from "@/constants/theme";
import { useSlugGenerator } from "@/hooks/useSlugGenerator";
import { supabase } from "@/lib/supabase";
import {
	FormColumn,
	FormRow,
	SelectField,
	SlugField,
	TextField,
} from "./AdminForm";
import { AdminRichEditor } from "./AdminRichEditor";

const AUDIENCE_OPTIONS = [
	{ label: "Residents", value: "residents" },
	{ label: "Businesses", value: "businesses" },
	{ label: "Both", value: "both" },
	{ label: "Visitors", value: "visitors" },
];

export interface FaqFormData {
	question: string;
	slug: string;
	answer: string;
	department_id: string;
	category_id: string;
	audience: string;
	display_order: string;
	region_id: string;
}

export const EMPTY_FAQ: FaqFormData = {
	question: "",
	slug: "",
	answer: "",
	department_id: "",
	category_id: "",
	audience: "residents",
	display_order: "0",
	region_id: "",
};

interface FaqFormProps {
	data: FaqFormData;
	onChange: (data: FaqFormData) => void;
	errors?: Record<string, string>;
}

export function FaqForm({ data, onChange, errors = {} }: FaqFormProps) {
	const styles = useMemo(() => createStyles(), []);
	const { slug, setSlug, manuallyEdited, resetManual } = useSlugGenerator(data.question);

	useEffect(() => {
		if (slug && !data.slug) {
			onChange({ ...data, slug });
		}
	}, [slug]);

	const [regions, setRegions] = useState<{ label: string; value: string }[]>([]);
	const [departments, setDepartments] = useState<{ label: string; value: string }[]>([]);
	const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);

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
			.from("departments")
			.select("id, name")
			.order("name")
			.then(({ data: d }) => {
				if (d) setDepartments(d.map((x) => ({ label: x.name, value: x.id })));
			});

		supabase
			.from("categories")
			.select("id, name")
			.order("name")
			.then(({ data: c }) => {
				if (c) setCategories(c.map((x) => ({ label: x.name, value: x.id })));
			});
	}, []);

	function set<K extends keyof FaqFormData>(key: K, value: FaqFormData[K]) {
		onChange({ ...data, [key]: value });
	}

	const regionOptions = [{ label: "None", value: "" }, ...regions];
	const departmentOptions = [{ label: "None", value: "" }, ...departments];
	const categoryOptions = [{ label: "None", value: "" }, ...categories];

	return (
		<View style={styles.form}>
			<TextField
				label="Question"
				value={data.question}
				onChangeText={(v) => set("question", v)}
				placeholder="Frequently asked question"
				required
				error={errors.question}
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

			<AdminRichEditor
				label="Answer"
				value={data.answer}
				onChange={(v) => set("answer", v)}
				placeholder="Write the answer..."
			/>

			<FormRow>
				<FormColumn>
					<SelectField
						label="Category"
						value={data.category_id}
						onValueChange={(v) => set("category_id", v)}
						options={categoryOptions}
					/>
				</FormColumn>
				<FormColumn>
					<SelectField
						label="Audience"
						value={data.audience}
						onValueChange={(v) => set("audience", v)}
						options={AUDIENCE_OPTIONS}
					/>
				</FormColumn>
			</FormRow>

			<FormRow>
				<FormColumn>
					<SelectField
						label="Department"
						value={data.department_id}
						onValueChange={(v) => set("department_id", v)}
						options={departmentOptions}
					/>
				</FormColumn>
				<FormColumn>
					<SelectField
						label="Region"
						value={data.region_id}
						onValueChange={(v) => set("region_id", v)}
						options={regionOptions}
						required
						error={errors.region_id}
					/>
				</FormColumn>
			</FormRow>

			<TextField
				label="Display Order"
				value={data.display_order}
				onChangeText={(v) => set("display_order", v)}
				placeholder="0"
			/>
		</View>
	);
}

const createStyles = () =>
	StyleSheet.create({
		form: {
			gap: spacing.lg,
			paddingBottom: spacing.xxl,
		},
	});

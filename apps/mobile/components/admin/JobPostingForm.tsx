import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { spacing } from "@/constants/theme";
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

const EMPLOYMENT_TYPE_OPTIONS = [
	{ label: "Full Time", value: "full_time" },
	{ label: "Part Time", value: "part_time" },
	{ label: "Seasonal", value: "seasonal" },
	{ label: "Volunteer", value: "volunteer" },
	{ label: "Internship", value: "internship" },
];

export interface JobPostingFormData {
	title: string;
	slug: string;
	description: string;
	body: string;
	department_id: string;
	employment_type: string;
	salary_range: string;
	benefits_summary: string;
	qualifications: string;
	application_url: string;
	posting_date: string;
	closing_date: string;
	is_open: boolean;
	contact_name: string;
	contact_email: string;
	region_id: string;
}

export const EMPTY_JOB_POSTING: JobPostingFormData = {
	title: "",
	slug: "",
	description: "",
	body: "",
	department_id: "",
	employment_type: "full_time",
	salary_range: "",
	benefits_summary: "",
	qualifications: "",
	application_url: "",
	posting_date: "",
	closing_date: "",
	is_open: true,
	contact_name: "",
	contact_email: "",
	region_id: "",
};

interface JobPostingFormProps {
	data: JobPostingFormData;
	onChange: (data: JobPostingFormData) => void;
	errors?: Record<string, string>;
}

export function JobPostingForm({ data, onChange, errors = {} }: JobPostingFormProps) {
	const styles = useMemo(() => createStyles(), []);
	const { slug, setSlug, manuallyEdited, resetManual } = useSlugGenerator(data.title);

	useEffect(() => {
		if (slug && !data.slug) {
			onChange({ ...data, slug });
		}
	}, [slug]);

	const [regions, setRegions] = useState<{ label: string; value: string }[]>([]);
	const [departments, setDepartments] = useState<{ label: string; value: string }[]>([]);

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
	}, []);

	function set<K extends keyof JobPostingFormData>(key: K, value: JobPostingFormData[K]) {
		onChange({ ...data, [key]: value });
	}

	const regionOptions = [{ label: "None", value: "" }, ...regions];
	const departmentOptions = [{ label: "None", value: "" }, ...departments];

	return (
		<View style={styles.form}>
			<TextField
				label="Title"
				value={data.title}
				onChangeText={(v) => set("title", v)}
				placeholder="Job title"
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
				placeholder="Brief job summary for listings"
				multiline
				numberOfLines={2}
			/>

			<AdminRichEditor
				label="Body"
				value={data.body}
				onChange={(v) => set("body", v)}
				placeholder="Full job description..."
			/>

			<FormRow>
				<FormColumn>
					<SelectField
						label="Employment Type"
						value={data.employment_type}
						onValueChange={(v) => set("employment_type", v)}
						options={EMPLOYMENT_TYPE_OPTIONS}
					/>
				</FormColumn>
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

			<FormRow>
				<FormColumn>
					<TextField
						label="Salary Range"
						value={data.salary_range}
						onChangeText={(v) => set("salary_range", v)}
						placeholder="e.g. $45,000 - $55,000"
					/>
				</FormColumn>
				<FormColumn>
					<TextField
						label="Application URL"
						value={data.application_url}
						onChangeText={(v) => set("application_url", v)}
						placeholder="https://..."
					/>
				</FormColumn>
			</FormRow>

			<TextField
				label="Benefits Summary"
				value={data.benefits_summary}
				onChangeText={(v) => set("benefits_summary", v)}
				placeholder="Health insurance, retirement, PTO..."
				multiline
				numberOfLines={2}
			/>

			<TextField
				label="Qualifications"
				value={data.qualifications}
				onChangeText={(v) => set("qualifications", v)}
				placeholder="Required qualifications and experience"
				multiline
				numberOfLines={3}
			/>

			<FormRow>
				<FormColumn>
					<DateField
						label="Posting Date"
						value={data.posting_date}
						onChangeText={(v) => set("posting_date", v)}
					/>
				</FormColumn>
				<FormColumn>
					<DateField
						label="Closing Date"
						value={data.closing_date}
						onChangeText={(v) => set("closing_date", v)}
					/>
				</FormColumn>
			</FormRow>

			<FormRow>
				<FormColumn>
					<CheckboxField
						label="Position Open"
						value={data.is_open}
						onValueChange={(v) => set("is_open", v)}
						hint="This position is currently accepting applications"
					/>
				</FormColumn>
			</FormRow>

			<FormRow>
				<FormColumn>
					<TextField
						label="Contact Name"
						value={data.contact_name}
						onChangeText={(v) => set("contact_name", v)}
						placeholder="Hiring manager"
					/>
				</FormColumn>
				<FormColumn>
					<TextField
						label="Contact Email"
						value={data.contact_email}
						onChangeText={(v) => set("contact_email", v)}
						placeholder="hr@example.com"
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
	});

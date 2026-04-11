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

const DOCUMENT_TYPE_OPTIONS = [
	{ label: "Form", value: "form" },
	{ label: "Permit", value: "permit" },
	{ label: "Application", value: "application" },
	{ label: "Policy", value: "policy" },
	{ label: "Plan", value: "plan" },
	{ label: "Report", value: "report" },
	{ label: "Brochure", value: "brochure" },
	{ label: "Guide", value: "guide" },
	{ label: "Template", value: "template" },
	{ label: "Other", value: "other" },
];

const FILE_FORMAT_OPTIONS = [
	{ label: "PDF", value: "pdf" },
	{ label: "Word", value: "docx" },
	{ label: "Excel", value: "xlsx" },
	{ label: "CSV", value: "csv" },
	{ label: "Other", value: "other" },
];

export interface FormsDocumentFormData {
	title: string;
	slug: string;
	description: string;
	document_type: string;
	file_url: string;
	file_size_label: string;
	file_format: string;
	department_id: string;
	form_number: string;
	effective_date: string;
	revision_date: string;
	is_fillable: boolean;
	is_current: boolean;
	submission_url: string;
	instructions: string;
	display_order: string;
	region_id: string;
}

export const EMPTY_FORMS_DOCUMENT: FormsDocumentFormData = {
	title: "",
	slug: "",
	description: "",
	document_type: "form",
	file_url: "",
	file_size_label: "",
	file_format: "pdf",
	department_id: "",
	form_number: "",
	effective_date: "",
	revision_date: "",
	is_fillable: false,
	is_current: true,
	submission_url: "",
	instructions: "",
	display_order: "0",
	region_id: "",
};

interface FormsDocumentFormProps {
	data: FormsDocumentFormData;
	onChange: (data: FormsDocumentFormData) => void;
	errors?: Record<string, string>;
}

export function FormsDocumentForm({ data, onChange, errors = {} }: FormsDocumentFormProps) {
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

	function set<K extends keyof FormsDocumentFormData>(key: K, value: FormsDocumentFormData[K]) {
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
				placeholder="Document title"
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
				placeholder="Brief description of this document"
				multiline
				numberOfLines={2}
			/>

			<FormRow>
				<FormColumn>
					<SelectField
						label="Document Type"
						value={data.document_type}
						onValueChange={(v) => set("document_type", v)}
						options={DOCUMENT_TYPE_OPTIONS}
					/>
				</FormColumn>
				<FormColumn>
					<SelectField
						label="File Format"
						value={data.file_format}
						onValueChange={(v) => set("file_format", v)}
						options={FILE_FORMAT_OPTIONS}
					/>
				</FormColumn>
				<FormColumn>
					<TextField
						label="Form Number"
						value={data.form_number}
						onChangeText={(v) => set("form_number", v)}
						placeholder="e.g. FRM-001"
					/>
				</FormColumn>
			</FormRow>

			<TextField
				label="File URL"
				value={data.file_url}
				onChangeText={(v) => set("file_url", v)}
				placeholder="https://..."
				required
				error={errors.file_url}
			/>

			<FormRow>
				<FormColumn>
					<TextField
						label="File Size"
						value={data.file_size_label}
						onChangeText={(v) => set("file_size_label", v)}
						placeholder="e.g. 2.4 MB"
					/>
				</FormColumn>
				<FormColumn>
					<TextField
						label="Submission URL"
						value={data.submission_url}
						onChangeText={(v) => set("submission_url", v)}
						placeholder="https://..."
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

			<FormRow>
				<FormColumn>
					<DateField
						label="Effective Date"
						value={data.effective_date}
						onChangeText={(v) => set("effective_date", v)}
					/>
				</FormColumn>
				<FormColumn>
					<DateField
						label="Revision Date"
						value={data.revision_date}
						onChangeText={(v) => set("revision_date", v)}
					/>
				</FormColumn>
			</FormRow>

			<TextField
				label="Instructions"
				value={data.instructions}
				onChangeText={(v) => set("instructions", v)}
				placeholder="Instructions for completing or submitting this form"
				multiline
				numberOfLines={3}
			/>

			<FormRow>
				<FormColumn>
					<CheckboxField
						label="Fillable"
						value={data.is_fillable}
						onValueChange={(v) => set("is_fillable", v)}
						hint="This form can be filled out digitally"
					/>
				</FormColumn>
				<FormColumn>
					<CheckboxField
						label="Current"
						value={data.is_current}
						onValueChange={(v) => set("is_current", v)}
						hint="This is the current version of the document"
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

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

const NOTICE_TYPE_OPTIONS = [
	{ label: "General", value: "general" },
	{ label: "Public Hearing", value: "public_hearing" },
	{ label: "RFP", value: "rfp" },
	{ label: "Bid Request", value: "bid_request" },
	{ label: "Emergency Alert", value: "emergency_alert" },
	{ label: "Water Advisory", value: "water_advisory" },
	{ label: "Road Closure", value: "road_closure" },
	{ label: "Election Notice", value: "election_notice" },
];

const SEVERITY_OPTIONS = [
	{ label: "Info", value: "info" },
	{ label: "Warning", value: "warning" },
	{ label: "Urgent", value: "urgent" },
	{ label: "Emergency", value: "emergency" },
];

export interface PublicNoticeFormData {
	title: string;
	slug: string;
	description: string;
	body: string;
	notice_type: string;
	severity: string;
	department_id: string;
	publish_date: string;
	expiration_date: string;
	is_pinned: boolean;
	attachment_url: string;
	contact_name: string;
	contact_phone: string;
	contact_email: string;
	region_id: string;
}

export const EMPTY_PUBLIC_NOTICE: PublicNoticeFormData = {
	title: "",
	slug: "",
	description: "",
	body: "",
	notice_type: "general",
	severity: "info",
	department_id: "",
	publish_date: "",
	expiration_date: "",
	is_pinned: false,
	attachment_url: "",
	contact_name: "",
	contact_phone: "",
	contact_email: "",
	region_id: "",
};

interface PublicNoticeFormProps {
	data: PublicNoticeFormData;
	onChange: (data: PublicNoticeFormData) => void;
	errors?: Record<string, string>;
}

export function PublicNoticeForm({ data, onChange, errors = {} }: PublicNoticeFormProps) {
	const { colors } = useTheme();
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

	function set<K extends keyof PublicNoticeFormData>(key: K, value: PublicNoticeFormData[K]) {
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
				placeholder="Notice title"
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
				placeholder="Short summary"
				multiline
				numberOfLines={2}
			/>

			<View style={styles.fieldBlock}>
				<AdminRichEditor
					label="Body"
					value={data.body}
					onChange={(v) => set("body", v)}
					placeholder="Full notice content..."
				/>
				{errors.body ? (
					<Text style={{ color: colors.error, fontSize: 13, marginTop: 4 }}>
						{errors.body}
					</Text>
				) : null}
			</View>

			<FormRow>
				<FormColumn>
					<SelectField
						label="Notice Type"
						value={data.notice_type}
						onValueChange={(v) => set("notice_type", v)}
						options={NOTICE_TYPE_OPTIONS}
					/>
				</FormColumn>
				<FormColumn>
					<SelectField
						label="Severity"
						value={data.severity}
						onValueChange={(v) => set("severity", v)}
						options={SEVERITY_OPTIONS}
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
			</FormRow>

			<FormRow>
				<FormColumn>
					<DateField
						label="Publish Date"
						value={data.publish_date}
						onChangeText={(v) => set("publish_date", v)}
					/>
				</FormColumn>
				<FormColumn>
					<DateField
						label="Expiration Date"
						value={data.expiration_date}
						onChangeText={(v) => set("expiration_date", v)}
					/>
				</FormColumn>
			</FormRow>

			<FormRow>
				<FormColumn>
					<CheckboxField
						label="Pinned"
						value={data.is_pinned}
						onValueChange={(v) => set("is_pinned", v)}
						hint="Pin this notice to the top of lists"
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
				label="Attachment URL"
				value={data.attachment_url}
				onChangeText={(v) => set("attachment_url", v)}
				placeholder="https://..."
			/>

			<FormRow>
				<FormColumn>
					<TextField
						label="Contact Name"
						value={data.contact_name}
						onChangeText={(v) => set("contact_name", v)}
						placeholder="Contact person"
					/>
				</FormColumn>
				<FormColumn>
					<TextField
						label="Contact Phone"
						value={data.contact_phone}
						onChangeText={(v) => set("contact_phone", v)}
						placeholder="(555) 555-5555"
					/>
				</FormColumn>
				<FormColumn>
					<TextField
						label="Contact Email"
						value={data.contact_email}
						onChangeText={(v) => set("contact_email", v)}
						placeholder="email@example.com"
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

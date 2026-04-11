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

const SERVICE_CATEGORY_OPTIONS = [
	{ label: "Utilities", value: "utilities" },
	{ label: "Permits & Licensing", value: "permits_licensing" },
	{ label: "Public Safety", value: "public_safety" },
	{ label: "Recreation", value: "recreation" },
	{ label: "Public Works", value: "public_works" },
	{ label: "Administrative", value: "administrative" },
	{ label: "Health", value: "health" },
	{ label: "Other", value: "other" },
];

const AUDIENCE_OPTIONS = [
	{ label: "Residents", value: "residents" },
	{ label: "Businesses", value: "businesses" },
	{ label: "Both", value: "both" },
	{ label: "Internal", value: "internal" },
];

export interface ServiceFormData {
	name: string;
	slug: string;
	description: string;
	body: string;
	department_id: string;
	service_category: string;
	audience: string;
	online_url: string;
	fee_schedule: string;
	eligibility: string;
	hours: string;
	phone: string;
	email: string;
	icon: string;
	display_order: string;
	region_id: string;
}

export const EMPTY_SERVICE: ServiceFormData = {
	name: "",
	slug: "",
	description: "",
	body: "",
	department_id: "",
	service_category: "other",
	audience: "residents",
	online_url: "",
	fee_schedule: "",
	eligibility: "",
	hours: "",
	phone: "",
	email: "",
	icon: "",
	display_order: "0",
	region_id: "",
};

interface ServiceFormProps {
	data: ServiceFormData;
	onChange: (data: ServiceFormData) => void;
	errors?: Record<string, string>;
}

export function ServiceForm({ data, onChange, errors = {} }: ServiceFormProps) {
	const styles = useMemo(() => createStyles(), []);
	const { slug, setSlug, manuallyEdited, resetManual } = useSlugGenerator(data.name);

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

	function set<K extends keyof ServiceFormData>(key: K, value: ServiceFormData[K]) {
		onChange({ ...data, [key]: value });
	}

	const regionOptions = [{ label: "None", value: "" }, ...regions];
	const departmentOptions = [{ label: "None", value: "" }, ...departments];

	return (
		<View style={styles.form}>
			<TextField
				label="Name"
				value={data.name}
				onChangeText={(v) => set("name", v)}
				placeholder="Service name"
				required
				error={errors.name}
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
				placeholder="Short summary of this service"
				multiline
				numberOfLines={2}
			/>

			<AdminRichEditor
				label="Body"
				value={data.body}
				onChange={(v) => set("body", v)}
				placeholder="Detailed service information..."
			/>

			<FormRow>
				<FormColumn>
					<SelectField
						label="Service Category"
						value={data.service_category}
						onValueChange={(v) => set("service_category", v)}
						options={SERVICE_CATEGORY_OPTIONS}
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
				label="Online URL"
				value={data.online_url}
				onChangeText={(v) => set("online_url", v)}
				placeholder="https://..."
			/>

			<FormRow>
				<FormColumn>
					<TextField
						label="Hours"
						value={data.hours}
						onChangeText={(v) => set("hours", v)}
						placeholder="Mon-Fri 8am-5pm"
					/>
				</FormColumn>
				<FormColumn>
					<TextField
						label="Phone"
						value={data.phone}
						onChangeText={(v) => set("phone", v)}
						placeholder="(555) 555-5555"
					/>
				</FormColumn>
				<FormColumn>
					<TextField
						label="Email"
						value={data.email}
						onChangeText={(v) => set("email", v)}
						placeholder="service@example.com"
					/>
				</FormColumn>
			</FormRow>

			<TextField
				label="Fee Schedule"
				value={data.fee_schedule}
				onChangeText={(v) => set("fee_schedule", v)}
				placeholder="Fee details"
				multiline
				numberOfLines={2}
			/>

			<TextField
				label="Eligibility"
				value={data.eligibility}
				onChangeText={(v) => set("eligibility", v)}
				placeholder="Who is eligible for this service"
				multiline
				numberOfLines={2}
			/>

			<FormRow>
				<FormColumn>
					<TextField
						label="Icon"
						value={data.icon}
						onChangeText={(v) => set("icon", v)}
						placeholder="e.g. water-drop"
					/>
				</FormColumn>
				<FormColumn>
					<TextField
						label="Display Order"
						value={data.display_order}
						onChangeText={(v) => set("display_order", v)}
						placeholder="0"
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

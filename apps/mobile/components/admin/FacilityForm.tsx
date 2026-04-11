import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { spacing } from "@/constants/theme";
import { useSlugGenerator } from "@/hooks/useSlugGenerator";
import { supabase } from "@/lib/supabase";
import {
	CheckboxField,
	FormColumn,
	FormRow,
	SelectField,
	SlugField,
	TextField,
} from "./AdminForm";
import { AdminRichEditor } from "./AdminRichEditor";
import { AdminImageUpload } from "./AdminImageUpload";

const FACILITY_TYPE_OPTIONS = [
	{ label: "Park", value: "park" },
	{ label: "Building", value: "building" },
	{ label: "Field", value: "field" },
	{ label: "Pavilion", value: "pavilion" },
	{ label: "Trail", value: "trail" },
	{ label: "Pool", value: "pool" },
	{ label: "Cemetery", value: "cemetery" },
	{ label: "Airport", value: "airport" },
	{ label: "Other", value: "other" },
];

export interface FacilityFormData {
	name: string;
	slug: string;
	description: string;
	body: string;
	facility_type: string;
	department_id: string;
	address: string;
	latitude: string;
	longitude: string;
	map_url: string;
	hours: string;
	seasonal_dates: string;
	amenities: string;
	rental_available: boolean;
	rental_rates: string;
	rental_form_url: string;
	rules_url: string;
	hero_image_url: string;
	display_order: string;
	region_id: string;
}

export const EMPTY_FACILITY: FacilityFormData = {
	name: "",
	slug: "",
	description: "",
	body: "",
	facility_type: "park",
	department_id: "",
	address: "",
	latitude: "",
	longitude: "",
	map_url: "",
	hours: "",
	seasonal_dates: "",
	amenities: "",
	rental_available: false,
	rental_rates: "",
	rental_form_url: "",
	rules_url: "",
	hero_image_url: "",
	display_order: "0",
	region_id: "",
};

interface FacilityFormProps {
	data: FacilityFormData;
	onChange: (data: FacilityFormData) => void;
	errors?: Record<string, string>;
}

export function FacilityForm({ data, onChange, errors = {} }: FacilityFormProps) {
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

	function set<K extends keyof FacilityFormData>(key: K, value: FacilityFormData[K]) {
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
				placeholder="Facility name"
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
				placeholder="Short description"
				multiline
				numberOfLines={2}
			/>

			<AdminRichEditor
				label="Body"
				value={data.body}
				onChange={(v) => set("body", v)}
				placeholder="Detailed facility information..."
			/>

			<FormRow>
				<FormColumn>
					<SelectField
						label="Facility Type"
						value={data.facility_type}
						onValueChange={(v) => set("facility_type", v)}
						options={FACILITY_TYPE_OPTIONS}
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

			<TextField
				label="Address"
				value={data.address}
				onChangeText={(v) => set("address", v)}
				placeholder="123 Main St, City, State"
			/>

			<FormRow>
				<FormColumn>
					<TextField
						label="Latitude"
						value={data.latitude}
						onChangeText={(v) => set("latitude", v)}
						placeholder="e.g. 43.8231"
					/>
				</FormColumn>
				<FormColumn>
					<TextField
						label="Longitude"
						value={data.longitude}
						onChangeText={(v) => set("longitude", v)}
						placeholder="e.g. -84.7697"
					/>
				</FormColumn>
			</FormRow>

			<TextField
				label="Map URL"
				value={data.map_url}
				onChangeText={(v) => set("map_url", v)}
				placeholder="https://maps.google.com/..."
			/>

			<FormRow>
				<FormColumn>
					<TextField
						label="Hours"
						value={data.hours}
						onChangeText={(v) => set("hours", v)}
						placeholder="Dawn to Dusk"
					/>
				</FormColumn>
				<FormColumn>
					<TextField
						label="Seasonal Dates"
						value={data.seasonal_dates}
						onChangeText={(v) => set("seasonal_dates", v)}
						placeholder="May 1 - October 31"
					/>
				</FormColumn>
			</FormRow>

			<TextField
				label="Amenities (JSON)"
				value={data.amenities}
				onChangeText={(v) => set("amenities", v)}
				placeholder='["restrooms", "playground", "picnic tables"]'
				multiline
				numberOfLines={2}
			/>

			<FormRow>
				<FormColumn>
					<CheckboxField
						label="Rental Available"
						value={data.rental_available}
						onValueChange={(v) => set("rental_available", v)}
						hint="This facility can be rented"
					/>
				</FormColumn>
			</FormRow>

			<FormRow>
				<FormColumn>
					<TextField
						label="Rental Rates"
						value={data.rental_rates}
						onChangeText={(v) => set("rental_rates", v)}
						placeholder="Rate details"
						multiline
						numberOfLines={2}
					/>
				</FormColumn>
				<FormColumn>
					<TextField
						label="Rental Form URL"
						value={data.rental_form_url}
						onChangeText={(v) => set("rental_form_url", v)}
						placeholder="https://..."
					/>
				</FormColumn>
			</FormRow>

			<TextField
				label="Rules URL"
				value={data.rules_url}
				onChangeText={(v) => set("rules_url", v)}
				placeholder="https://..."
			/>

			<AdminImageUpload
				label="Hero Image"
				value={data.hero_image_url}
				onChange={(v) => set("hero_image_url", v)}
				folder="facilities"
				hint="Upload or paste a URL for the facility hero image"
			/>

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

import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform } from "react-native";
import { AdminButton, AdminPageShell } from "@/components/admin/AdminPageShell";
import {
	EMPTY_NEWS,
	NewsForm,
	type NewsFormData,
} from "@/components/admin/NewsForm";
import { useAdminMutation } from "@/hooks/useAdminMutation";
import { paths, routes } from "@/lib/navigation";

export default function NewNewsPage() {
	const router = useRouter();
	const { insert, loading } = useAdminMutation("news");
	const [form, setForm] = useState<NewsFormData>({ ...EMPTY_NEWS });
	const [errors, setErrors] = useState<Record<string, string>>({});

	function validate(): boolean {
		const errs: Record<string, string> = {};
		if (!form.title.trim()) errs.title = "Title is required";
		if (!form.date) errs.date = "Date is required";
		if (!form.category) errs.category = "Category is required";
		if (!form.body.trim()) errs.body = "Body is required";
		setErrors(errs);
		return Object.keys(errs).length === 0;
	}

	async function handleSave(status: "draft" | "published") {
		if (!validate()) return;

		const payload: Record<string, unknown> = {
			title: form.title.trim(),
			slug: form.slug,
			description: form.description || null,
			body: form.body,
			date: form.date,
			category: form.category,
			visibility: form.visibility,
			author_name: form.author_name || null,
			source: form.source || null,
			source_url: form.source_url || null,
			image_url: form.image_url || null,
			featured: form.featured,
			impact: form.impact || null,
			region_id: form.region_id || null,
			partner_id: form.partner_id || null,
			status,
		};

		if (status === "published") {
			payload.published_at = new Date().toISOString();
		}

		const result = await insert(payload);
		if (result) {
			router.replace(routes.admin.editNews(result.id));
		} else if (Platform.OS === "web") {
			window.alert("Failed to create article. Check the console for details.");
		}
	}

	return (
		<AdminPageShell
			title="New Article"
			backHref={paths.admin.news}
			actions={
				<>
					<AdminButton
						label="Save Draft"
						variant="secondary"
						icon="save"
						onPress={() => handleSave("draft")}
						disabled={loading}
					/>
					<AdminButton
						label="Publish"
						icon="publish"
						onPress={() => handleSave("published")}
						disabled={loading}
					/>
				</>
			}
		>
			<NewsForm data={form} onChange={setForm} errors={errors} />
		</AdminPageShell>
	);
}

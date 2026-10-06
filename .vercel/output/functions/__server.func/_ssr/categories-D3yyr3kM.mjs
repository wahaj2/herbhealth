import { i as createServerFn } from "./server-Ca0AjyFE.mjs";
import { t as createServerRpc } from "./createServerRpc-DRx0ojag.mjs";
import { l as stringType, s as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/categories-D3yyr3kM.js
var fetchCategories_createServerFn_handler = createServerRpc({
	id: "9e1a5e0d9fa74a784fa70b4cea0f0806aa5f0e752f874e5febc21115dcae0aa6",
	name: "fetchCategories",
	filename: "src/routes/admin/categories/index.tsx"
}, (opts) => fetchCategories.__executeServer(opts));
var fetchCategories = createServerFn({ method: "GET" }).handler(fetchCategories_createServerFn_handler, async () => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const { data } = await createServerSupabase().from("categories").select("id, name, slug, image_path").order("name");
	return data ?? [];
});
var uploadCategoryImage_createServerFn_handler = createServerRpc({
	id: "50140c06251d210c5caf148d199bcf318ddfeca172946350c24cd4128bfa5fd5",
	name: "uploadCategoryImage",
	filename: "src/routes/admin/categories/index.tsx"
}, (opts) => uploadCategoryImage.__executeServer(opts));
var uploadCategoryImage = createServerFn({ method: "POST" }).validator(objectType({
	fileName: stringType(),
	fileBase64: stringType(),
	mimeType: stringType()
})).handler(uploadCategoryImage_createServerFn_handler, async ({ data }) => {
	if (![
		"image/jpeg",
		"image/png",
		"image/webp"
	].includes(data.mimeType)) throw new Error("Only JPEG, PNG and WebP are allowed");
	const bytes = Buffer.from(data.fileBase64, "base64");
	if (bytes.length > 5242880) throw new Error("Image must be under 5MB");
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const db = createServerSupabase();
	const path = `categories/${Date.now()}-${data.fileName}`;
	const { error } = await db.storage.from("product-images").upload(path, bytes, {
		contentType: data.mimeType,
		upsert: false
	});
	if (error) throw new Error(error.message);
	return { path };
});
var createCategory_createServerFn_handler = createServerRpc({
	id: "0c109456bb524fce2c9d327280ec02c729a75c90d704618ace4a24410304ff80",
	name: "createCategory",
	filename: "src/routes/admin/categories/index.tsx"
}, (opts) => createCategory.__executeServer(opts));
var createCategory = createServerFn({ method: "POST" }).validator(objectType({
	name: stringType().min(2),
	slug: stringType().min(2),
	imagePath: stringType().nullable()
})).handler(createCategory_createServerFn_handler, async ({ data }) => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const { data: created, error } = await createServerSupabase().from("categories").insert({
		name: data.name,
		slug: data.slug,
		image_path: data.imagePath
	}).select("id, name, slug, image_path").single();
	if (error) throw new Error(error.message);
	return created;
});
var updateCategory_createServerFn_handler = createServerRpc({
	id: "1cf92ed22c48c12c3fd7d0b02cbb90c5cd8f04e835b55cee9ece2bbe727c2d05",
	name: "updateCategory",
	filename: "src/routes/admin/categories/index.tsx"
}, (opts) => updateCategory.__executeServer(opts));
var updateCategory = createServerFn({ method: "POST" }).validator(objectType({
	id: stringType(),
	name: stringType().min(2),
	slug: stringType().min(2),
	imagePath: stringType().nullable(),
	oldImagePath: stringType().nullable()
})).handler(updateCategory_createServerFn_handler, async ({ data }) => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const db = createServerSupabase();
	const { data: updated, error } = await db.from("categories").update({
		name: data.name,
		slug: data.slug,
		image_path: data.imagePath
	}).eq("id", data.id).select("id, name, slug, image_path").single();
	if (error) throw new Error(error.message);
	if (data.oldImagePath && data.oldImagePath !== data.imagePath) await db.storage.from("product-images").remove([data.oldImagePath]);
	return updated;
});
var deleteCategory_createServerFn_handler = createServerRpc({
	id: "1143998405e861799fe2fb326c89e72bd88e47a6b0d86991dde59090cc6eefab",
	name: "deleteCategory",
	filename: "src/routes/admin/categories/index.tsx"
}, (opts) => deleteCategory.__executeServer(opts));
var deleteCategory = createServerFn({ method: "POST" }).validator(objectType({ id: stringType() })).handler(deleteCategory_createServerFn_handler, async ({ data }) => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const db = createServerSupabase();
	const [{ data: category }, { data: products }] = await Promise.all([db.from("categories").select("image_path").eq("id", data.id).single(), db.from("products").select("id").eq("category_id", data.id)]);
	const productIds = (products ?? []).map((p) => p.id);
	const pathsToRemove = [];
	if (category?.image_path) pathsToRemove.push(category.image_path);
	if (productIds.length > 0) {
		const { data: images } = await db.from("product_images").select("storage_path").in("product_id", productIds);
		for (const img of images ?? []) pathsToRemove.push(img.storage_path);
	}
	if (pathsToRemove.length > 0) await db.storage.from("product-images").remove(pathsToRemove);
	const { error } = await db.from("categories").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
	return { deletedProducts: productIds.length };
});
//#endregion
export { createCategory_createServerFn_handler, deleteCategory_createServerFn_handler, fetchCategories_createServerFn_handler, updateCategory_createServerFn_handler, uploadCategoryImage_createServerFn_handler };

import { i as createServerFn } from "./server-Ca0AjyFE.mjs";
import { t as createServerRpc } from "./createServerRpc-DRx0ojag.mjs";
import { a as literalType, i as enumType, l as stringType, n as booleanType, o as numberType, r as coerce, s as objectType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProductForm-EPSGRvr6.js
var productSchema = objectType({
	name: stringType().min(2),
	slug: stringType().min(2).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
	sku: stringType().optional(),
	price: coerce.number().positive(),
	compare_at_price: coerce.number().positive().optional().or(literalType("")),
	category_id: stringType().optional(),
	material: stringType().optional(),
	color: stringType().optional(),
	sizes: stringType().optional(),
	stock_status: enumType([
		"in",
		"low",
		"out"
	]),
	stock_quantity: coerce.number().int().min(0).default(0),
	is_bestseller: booleanType().default(false),
	is_active: booleanType().default(true),
	short_description: stringType().optional(),
	description: stringType().optional(),
	care_instructions: stringType().optional()
});
var upsertProduct_createServerFn_handler = createServerRpc({
	id: "0c4d6abbafb89161582ee8a861db446033f1b4fa380543c454a1adfd1a2934cb",
	name: "upsertProduct",
	filename: "src/components/ProductForm.tsx"
}, (opts) => upsertProduct.__executeServer(opts));
var upsertProduct = createServerFn({ method: "POST" }).validator(objectType({
	id: stringType().optional(),
	values: productSchema,
	imagePaths: arrayType(stringType()),
	deletedImageIds: arrayType(stringType())
})).handler(upsertProduct_createServerFn_handler, async ({ data }) => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const db = createServerSupabase();
	const sizes = data.values.sizes ? data.values.sizes.split(",").map((s) => s.trim()).filter(Boolean) : null;
	const clientSku = data.values.sku?.trim();
	const payload = {
		slug: data.values.slug,
		name: data.values.name,
		price: data.values.price,
		compare_at_price: data.values.compare_at_price || null,
		category_id: data.values.category_id || null,
		material: data.values.material || null,
		color: data.values.color || null,
		sizes,
		stock_status: data.values.stock_status,
		stock_quantity: data.values.stock_quantity,
		is_bestseller: data.values.is_bestseller,
		is_active: data.values.is_active,
		short_description: data.values.short_description || null,
		description: data.values.description || null,
		care_instructions: data.values.care_instructions || null
	};
	let productId = data.id;
	if (productId) {
		const { error } = await db.from("products").update({
			...payload,
			...clientSku ? { sku: clientSku } : {}
		}).eq("id", productId);
		if (error) throw new Error(error.message);
	} else {
		const { data: created, error } = await db.from("products").insert({
			...payload,
			sku: clientSku || null
		}).select("id, sku").single();
		if (error) throw new Error(error.message);
		productId = created.id;
		if (!created.sku) {
			const { suggestProductSku: suggest } = await import("./sku-t0ounlFa.mjs").then((n) => n.t).then((n) => n.t);
			const fallback = `${suggest(void 0, data.values.name)}-${productId.replace(/-/g, "").slice(0, 4).toUpperCase()}`;
			await db.from("products").update({ sku: fallback }).eq("id", productId);
		}
	}
	if (data.deletedImageIds.length > 0) await db.from("product_images").delete().in("id", data.deletedImageIds);
	if (data.imagePaths.length > 0) {
		const { data: existing } = await db.from("product_images").select("sort_order").eq("product_id", productId).order("sort_order", { ascending: false }).limit(1);
		const baseOrder = existing?.[0]?.sort_order ?? -1;
		const rows = data.imagePaths.map((path, i) => ({
			product_id: productId,
			storage_path: path,
			sort_order: baseOrder + 1 + i
		}));
		const { error } = await db.from("product_images").insert(rows);
		if (error) throw new Error(error.message);
	}
	return { id: productId };
});
var uploadProductImage_createServerFn_handler = createServerRpc({
	id: "fc6d154f86373a1c5f526ba751a54bcb98c5f26c0d310ce64e05edd7d6a6e695",
	name: "uploadProductImage",
	filename: "src/components/ProductForm.tsx"
}, (opts) => uploadProductImage.__executeServer(opts));
var uploadProductImage = createServerFn({ method: "POST" }).validator(objectType({
	productSlug: stringType(),
	fileName: stringType(),
	fileBase64: stringType(),
	mimeType: stringType()
})).handler(uploadProductImage_createServerFn_handler, async ({ data }) => {
	if (![
		"image/jpeg",
		"image/png",
		"image/webp"
	].includes(data.mimeType)) throw new Error("Only JPEG, PNG and WebP are allowed");
	const bytes = Buffer.from(data.fileBase64, "base64");
	if (bytes.length > 5242880) throw new Error("Image must be under 5MB");
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const db = createServerSupabase();
	const path = `products/${data.productSlug}/${Date.now()}-${data.fileName}`;
	const { error } = await db.storage.from("product-images").upload(path, bytes, {
		contentType: data.mimeType,
		upsert: false
	});
	if (error) throw new Error(error.message);
	return { path };
});
var upsertProductVariants_createServerFn_handler = createServerRpc({
	id: "e97b995ac11be7727cb89431a0241810e0fdbca6255974791b1ba14cffeae571",
	name: "upsertProductVariants",
	filename: "src/components/ProductForm.tsx"
}, (opts) => upsertProductVariants.__executeServer(opts));
var upsertProductVariants = createServerFn({ method: "POST" }).validator(objectType({
	productId: stringType(),
	variants: arrayType(objectType({
		id: stringType().optional(),
		colorName: stringType().min(1),
		colorHex: stringType().optional(),
		sku: stringType().optional(),
		imagePath: stringType().nullable(),
		stockQuantity: numberType().int().min(0).nullable()
	})),
	deletedIds: arrayType(stringType()),
	replacedImagePaths: arrayType(stringType())
})).handler(upsertProductVariants_createServerFn_handler, async ({ data }) => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const { suggestVariantSku } = await import("./sku-t0ounlFa.mjs").then((n) => n.t).then((n) => n.t);
	const db = createServerSupabase();
	const { data: productRow } = await db.from("products").select("sku").eq("id", data.productId).single();
	const productSkuPrefix = productRow?.sku ?? "SKU";
	const pathsToRemove = [...data.replacedImagePaths];
	if (data.deletedIds.length > 0) {
		const { data: toDelete } = await db.from("product_variants").select("image_path").in("id", data.deletedIds);
		for (const v of toDelete ?? []) if (v.image_path) pathsToRemove.push(v.image_path);
		await db.from("product_variants").delete().in("id", data.deletedIds);
	}
	if (pathsToRemove.length > 0) await db.storage.from("product-images").remove(pathsToRemove);
	for (const [i, v] of data.variants.entries()) {
		const row = {
			product_id: data.productId,
			color_name: v.colorName,
			color_hex: v.colorHex || null,
			sku: v.sku?.trim() || null,
			image_path: v.imagePath,
			stock_quantity: v.stockQuantity,
			sort_order: i
		};
		if (v.id) {
			const { error } = await db.from("product_variants").update(row).eq("id", v.id);
			if (error) throw new Error(error.message);
		} else {
			const { data: created, error } = await db.from("product_variants").insert(row).select("id, sku").single();
			if (error) throw new Error(error.message);
			if (!created.sku) {
				const fallback = `${suggestVariantSku(productSkuPrefix, v.colorName)}-${created.id.replace(/-/g, "").slice(0, 4).toUpperCase()}`;
				await db.from("product_variants").update({ sku: fallback }).eq("id", created.id);
			}
		}
	}
});
//#endregion
export { uploadProductImage_createServerFn_handler, upsertProductVariants_createServerFn_handler, upsertProduct_createServerFn_handler };

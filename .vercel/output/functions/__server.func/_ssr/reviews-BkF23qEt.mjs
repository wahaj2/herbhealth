import { i as createServerFn } from "./server-Ca0AjyFE.mjs";
import { t as createServerRpc } from "./createServerRpc-DRx0ojag.mjs";
import { a as literalType, l as stringType, o as numberType, s as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reviews-BkF23qEt.js
var submitReview_createServerFn_handler = createServerRpc({
	id: "6f1e727f1e2f85b90f64e628f5287e4b68ddf97606137625d3a83ca59cdd0f4b",
	name: "submitReview",
	filename: "src/lib/reviews.ts"
}, (opts) => submitReview.__executeServer(opts));
var submitReview = createServerFn({ method: "POST" }).validator(objectType({
	productId: stringType(),
	customerName: stringType().min(2),
	customerEmail: stringType().email().optional().or(literalType("")),
	rating: numberType().int().min(1).max(5),
	title: stringType().optional(),
	comment: stringType().min(5)
})).handler(submitReview_createServerFn_handler, async ({ data }) => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const { error } = await createServerSupabase().from("reviews").insert({
		product_id: data.productId,
		customer_name: data.customerName,
		customer_email: data.customerEmail || null,
		rating: data.rating,
		title: data.title || null,
		comment: data.comment,
		is_approved: false
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { submitReview_createServerFn_handler };

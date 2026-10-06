import { i as createServerFn } from "./server-ByAcQfZh.mjs";
import { t as createServerRpc } from "./createServerRpc-DXxI8Usm.mjs";
import { l as stringType, n as booleanType, s as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reviews-CCAOZ-6o.js
var fetchReviews_createServerFn_handler = createServerRpc({
	id: "1f73ea70113108aac94876cbf31d436cf62e6eec8c8bac156fd6556008754a3d",
	name: "fetchReviews",
	filename: "src/routes/admin/reviews/index.tsx"
}, (opts) => fetchReviews.__executeServer(opts));
var fetchReviews = createServerFn({ method: "GET" }).handler(fetchReviews_createServerFn_handler, async () => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const { data } = await createServerSupabase().from("reviews").select("id, customer_name, customer_email, rating, title, comment, is_approved, created_at, product:products(name, slug)").order("created_at", { ascending: false });
	return data ?? [];
});
var setReviewApproval_createServerFn_handler = createServerRpc({
	id: "b79edc5b72460f1eee86d3f7e596603a6233fcc7b8179269335c3c30ef11a3dd",
	name: "setReviewApproval",
	filename: "src/routes/admin/reviews/index.tsx"
}, (opts) => setReviewApproval.__executeServer(opts));
var setReviewApproval = createServerFn({ method: "POST" }).validator(objectType({
	id: stringType(),
	approved: booleanType()
})).handler(setReviewApproval_createServerFn_handler, async ({ data }) => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const { error } = await createServerSupabase().from("reviews").update({ is_approved: data.approved }).eq("id", data.id);
	if (error) throw new Error(error.message);
});
var deleteReview_createServerFn_handler = createServerRpc({
	id: "fa2164b850b90fb1f79322461203b07845eda6b1a51f9889c308e34f9beea1ca",
	name: "deleteReview",
	filename: "src/routes/admin/reviews/index.tsx"
}, (opts) => deleteReview.__executeServer(opts));
var deleteReview = createServerFn({ method: "POST" }).validator(objectType({ id: stringType() })).handler(deleteReview_createServerFn_handler, async ({ data }) => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const { error } = await createServerSupabase().from("reviews").delete().eq("id", data.id);
	if (error) throw new Error(error.message);
});
//#endregion
export { deleteReview_createServerFn_handler, fetchReviews_createServerFn_handler, setReviewApproval_createServerFn_handler };

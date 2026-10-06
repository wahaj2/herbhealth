import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as createServerFn } from "./server-Ca0AjyFE.mjs";
import { l as stringType, n as booleanType, s as objectType } from "../_libs/zod.mjs";
import { N as Check, c as Star, o as Trash2, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Button, S as createSsrRpc, i as Route$2 } from "./router-DekkBrBB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reviews-f349s-69.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var setReviewApproval = createServerFn({ method: "POST" }).validator(objectType({
	id: stringType(),
	approved: booleanType()
})).handler(createSsrRpc("b79edc5b72460f1eee86d3f7e596603a6233fcc7b8179269335c3c30ef11a3dd"));
var deleteReview = createServerFn({ method: "POST" }).validator(objectType({ id: stringType() })).handler(createSsrRpc("fa2164b850b90fb1f79322461203b07845eda6b1a51f9889c308e34f9beea1ca"));
function AdminReviews() {
	const initial = Route$2.useLoaderData();
	const [reviews, setReviews] = (0, import_react.useState)(initial);
	const [filter, setFilter] = (0, import_react.useState)("pending");
	const visible = reviews.filter((r) => filter === "all" ? true : filter === "pending" ? !r.is_approved : r.is_approved);
	const approve = async (id, approved) => {
		try {
			await setReviewApproval({ data: {
				id,
				approved
			} });
			setReviews((prev) => prev.map((r) => r.id === id ? {
				...r,
				is_approved: approved
			} : r));
			toast.success(approved ? "Review approved" : "Review hidden");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to update review");
		}
	};
	const remove = async (id) => {
		if (!confirm("Delete this review permanently?")) return;
		try {
			await deleteReview({ data: { id } });
			setReviews((prev) => prev.filter((r) => r.id !== id));
			toast.success("Review deleted");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to delete review");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl",
				children: "Reviews"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2",
				children: [
					"pending",
					"approved",
					"all"
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setFilter(f),
					className: `px-3 py-1.5 text-xs uppercase tracking-wider border ${filter === f ? "border-gold text-gold" : "border-border text-muted-foreground"}`,
					children: [
						f,
						" ",
						f === "pending" && `(${reviews.filter((r) => !r.is_approved).length})`
					]
				}, f))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [visible.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border border-border bg-card p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex",
								children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `size-3.5 ${i < r.rating ? "fill-gold text-gold" : "text-border"}` }, i))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: ["on ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: r.product?.name ?? "Unknown product"
								})]
							})]
						}),
						r.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-medium text-sm",
							children: r.title
						}),
						r.comment && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: r.comment
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: [
								r.customer_name,
								r.customer_email && ` · ${r.customer_email}`,
								" · ",
								new Date(r.created_at).toLocaleDateString()
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex shrink-0 gap-1",
						children: [!r.is_approved ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "hero",
							onClick: () => approve(r.id, true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 mr-1" }), " Approve"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "quiet",
							onClick: () => approve(r.id, false),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4 mr-1" }), " Unpublish"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => remove(r.id),
							className: "p-2 text-muted-foreground hover:text-destructive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})]
					})]
				})
			}, r.id)), visible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-border bg-card p-8 text-center text-sm text-muted-foreground",
				children: [
					"No ",
					filter !== "all" ? filter : "",
					" reviews."
				]
			})]
		})]
	});
}
//#endregion
export { AdminReviews as component };

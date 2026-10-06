import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as createServerFn } from "./server-ByAcQfZh.mjs";
import { l as stringType, n as booleanType, s as objectType } from "../_libs/zod.mjs";
import { D as EyeOff, E as Eye, m as Pencil, o as Trash2, p as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Button, S as createSsrRpc, o as Route$4, v as Input, w as formatPrice } from "./router-CZJGKrey.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-BAODnf0S.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var toggleActive = createServerFn({ method: "POST" }).validator(objectType({
	id: stringType(),
	is_active: booleanType()
})).handler(createSsrRpc("ed08c2fffb7d723765543899b2a04bfb6dbbe60be1835634cd5156bbf513cd64"));
var deleteProductPermanently = createServerFn({ method: "POST" }).validator(objectType({ id: stringType() })).handler(createSsrRpc("96283f8ad7d649c14371634b9d8e13cd34d81be200a166267f5ea3612f2715c6"));
var stockColors = {
	in: "text-green-600",
	low: "text-yellow-600",
	out: "text-destructive"
};
function getImageUrl(path) {
	return `${{
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_ANON_KEY": "sb_publishable_VMGhELtAWH4tg7d69sdMbw_wZ2ZorEm",
		"VITE_SUPABASE_URL": "https://scujsqjyxtjjqcgxnahd.supabase.co"
	}["VITE_SUPABASE_URL"]}/storage/v1/object/public/product-images/${path}`;
}
function AdminProducts() {
	const initial = Route$4.useLoaderData();
	const [products, setProducts] = (0, import_react.useState)(initial);
	const [search, setSearch] = (0, import_react.useState)("");
	const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku ?? "").toLowerCase().includes(search.toLowerCase()) || (p.category?.name ?? "").toLowerCase().includes(search.toLowerCase()));
	const handleToggle = async (id, current) => {
		await toggleActive({ data: {
			id,
			is_active: !current
		} });
		setProducts((prev) => prev.map((p) => p.id === id ? {
			...p,
			is_active: !current
		} : p));
		toast(!current ? "Product visible on storefront" : "Product hidden from storefront");
	};
	const handleDelete = async (id, name) => {
		if (!confirm(`Permanently delete "${name}"? This removes the product and all its photos for good and cannot be undone. If you just want to hide it from the store instead, use the eye icon.`)) return;
		try {
			await deleteProductPermanently({ data: { id } });
			setProducts((prev) => prev.filter((p) => p.id !== id));
			toast.success(`"${name}" deleted permanently`);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to delete product");
		}
	};
	const thumb = (p) => {
		const img = [...p.product_images].sort((a, b) => a.sort_order - b.sort_order)[0];
		return img ? getImageUrl(img.storage_path) : null;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl",
					children: "Products"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "hero",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/admin/products/new",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 mr-2" }), " Add Product"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Search by name, SKU or category…",
				value: search,
				onChange: (e) => setSearch(e.target.value),
				className: "mb-6 max-w-sm rounded-none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border border-border overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Product"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "SKU"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Category"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Price"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Stock"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
						className: "divide-y divide-border",
						children: [filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: `bg-card ${!p.is_active ? "opacity-50" : ""}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [thumb(p) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: thumb(p),
											alt: "",
											className: "size-10 object-cover shrink-0"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-10 bg-secondary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium",
											children: p.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: p.slug
										})] })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-mono text-xs text-muted-foreground",
									children: p.sku ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: p.category?.name ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: formatPrice(p.price)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: `px-4 py-3 capitalize ${stockColors[p.stock_status] ?? ""}`,
									children: p.stock_status
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-xs uppercase tracking-wider ${p.is_active ? "text-green-600" : "text-muted-foreground"}`,
										children: p.is_active ? "Active" : "Hidden"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-end gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleToggle(p.id, p.is_active),
												title: p.is_active ? "Hide from storefront" : "Show on storefront",
												className: "p-1 text-muted-foreground hover:text-foreground",
												children: p.is_active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/admin/products/$id/edit",
												params: { id: p.id },
												className: "p-1 text-muted-foreground hover:text-foreground",
												title: "Edit",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => handleDelete(p.id, p.name),
												title: "Delete permanently",
												className: "p-1 text-muted-foreground hover:text-destructive",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
											})
										]
									})
								})
							]
						}, p.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 7,
							className: "px-4 py-10 text-center text-muted-foreground",
							children: "No products found."
						}) })]
					})]
				})
			})
		]
	});
}
//#endregion
export { AdminProducts as component };

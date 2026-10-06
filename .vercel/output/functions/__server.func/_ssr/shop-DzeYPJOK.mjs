import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { D as Button, E as useShop, O as cn, m as Route$13 } from "./router-DekkBrBB.mjs";
import { t as Newsletter } from "./Newsletter-5Lsd6Cl-.mjs";
import { n as turmeric_drops_default, t as ProductCard } from "./ProductCard-BkqXwlnH.mjs";
import { t as QuickView } from "./QuickView-CEHClN6O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-DzeYPJOK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
function dbToProduct(p) {
	const images = p.product_images.length > 0 ? p.product_images.sort((a, b) => a.sort_order - b.sort_order).map((i) => getImageUrl(i.storage_path)) : [turmeric_drops_default];
	return {
		id: p.id,
		slug: p.slug,
		name: p.name,
		price: p.price,
		compareAt: p.compare_at_price ?? void 0,
		category: p.category?.name ?? "",
		material: p.material ?? "",
		color: p.color ?? "",
		stock: p.stock_status,
		bestseller: p.is_bestseller,
		images,
		short: p.short_description ?? "",
		description: p.description ?? "",
		care: p.care_instructions ?? "",
		sizes: p.sizes ?? void 0
	};
}
var sorts = {
	newest: "Newest",
	priceAsc: "Price: Low to High",
	popular: "Popularity"
};
function Shop() {
	const { products: dbProducts, categoryNames } = Route$13.useLoaderData();
	const search = Route$13.useSearch();
	const navigate = Route$13.useNavigate();
	const { wishlist } = useShop();
	const products = (0, import_react.useMemo)(() => dbProducts.map(dbToProduct), [dbProducts]);
	const [quick, setQuick] = (0, import_react.useState)(null);
	const [material, setMaterial] = (0, import_react.useState)([]);
	const [color, setColor] = (0, import_react.useState)([]);
	const [maxPrice, setMaxPrice] = (0, import_react.useState)(5e3);
	const [sort, setSort] = (0, import_react.useState)("newest");
	const activeStyle = search.category;
	const onlyWishlist = !!search.wishlist;
	const materials = (0, import_react.useMemo)(() => [...new Set(products.map((p) => p.material).filter(Boolean))], [products]);
	const colors = (0, import_react.useMemo)(() => [...new Set(products.map((p) => p.color).filter(Boolean))], [products]);
	const toggle = (list, setList, value) => setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
	const visible = (0, import_react.useMemo)(() => {
		let list = products.filter((p) => (!activeStyle || p.category === activeStyle) && (material.length === 0 || material.includes(p.material)) && (color.length === 0 || color.includes(p.color)) && p.price <= maxPrice && (!onlyWishlist || wishlist.includes(p.slug)));
		if (sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
		if (sort === "popular") list = [...list].sort((a, b) => Number(!!b.bestseller) - Number(!!a.bestseller));
		return list;
	}, [
		activeStyle,
		material,
		color,
		maxPrice,
		sort,
		onlyWishlist,
		wishlist,
		products
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "pt-28",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto max-w-6xl px-5 py-10 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "The Collection"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-4xl sm:text-5xl",
						children: onlyWishlist ? "Your Wishlist" : activeStyle ?? "All Products"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-4 max-w-md text-sm text-muted-foreground",
						children: "Small-batch herbal oils, teas and tonics made to be used, not saved for later."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl gap-10 px-5 pb-20 lg:grid-cols-[240px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "space-y-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "Category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => navigate({ search: {} }),
									className: cn("block text-sm text-muted-foreground hover:text-gold", !activeStyle && !onlyWishlist && "text-gold"),
									children: "All Products"
								}),
								categoryNames.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => navigate({ search: { category: s } }),
									className: cn("block text-sm text-muted-foreground hover:text-gold", activeStyle === s && "text-gold"),
									children: s
								}, s)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => navigate({ search: { wishlist: true } }),
									className: cn("block text-sm text-muted-foreground hover:text-gold", onlyWishlist && "text-gold"),
									children: [
										"Wishlist (",
										wishlist.length,
										")"
									]
								})
							]
						})] }),
						materials.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "Form"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 space-y-2",
							children: materials.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									className: "accent-gold",
									checked: material.includes(m),
									onChange: () => toggle(material, setMaterial, m)
								}), m]
							}, m))
						})] }),
						colors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "Variant"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: colors.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => toggle(color, setColor, c),
								className: cn("border border-border px-3 py-1 text-xs text-muted-foreground", color.includes(c) && "border-gold text-gold"),
								children: c
							}, c))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "eyebrow",
							children: ["Max price: Rs ", maxPrice.toLocaleString("en-PK")]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 500,
							max: 5e3,
							step: 1e3,
							value: maxPrice,
							onChange: (e) => setMaxPrice(Number(e.target.value)),
							className: "mt-3 w-full accent-gold",
							"aria-label": "Maximum price"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "quiet",
							className: "w-full",
							onClick: () => {
								setMaterial([]);
								setColor([]);
								setMaxPrice(5e3);
								navigate({ search: {} });
							},
							children: "Clear filters"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [visible.length, " pieces"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: sort,
						onChange: (e) => setSort(e.target.value),
						className: "h-9 border border-input bg-background px-2 text-xs",
						"aria-label": "Sort products",
						children: Object.entries(sorts).map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: key,
							children: label
						}, key))
					})]
				}), visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-20 text-center text-sm text-muted-foreground",
					children: products.length === 0 ? "No products have been added yet." : "Nothing matches those filters yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3",
					children: visible.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
						product: p,
						onQuickView: setQuick
					}, p.slug))
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newsletter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickView, {
				product: quick,
				onClose: () => setQuick(null)
			})
		]
	});
}
//#endregion
export { Shop as component };

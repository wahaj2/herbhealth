import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as createServerFn } from "./server-Ca0AjyFE.mjs";
import { a as literalType, l as stringType, o as numberType, s as objectType } from "../_libs/zod.mjs";
import { c as Star, d as RotateCcw, r as Truck, u as ShieldCheck, w as Heart } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Button, E as useShop, O as cn, S as createSsrRpc, T as stockLabel, d as Route$9, w as formatPrice } from "./router-DekkBrBB.mjs";
import { i as AccordionTrigger, n as AccordionContent, r as AccordionItem, t as Accordion } from "./accordion-2fxVN1ha.mjs";
import { n as turmeric_drops_default, t as ProductCard } from "./ProductCard-BkqXwlnH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._slug-DTeyHrjT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var submitReview = createServerFn({ method: "POST" }).validator(objectType({
	productId: stringType(),
	customerName: stringType().min(2),
	customerEmail: stringType().email().optional().or(literalType("")),
	rating: numberType().int().min(1).max(5),
	title: stringType().optional(),
	comment: stringType().min(5)
})).handler(createSsrRpc("6f1e727f1e2f85b90f64e628f5287e4b68ddf97606137625d3a83ca59cdd0f4b"));
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
function ProductPage() {
	const { product: dbProduct, related: dbRelated, reviews, variants } = Route$9.useLoaderData();
	const product = dbToProduct(dbProduct);
	const related = dbRelated.map(dbToProduct);
	const { addToCart, setCartOpen, toggleWishlist, wishlist } = useShop();
	const [active, setActive] = (0, import_react.useState)(0);
	const [zoom, setZoom] = (0, import_react.useState)(false);
	const [size, setSize] = (0, import_react.useState)(product.sizes?.[0]);
	const firstAvailable = variants.find((v) => v.stock_quantity === null || v.stock_quantity > 0) ?? variants[0];
	const [selectedVariant, setSelectedVariant] = (0, import_react.useState)(firstAvailable);
	const saved = wishlist.includes(product.slug);
	const variantOutOfStock = !!selectedVariant && selectedVariant.stock_quantity !== null && selectedVariant.stock_quantity <= 0;
	const soldOut = product.stock === "out" || variantOutOfStock;
	const gallery = selectedVariant?.image_path ? [getImageUrl(selectedVariant.image_path), ...product.images] : product.images;
	const activeImage = gallery[Math.min(active, gallery.length - 1)];
	const handleAdd = (goToCart) => {
		addToCart(product, 1, selectedVariant ? selectedVariant.color_name : size);
		setCartOpen(goToCart);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "pt-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:text-gold",
							children: "Home"
						}),
						" ",
						"/ ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							className: "hover:text-gold",
							children: "Shop"
						}),
						" /",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground",
							children: product.name
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid gap-12 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-hidden bg-card",
						onMouseEnter: () => setZoom(true),
						onMouseLeave: () => setZoom(false),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: activeImage,
							alt: `${product.name} — view ${active + 1}`,
							width: 1024,
							height: 1024,
							className: cn("aspect-square w-full object-cover transition-transform duration-700", zoom && "scale-150")
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex gap-3",
						children: gallery.map((img, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActive(i),
							className: cn("size-20 overflow-hidden border", i === active ? "border-gold" : "border-border"),
							"aria-label": `View image ${i + 1}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: img,
								alt: "",
								width: 1024,
								height: 1024,
								loading: "lazy",
								className: "size-full object-cover"
							})
						}, i))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: product.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 font-display text-4xl",
							children: product.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-baseline gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl",
								children: formatPrice(product.price)
							}), product.compareAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground line-through",
								children: formatPrice(product.compareAt)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cn("mt-3 text-xs uppercase tracking-[0.2em]", !soldOut && product.stock === "in" && "text-gold", !soldOut && product.stock === "low" && "text-destructive", soldOut && "text-muted-foreground"),
							children: soldOut ? "Sold Out" : stockLabel[product.stock]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-sm text-muted-foreground",
							children: product.description
						}),
						variants.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "eyebrow",
								children: ["Variant", selectedVariant ? `: ${selectedVariant.color_name}` : ""]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-3",
								children: variants.map((v) => {
									const outOfStock = v.stock_quantity !== null && v.stock_quantity <= 0;
									const isSelected = selectedVariant?.id === v.id;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: outOfStock,
										onClick: () => {
											setSelectedVariant(v);
											setActive(0);
										},
										title: outOfStock ? `${v.color_name} — out of stock` : v.color_name,
										className: cn("relative size-9 rounded-full border-2 transition-all", isSelected ? "border-gold" : "border-border", outOfStock && "opacity-30 cursor-not-allowed"),
										style: { backgroundColor: v.color_hex ?? "#d4d4d4" },
										children: outOfStock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute inset-0 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-full rotate-45 bg-foreground/60" })
										})
									}, v.id);
								})
							})]
						}),
						product.sizes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "Size"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex gap-2",
								children: product.sizes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setSize(s),
									className: cn("border px-4 py-2 text-xs uppercase tracking-[0.15em]", size === s ? "border-gold text-gold" : "border-border text-muted-foreground"),
									children: s
								}, s))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "hero",
									size: "xl",
									disabled: soldOut,
									onClick: () => handleAdd(true),
									children: soldOut ? "Sold Out" : "Add to Cart"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "gold",
									size: "xl",
									disabled: soldOut,
									onClick: () => handleAdd(true),
									children: "Buy Now"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "quiet",
									size: "xl",
									onClick: () => {
										toggleWishlist(product.slug);
										toast(saved ? "Removed from wishlist" : "Saved to wishlist");
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn(saved && "fill-gold text-gold") }), saved ? "Saved" : "Add to Wishlist"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 grid gap-3 border-y border-border py-6 text-xs text-muted-foreground sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-gold" }), " Cash on Delivery"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "size-4 text-gold" }), " Free over Rs 3,000"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4 text-gold" }), " 7-day returns"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Accordion, {
							type: "single",
							collapsible: true,
							className: "mt-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
									value: "material",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, { children: "Ingredients & details" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionContent, { children: [
										product.material,
										" · ",
										selectedVariant?.color_name ?? product.color,
										". Naturally sourced, small-batch made and free from synthetic fillers. Batch-tested for purity before it ships."
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
									value: "care",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, { children: "Usage & care instructions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, { children: product.care })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
									value: "shipping",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, { children: "Shipping & returns" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, { children: "Free standard delivery on orders over Rs 3,000. Dispatched within 24 hours. Delivery takes 2–5 business days across Pakistan. 7-day returns and exchanges." })]
								})
							]
						})
					] })]
				}),
				related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "py-20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "You may also like"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3",
						children: related.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductReviews, {
					productId: dbProduct.id,
					reviews
				})
			]
		})
	});
}
function ProductReviews({ productId, reviews }) {
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [rating, setRating] = (0, import_react.useState)(5);
	const [title, setTitle] = (0, import_react.useState)("");
	const [comment, setComment] = (0, import_react.useState)("");
	const avg = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			await submitReview({ data: {
				productId,
				customerName: name,
				customerEmail: email,
				rating,
				title,
				comment
			} });
			toast("Thank you for your review", { description: "It will appear here once our team reviews it." });
			setShowForm(false);
			setName("");
			setEmail("");
			setRating(5);
			setTitle("");
			setComment("");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Something went wrong");
		}
		setSubmitting(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border-t border-border py-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Customer Reviews"
				}), reviews.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex",
						children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("size-4", i < Math.round(avg) ? "fill-gold text-gold" : "text-border") }, i))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted-foreground",
						children: [
							avg.toFixed(1),
							" out of 5 (",
							reviews.length,
							" review",
							reviews.length === 1 ? "" : "s",
							")"
						]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "No reviews yet — be the first."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "quiet",
					onClick: () => setShowForm((v) => !v),
					children: showForm ? "Cancel" : "Write a Review"
				})]
			}),
			showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "mt-8 max-w-lg space-y-4 border border-border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wider text-muted-foreground",
						children: "Your rating"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex gap-1",
						children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setRating(i + 1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("size-6", i < rating ? "fill-gold text-gold" : "text-border") })
						}, i))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Your name",
						className: "w-full border border-border bg-background px-3 py-2 text-sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "email",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: "Your email (optional, not published)",
						className: "w-full border border-border bg-background px-3 py-2 text-sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "Review title (optional)",
						className: "w-full border border-border bg-background px-3 py-2 text-sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						required: true,
						minLength: 5,
						value: comment,
						onChange: (e) => setComment(e.target.value),
						placeholder: "Share your experience with this product…",
						rows: 4,
						className: "w-full border border-border bg-background px-3 py-2 text-sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						variant: "hero",
						disabled: submitting,
						children: submitting ? "Submitting…" : "Submit Review"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 space-y-6",
				children: reviews.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border pb-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex",
									children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("size-3.5", i < r.rating ? "fill-gold text-gold" : "text-border") }, i))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: r.customer_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: ["· ", new Date(r.created_at).toLocaleDateString()]
								})
							]
						}),
						r.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm font-medium",
							children: r.title
						}),
						r.comment && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: r.comment
						})
					]
				}, r.id))
			})
		]
	});
}
//#endregion
export { ProductPage as component };

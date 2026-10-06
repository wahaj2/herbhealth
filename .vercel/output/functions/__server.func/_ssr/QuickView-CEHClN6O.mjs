import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { D as Button, E as useShop, T as stockLabel, b as DialogContent, w as formatPrice, x as DialogTitle, y as Dialog } from "./router-DekkBrBB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/QuickView-CEHClN6O.js
var import_jsx_runtime = require_jsx_runtime();
function QuickView({ product, onClose }) {
	const { addToCart, setCartOpen } = useShop();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!product,
		onOpenChange: (open) => !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "max-w-3xl overflow-hidden p-0",
			children: product && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-0 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: product.images[0],
					alt: product.name,
					width: 1024,
					height: 1024,
					loading: "lazy",
					className: "aspect-square w-full object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: product.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "mt-2 font-display text-2xl",
							children: product.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-lg",
							children: formatPrice(product.price)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted-foreground",
							children: product.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs uppercase tracking-[0.2em] text-gold",
							children: stockLabel[product.stock]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "hero",
								size: "xl",
								disabled: product.stock === "out",
								onClick: () => {
									addToCart(product);
									onClose();
									setCartOpen(true);
								},
								children: product.stock === "out" ? "Sold Out" : "Add to Cart"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "quiet",
								asChild: true,
								onClick: onClose,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/product/$slug",
									params: { slug: product.slug },
									children: "View full details"
								})
							})]
						})
					]
				})]
			})
		})
	});
}
//#endregion
export { QuickView as t };

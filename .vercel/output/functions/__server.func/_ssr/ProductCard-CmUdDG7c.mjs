import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { E as Eye, w as Heart } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Button, E as useShop, O as cn, T as stockLabel, w as formatPrice } from "./router-CZJGKrey.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProductCard-CmUdDG7c.js
var import_jsx_runtime = require_jsx_runtime();
var turmeric_drops_default = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJnbGFzcyIgeDE9IjAiIHkxPSIwIiB4Mj0iMCIgeTI9IjEiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmZmZmZmIiBzdG9wLW9wYWNpdHk9IjAuMzUiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZmZmZmZmIiBzdG9wLW9wYWNpdHk9IjAiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMDI0IiBoZWlnaHQ9IjEwMjQiIGZpbGw9IiNGNEYxRTgiLz4KICAgIDxjaXJjbGUgY3g9Ijg3MC40IiBjeT0iMTIyLjg4IiByPSIyODYuNzIiIGZpbGw9IiNFN0REQkYiIG9wYWNpdHk9IjAuNSIvPgogICAgPGNpcmNsZSBjeD0iODEuOTIiIGN5PSI5NDIuMDgiIHI9IjIyNS4yOCIgZmlsbD0iI0RDRTdEMiIgb3BhY2l0eT0iMC41NSIvPgogIAogICAgCiAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0NDIuMCw2MzQuODgpIHJvdGF0ZSgtMTgpIHNjYWxlKDAuNjIpIj4KICAgICAgPHBhdGggZD0iTTAsMCBDIC00MCwtNzAgLTIwLC0xNTAgMTAsLTE5MCBDIDQwLC0xNTAgNTUsLTcwIDIwLDAgWiIgZmlsbD0iIzNFNkIzRSIgb3BhY2l0eT0iMC45Ii8+CiAgICAgIDxwYXRoIGQ9Ik0wLDAgQyAxMCwtNjAgMzAsLTEyMCA1NSwtMTUwIEMgNjUsLTEwMCA1NSwtNDAgMjAsMCBaIiBmaWxsPSIjNkU5QTU2IiBvcGFjaXR5PSIwLjg1Ii8+CiAgICAgIDxwYXRoIGQ9Ik0xMCwtMTkwIEMgMTAsLTE0MCAxMiwtNzAgMTAsMCIgc3Ryb2tlPSIjNkU5QTU2IiBzdHJva2Utd2lkdGg9IjIuNSIgZmlsbD0ibm9uZSIgb3BhY2l0eT0iMC42Ii8+CiAgICA8L2c+CiAgICAKICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYwNy4wLDU2My4yKSByb3RhdGUoMjIpIHNjYWxlKDAuNSkiPgogICAgICA8cGF0aCBkPSJNMCwwIEMgLTQwLC03MCAtMjAsLTE1MCAxMCwtMTkwIEMgNDAsLTE1MCA1NSwtNzAgMjAsMCBaIiBmaWxsPSIjM0U2QjNFIiBvcGFjaXR5PSIwLjkiLz4KICAgICAgPHBhdGggZD0iTTAsMCBDIDEwLC02MCAzMCwtMTIwIDU1LC0xNTAgQyA2NSwtMTAwIDU1LC00MCAyMCwwIFoiIGZpbGw9IiM2RTlBNTYiIG9wYWNpdHk9IjAuODUiLz4KICAgICAgPHBhdGggZD0iTTEwLC0xOTAgQyAxMCwtMTQwIDEyLC03MCAxMCwwIiBzdHJva2U9IiM2RTlBNTYiIHN0cm9rZS13aWR0aD0iMi41IiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjYiLz4KICAgIDwvZz4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ0Mi4wLDI4Ni43MikiPgogICAgICA8cmVjdCB4PSIwIiB5PSI3MCIgd2lkdGg9IjE0MCIgaGVpZ2h0PSIyMzAiIHJ4PSIxOCIgZmlsbD0iI0M5ODYyQiIvPgogICAgICA8cmVjdCB4PSIwIiB5PSI3MCIgd2lkdGg9IjE0MCIgaGVpZ2h0PSIyMzAiIHJ4PSIxOCIgZmlsbD0idXJsKCNnbGFzcykiLz4KICAgICAgPHJlY3QgeD0iNDAiIHk9IjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI4MCIgcng9IjEwIiBmaWxsPSIjM0U1QzNBIi8+CiAgICAgIDxyZWN0IHg9IjU1IiB5PSItNDAiIHdpZHRoPSIzMCIgaGVpZ2h0PSI1MCIgcng9IjgiIGZpbGw9IiMzRTVDM0EiLz4KICAgICAgPHJlY3QgeD0iMTQiIHk9IjExMCIgd2lkdGg9IjExMiIgaGVpZ2h0PSIxNTAiIHJ4PSI2IiBmaWxsPSIjRkJGOEYwIiBvcGFjaXR5PSIwLjkyIi8+CiAgICAgIDx0ZXh0IHg9IjcwIiB5PSIxNzUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJHZW9yZ2lhLCBzZXJpZiIgZm9udC1zaXplPSIxNSIgZmlsbD0iIzNjM2IyZiI+VHVybWVyaWM8L3RleHQ+CiAgICAgIDx0ZXh0IHg9IjcwIiB5PSIxOTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJHZW9yZ2lhLCBzZXJpZiIgZm9udC1zaXplPSIxMyIgZmlsbD0iIzZiNmE1OCI+RWxpeGlyPC90ZXh0PgogICAgICA8cmVjdCB4PSIzMCIgeT0iMjE1IiB3aWR0aD0iODAiIGhlaWdodD0iMyIgZmlsbD0iIzhCNUUyMiIvPgogICAgPC9nPgogICAgCjwvc3ZnPg==";
function ProductCard({ product, onQuickView }) {
	const { addToCart, toggleWishlist, wishlist, setCartOpen } = useShop();
	const saved = wishlist.includes(product.slug);
	const soldOut = product.stock === "out";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden bg-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/product/$slug",
						params: { slug: product.slug },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: product.images[0],
							alt: `${product.name} — ${product.color} ${product.material} by HerbHealth`,
							width: 1024,
							height: 1024,
							loading: "lazy",
							className: "aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("absolute left-3 top-3 bg-background/90 px-2 py-1 text-[10px] uppercase tracking-[0.18em]", product.stock === "low" && "text-gold", soldOut && "text-muted-foreground"),
						children: stockLabel[product.stock]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							toggleWishlist(product.slug);
							toast(saved ? "Removed from wishlist" : "Saved to wishlist");
						},
						"aria-label": "Save to wishlist",
						className: "absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/90 transition-colors hover:text-gold",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-4", saved && "fill-gold text-gold") })
					}),
					onQuickView && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onQuickView(product),
						className: "absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-center gap-2 bg-background/95 py-2 text-[11px] uppercase tracking-[0.2em] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" }), " Quick View"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/product/$slug",
					params: { slug: product.slug },
					className: "font-display text-base hover:text-gold",
					children: product.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: product.category
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: formatPrice(product.price)
					}), product.compareAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground line-through",
						children: formatPrice(product.compareAt)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "quiet",
				className: "mt-3 w-full",
				disabled: soldOut,
				onClick: () => {
					addToCart(product);
					setCartOpen(true);
				},
				children: soldOut ? "Sold Out" : "Add to Cart"
			})
		]
	});
}
//#endregion
export { turmeric_drops_default as n, ProductCard as t };

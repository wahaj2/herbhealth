import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { D as Button, f as Route$10, w as formatPrice } from "./router-CZJGKrey.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order-confirmation._orderNumber-tGOjekP4.js
var import_jsx_runtime = require_jsx_runtime();
function OrderConfirmation() {
	const order = Route$10.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "pt-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl px-5 pb-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-10 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-4xl",
							children: "🎉"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-4 font-display text-4xl",
							children: "Order Confirmed!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-muted-foreground",
							children: [
								"Thank you, ",
								order.customer_name,
								". Your order has been placed successfully."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm font-medium",
							children: ["Order #", order.order_number]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-gold/40 bg-gold/5 p-4 text-sm mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: "Payment: Cash on Delivery"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-muted-foreground",
						children: [
							"Please keep ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatPrice(order.total) }),
							" in cash ready for the rider. No advance payment is required."
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-border bg-card p-6 space-y-4 mb-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg",
							children: "Items Ordered"
						}),
						order.order_items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.product_name }),
								item.variant && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: item.variant
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: ["Qty: ", item.quantity]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: formatPrice(item.line_total) })]
						}, item.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-border pt-4 space-y-1 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Subtotal"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPrice(order.subtotal) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Delivery"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: order.shipping_fee === 0 ? "Free" : formatPrice(order.shipping_fee) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between font-display text-base pt-2 border-t border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPrice(order.total) })]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border border-border bg-card p-6 mb-8 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg mb-3",
							children: "Delivery Address"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.customer_name }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.phone }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.address_line1 }),
						order.address_line2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.address_line2 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							order.area ? `${order.area}, ` : "",
							order.city,
							order.postal_code ? ` ${order.postal_code}` : ""
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							"Questions? Email us at",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "mailto:support@herbhealth.store",
								className: "text-gold hover:underline",
								children: "support@herbhealth.store"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "hero",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							children: "Continue Shopping"
						})
					})]
				})
			]
		})
	});
}
//#endregion
export { OrderConfirmation as component };

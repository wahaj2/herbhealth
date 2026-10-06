import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "./_libs/@radix-ui/react-accordion+[...].mjs";
import { i as createServerFn } from "./_ssr/server-Ca0AjyFE.mjs";
import { l as stringType, s as objectType } from "./_libs/zod.mjs";
import { f as Printer } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { D as Button, S as createSsrRpc, s as Route$5, w as formatPrice } from "./_ssr/router-DekkBrBB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-BjOys7D5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var updateStatus = createServerFn({ method: "POST" }).validator(objectType({
	id: stringType(),
	status: stringType()
})).handler(createSsrRpc("6f5c66fa509d22e9041a240cd8896f0922ca1d6a7bba576494bf85a9e1279f91"));
var STATUSES = [
	"pending",
	"confirmed",
	"processing",
	"shipped",
	"delivered",
	"cancelled"
];
var STATUS_COLORS = {
	pending: "bg-yellow-100 text-yellow-800",
	confirmed: "bg-blue-100 text-blue-800",
	processing: "bg-purple-100 text-purple-800",
	shipped: "bg-indigo-100 text-indigo-800",
	delivered: "bg-green-100 text-green-800",
	cancelled: "bg-red-100 text-red-800"
};
function formatPlacedAt(iso) {
	return new Date(iso).toLocaleString("en-PK", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true
	});
}
function OrderDetail() {
	const initial = Route$5.useLoaderData();
	const [order, setOrder] = (0, import_react.useState)(initial);
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (new URLSearchParams(window.location.search).get("print") === "1") {
			const t = window.setTimeout(() => window.print(), 300);
			return () => window.clearTimeout(t);
		}
	}, []);
	const handleStatus = async (newStatus) => {
		setSaving(true);
		try {
			await updateStatus({ data: {
				id: order.id,
				status: newStatus
			} });
			setOrder((prev) => ({
				...prev,
				status: newStatus
			}));
			toast.success(`Status updated to ${newStatus}`);
		} catch {
			toast.error("Failed to update status");
		}
		setSaving(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 max-w-3xl print:p-0 print:max-w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-8 print:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "font-display text-2xl",
					children: ["Order ", order.order_number]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground mt-1",
					children: ["Placed ", formatPlacedAt(order.created_at)]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `inline-block rounded px-3 py-1 text-sm capitalize ${STATUS_COLORS[order.status] ?? ""}`,
						children: order.status
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "quiet",
						onClick: () => window.print(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4 mr-2" }), " Print / Save as PDF"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-border bg-card p-5 mb-6 print:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium mb-3",
					children: "Update Status"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: order.status === s ? "hero" : "quiet",
						disabled: saving || order.status === s,
						onClick: () => handleStatus(s),
						className: "capitalize",
						children: s
					}, s))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-border bg-card p-8 print:border-0 print:p-0 print:shadow-none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between border-b border-dashed border-border pb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-display text-xl tracking-[0.14em] uppercase",
							children: ["Herb", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gold",
								children: "Health"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Order Receipt"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: order.order_number
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: ["Placed ", formatPlacedAt(order.created_at)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs uppercase tracking-wide text-muted-foreground print:hidden",
									children: ["Status: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "capitalize text-foreground",
										children: order.status
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-3 text-xs uppercase tracking-wider text-muted-foreground",
								children: "Items"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3",
								children: order.order_items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.product_name }),
										item.variant && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: item.variant
										}),
										item.sku && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs font-mono text-muted-foreground",
											children: ["SKU: ", item.sku]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												item.quantity,
												" × ",
												formatPrice(item.unit_price)
											]
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: formatPrice(item.line_total)
									})]
								}, item.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-dashed border-border mt-4 pt-4 space-y-1 text-sm",
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
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "pt-1 text-xs uppercase tracking-wide text-muted-foreground",
										children: "Payment: Cash on Delivery"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-dashed border-border pt-6 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-xs uppercase tracking-wider text-muted-foreground",
							children: "Customer & Delivery"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Name:"
									}),
									" ",
									order.customer_name
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Phone:"
									}),
									" ",
									order.phone
								] }),
								order.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Email:"
									}),
									" ",
									order.email
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2",
									children: order.address_line1
								}),
								order.address_line2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: order.address_line2 }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									order.area ? `${order.area}, ` : "",
									order.city,
									order.postal_code ? ` ${order.postal_code}` : ""
								] }),
								order.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-muted-foreground italic",
									children: ["Notes: ", order.notes]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 border-t border-dashed border-border pt-4 text-center text-xs text-muted-foreground",
						children: "Thank you for shopping with HerbHealth. Please keep the exact amount ready for the rider."
					})
				]
			})
		]
	});
}
//#endregion
export { OrderDetail as component };

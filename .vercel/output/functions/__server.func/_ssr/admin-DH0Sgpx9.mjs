import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as TrendingUp, h as Package, i as TriangleAlert, l as ShoppingBag } from "../_libs/lucide-react.mjs";
import { p as Route$12, w as formatPrice } from "./router-DekkBrBB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DH0Sgpx9.js
var import_jsx_runtime = require_jsx_runtime();
function AdminDashboard() {
	const stats = Route$12.useLoaderData();
	const cards = [
		{
			label: "Pending Orders",
			value: stats.pendingCount,
			icon: ShoppingBag,
			href: "/admin/orders",
			urgent: stats.pendingCount > 0
		},
		{
			label: "Orders This Week",
			value: stats.weekOrderCount,
			icon: TrendingUp,
			href: "/admin/orders",
			urgent: false
		},
		{
			label: "Revenue This Week",
			value: formatPrice(stats.weekRevenue),
			icon: TrendingUp,
			href: "/admin/orders",
			urgent: false
		},
		{
			label: "Low / Out of Stock",
			value: stats.lowStockCount,
			icon: TriangleAlert,
			href: "/admin/products",
			urgent: stats.lowStockCount > 0
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl mb-8",
				children: "Dashboard"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10",
				children: cards.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: card.href,
					className: "border border-border bg-card p-6 hover:border-gold transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground uppercase tracking-wider",
							children: card.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(card.icon, { className: `size-4 ${card.urgent ? "text-destructive" : "text-muted-foreground"}` })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `font-display text-2xl ${card.urgent ? "text-destructive" : ""}`,
						children: card.value
					})]
				}, card.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin/products/new",
					className: "flex items-center gap-3 border border-border bg-card p-5 hover:border-gold transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-5 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium text-sm",
						children: "Add New Product"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Upload photos and set pricing"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/admin/orders",
					className: "flex items-center gap-3 border border-border bg-card p-5 hover:border-gold transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-5 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium text-sm",
						children: "View All Orders"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Manage and update order status"
					})] })]
				})]
			})
		]
	});
}
//#endregion
export { AdminDashboard as component };

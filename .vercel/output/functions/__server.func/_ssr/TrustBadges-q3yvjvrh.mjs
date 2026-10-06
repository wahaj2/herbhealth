import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { d as RotateCcw, g as PackageCheck, r as Truck } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TrustBadges-q3yvjvrh.js
var import_jsx_runtime = require_jsx_runtime();
var badges = [
	{
		icon: PackageCheck,
		title: "Cash on Delivery",
		copy: "Pay when your order arrives"
	},
	{
		icon: Truck,
		title: "Nationwide Delivery",
		copy: "2–5 business days across Pakistan"
	},
	{
		icon: RotateCcw,
		title: "Easy Returns",
		copy: "7-day hassle-free return policy"
	}
];
function TrustBadges() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-y border-border bg-secondary/30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:grid-cols-3",
			children: badges.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(b.icon, { className: "size-6 text-gold" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: b.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: b.copy
				})] })]
			}, b.title))
		})
	});
}
//#endregion
export { TrustBadges as t };

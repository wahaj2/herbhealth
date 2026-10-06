import { b as Link, g as Outlet, p as useRouterState, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { S as LayoutDashboard, b as Mail, c as Star, h as Package, l as ShoppingBag, s as Tag, x as LogOut, y as Megaphone } from "../_libs/lucide-react.mjs";
import { _ as supabase } from "./router-CZJGKrey.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-DisDR3kv.js
var import_jsx_runtime = require_jsx_runtime();
var navItems = [
	{
		to: "/admin",
		label: "Dashboard",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/admin/products",
		label: "Products",
		icon: Package,
		exact: false
	},
	{
		to: "/admin/orders",
		label: "Orders",
		icon: ShoppingBag,
		exact: false
	},
	{
		to: "/admin/categories",
		label: "Categories",
		icon: Tag,
		exact: false
	},
	{
		to: "/admin/reviews",
		label: "Reviews",
		icon: Star,
		exact: false
	},
	{
		to: "/admin/content",
		label: "Content & Offers",
		icon: Megaphone,
		exact: false
	},
	{
		to: "/admin/subscribers",
		label: "Subscribers",
		icon: Mail,
		exact: false
	}
];
function AdminLayout() {
	const navigate = useNavigate();
	const isLogin = useRouterState({ select: (s) => s.location.pathname }) === "/admin/login";
	const handleLogout = async () => {
		await supabase.auth.signOut();
		navigate({ to: "/admin/login" });
	};
	if (isLogin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-background print:block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "w-56 shrink-0 border-r border-border bg-card flex flex-col print:hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 border-b border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "font-display text-sm tracking-[0.18em] uppercase",
						children: ["Herb", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gold",
							children: "Health"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[10px] text-muted-foreground uppercase tracking-widest",
						children: "Admin"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex-1 p-3 space-y-1",
					children: navItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						activeOptions: { exact: item.exact },
						className: "flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground rounded hover:text-foreground hover:bg-secondary/50 transition-colors",
						activeProps: { className: "text-foreground bg-secondary/70" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
					}, item.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-3 border-t border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleLogout,
						className: "flex w-full items-center gap-3 px-3 py-2 text-sm text-muted-foreground rounded hover:text-destructive hover:bg-secondary/50 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Sign Out"]
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex-1 overflow-auto print:overflow-visible print:w-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})]
	});
}
//#endregion
export { AdminLayout as component };

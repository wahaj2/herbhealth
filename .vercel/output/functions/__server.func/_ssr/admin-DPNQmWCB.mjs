import { i as createServerFn } from "./server-Ca0AjyFE.mjs";
import { t as createServerRpc } from "./createServerRpc-DRx0ojag.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DPNQmWCB.js
var fetchDashboardStats_createServerFn_handler = createServerRpc({
	id: "6da4d9ed9ee2b9ba7cf52ec430089b93fef7001ad18dbd212252f31ef6171053",
	name: "fetchDashboardStats",
	filename: "src/routes/admin/index.tsx"
}, (opts) => fetchDashboardStats.__executeServer(opts));
var fetchDashboardStats = createServerFn({ method: "GET" }).handler(fetchDashboardStats_createServerFn_handler, async () => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const db = createServerSupabase();
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	const weekAgo = new Date(today);
	weekAgo.setDate(weekAgo.getDate() - 7);
	const [{ count: pendingCount }, { data: weekOrders }, { count: lowStockCount }, { count: outStockCount }] = await Promise.all([
		db.from("orders").select("*", {
			count: "exact",
			head: true
		}).eq("status", "pending"),
		db.from("orders").select("total, created_at").gte("created_at", weekAgo.toISOString()),
		db.from("products").select("*", {
			count: "exact",
			head: true
		}).eq("stock_status", "low").eq("is_active", true),
		db.from("products").select("*", {
			count: "exact",
			head: true
		}).eq("stock_status", "out").eq("is_active", true)
	]);
	const weekRevenue = (weekOrders ?? []).reduce((sum, o) => sum + Number(o.total), 0);
	const todayOrders = (weekOrders ?? []).filter((o) => new Date(o.created_at) >= today).length;
	return {
		pendingCount: pendingCount ?? 0,
		weekOrderCount: weekOrders?.length ?? 0,
		weekRevenue,
		todayOrderCount: todayOrders,
		lowStockCount: (lowStockCount ?? 0) + (outStockCount ?? 0)
	};
});
//#endregion
export { fetchDashboardStats_createServerFn_handler };

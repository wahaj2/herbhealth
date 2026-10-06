import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as createServerFn } from "./server-ByAcQfZh.mjs";
import { l as stringType, s as objectType } from "../_libs/zod.mjs";
import { A as ChevronRight, O as Download, f as Printer, j as ChevronLeft, o as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Button, S as createSsrRpc, c as Route$6, v as Input, w as formatPrice } from "./router-CZJGKrey.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-JEdu24Kf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var deleteOrder = createServerFn({ method: "POST" }).validator(objectType({ id: stringType() })).handler(createSsrRpc("8e06d7b65278d5c0dccf8f3c43241def91d08bb62f1158c34b420ad06d118868"));
var STATUS_COLORS = {
	pending: "bg-yellow-100 text-yellow-800",
	confirmed: "bg-blue-100 text-blue-800",
	processing: "bg-purple-100 text-purple-800",
	shipped: "bg-indigo-100 text-indigo-800",
	delivered: "bg-green-100 text-green-800",
	cancelled: "bg-red-100 text-red-800"
};
var ALL_STATUSES = [
	"pending",
	"confirmed",
	"processing",
	"shipped",
	"delivered",
	"cancelled"
];
var PAGE_SIZE = 20;
function formatDateTime(iso) {
	return new Date(iso).toLocaleString("en-PK", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true
	});
}
function skuSummary(items) {
	return items.filter((i) => i.sku).map((i) => `${i.sku} ×${i.quantity}`).join(", ");
}
function AdminOrders() {
	const initial = Route$6.useLoaderData();
	const [orders, setOrders] = (0, import_react.useState)(initial);
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [page, setPage] = (0, import_react.useState)(1);
	const filtered = (0, import_react.useMemo)(() => {
		return orders.filter((o) => {
			const matchStatus = statusFilter === "all" || o.status === statusFilter;
			const q = search.toLowerCase();
			const matchSearch = !q || o.order_number.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q) || o.phone.includes(q) || o.order_items.some((i) => i.sku?.toLowerCase().includes(q));
			return matchStatus && matchSearch;
		});
	}, [
		orders,
		search,
		statusFilter
	]);
	const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	(0, import_react.useEffect)(() => {
		setPage((p) => Math.min(p, totalPages));
	}, [totalPages]);
	(0, import_react.useEffect)(() => {
		setPage(1);
	}, [search, statusFilter]);
	const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
	const exportCsv = () => {
		const header = [
			"Order #",
			"Customer",
			"Phone",
			"City",
			"SKU(s)",
			"Total (PKR)",
			"Status",
			"Date & Time"
		];
		const rows = filtered.map((o) => [
			o.order_number,
			o.customer_name,
			o.phone,
			o.city,
			skuSummary(o.order_items),
			String(o.total),
			o.status,
			formatDateTime(o.created_at)
		]);
		const escape = (v) => `"${v.replace(/"/g, "\"\"")}"`;
		const csv = [header, ...rows].map((r) => r.map(escape).join(",")).join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `orders-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};
	const handleDelete = async (id, orderNumber) => {
		if (!confirm(`Permanently delete order ${orderNumber}? This cannot be undone. This does not restore any stock or notify the customer — it only removes the order record.`)) return;
		try {
			await deleteOrder({ data: { id } });
			setOrders((prev) => prev.filter((o) => o.id !== id));
			toast.success(`Order ${orderNumber} deleted`);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to delete order");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl",
					children: "Orders"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "quiet",
					onClick: exportCsv,
					disabled: filtered.length === 0,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4 mr-2" }), " Export CSV"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-3 mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Search order #, name, phone, SKU…",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					className: "max-w-xs rounded-none"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: statusFilter,
					onChange: (e) => setStatusFilter(e.target.value),
					className: "h-9 border border-input bg-background px-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "All Statuses"
					}), ALL_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: s,
						className: "capitalize",
						children: s.charAt(0).toUpperCase() + s.slice(1)
					}, s))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border border-border overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Order #"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Customer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "City"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "SKU(s)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Total"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Date & Time"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
						className: "divide-y divide-border",
						children: [paged.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-card hover:bg-secondary/20 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/admin/orders/$id",
										params: { id: o.id },
										className: "font-medium text-gold hover:underline",
										children: o.order_number
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: o.customer_name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: o.phone
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: o.city
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "max-w-[180px] truncate font-mono text-xs text-muted-foreground",
										title: skuSummary(o.order_items),
										children: skuSummary(o.order_items) || "—"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: formatPrice(o.total)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `inline-block rounded px-2 py-0.5 text-xs capitalize ${STATUS_COLORS[o.status] ?? ""}`,
										children: o.status
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground text-xs whitespace-nowrap",
									children: formatDateTime(o.created_at)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-end gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/admin/orders/$id",
											params: { id: o.id },
											search: { print: "1" },
											className: "inline-flex p-1 text-muted-foreground hover:text-gold",
											title: "Print receipt",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleDelete(o.id, o.order_number),
											className: "inline-flex p-1 text-muted-foreground hover:text-destructive",
											title: "Delete order",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
										})]
									})
								})
							]
						}, o.id)), paged.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 8,
							className: "px-4 py-10 text-center text-muted-foreground",
							children: "No orders found."
						}) })]
					})]
				})
			}),
			filtered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"Showing ",
						(page - 1) * PAGE_SIZE + 1,
						"–",
						Math.min(page * PAGE_SIZE, filtered.length),
						" of",
						" ",
						filtered.length,
						" order",
						filtered.length === 1 ? "" : "s"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "quiet",
							disabled: page === 1,
							onClick: () => setPage((p) => Math.max(1, p - 1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
						}),
						Array.from({ length: totalPages }, (_, i) => i + 1).filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 2).reduce((acc, n, i, arr) => {
							if (i > 0 && n - arr[i - 1] > 1) acc.push("gap");
							acc.push(n);
							return acc;
						}, []).map((n, i) => n === "gap" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "px-2 text-xs text-muted-foreground",
							children: "…"
						}, `gap-${i}`) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: n === page ? "hero" : "quiet",
							onClick: () => setPage(n),
							children: n
						}, n)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "quiet",
							disabled: page === totalPages,
							onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { AdminOrders as component };

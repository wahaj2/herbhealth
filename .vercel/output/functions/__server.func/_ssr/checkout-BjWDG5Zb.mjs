import { i as createServerFn } from "./server-Ca0AjyFE.mjs";
import { t as createServerRpc } from "./createServerRpc-DRx0ojag.mjs";
import { a as literalType, l as stringType, o as numberType, s as objectType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-BjWDG5Zb.js
var checkoutSchema = objectType({
	customer_name: stringType().min(2, "Name is required"),
	phone: stringType().regex(/^(\+92|0)3[0-9]{9}$/, "Enter a valid Pakistani mobile number (03XXXXXXXXX)"),
	email: stringType().email("Invalid email").optional().or(literalType("")),
	address_line1: stringType().min(5, "Address is required"),
	address_line2: stringType().optional(),
	city: stringType().min(1, "City is required"),
	area: stringType().optional(),
	postal_code: stringType().optional(),
	notes: stringType().optional()
});
var placeOrder_createServerFn_handler = createServerRpc({
	id: "9ffed147b32bb82d855966951f6a5ba0d4d2fa1e74ff11e33df73d8ad55a1e33",
	name: "placeOrder",
	filename: "src/routes/checkout.tsx"
}, (opts) => placeOrder.__executeServer(opts));
var placeOrder = createServerFn({ method: "POST" }).validator(objectType({
	form: checkoutSchema,
	items: arrayType(objectType({
		product_id: stringType().nullable(),
		product_name: stringType(),
		variant: stringType().optional(),
		unit_price: numberType(),
		quantity: numberType(),
		line_total: numberType()
	})),
	subtotal: numberType(),
	shipping_fee: numberType(),
	total: numberType()
})).handler(placeOrder_createServerFn_handler, async ({ data }) => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const db = createServerSupabase();
	const productIds = [...new Set(data.items.map((i) => i.product_id).filter((id) => !!id))];
	const [{ data: products }, { data: variants }] = await Promise.all([productIds.length > 0 ? db.from("products").select("id, sku").in("id", productIds) : Promise.resolve({ data: [] }), productIds.length > 0 ? db.from("product_variants").select("product_id, color_name, sku").in("product_id", productIds) : Promise.resolve({ data: [] })]);
	const productSkuMap = new Map((products ?? []).map((p) => [p.id, p.sku]));
	const variantSkuMap = new Map((variants ?? []).map((v) => [`${v.product_id}::${v.color_name}`, v.sku]));
	const resolveSku = (productId, variant) => {
		if (!productId) return null;
		if (variant) {
			const vSku = variantSkuMap.get(`${productId}::${variant}`);
			if (vSku) return vSku;
		}
		return productSkuMap.get(productId) ?? null;
	};
	const { count } = await db.from("orders").select("*", {
		count: "exact",
		head: true
	});
	const orderNumber = `HA-${10001 + (count ?? 0)}`;
	const { data: order, error: orderErr } = await db.from("orders").insert({
		order_number: orderNumber,
		customer_name: data.form.customer_name,
		phone: data.form.phone,
		email: data.form.email || null,
		address_line1: data.form.address_line1,
		address_line2: data.form.address_line2 || null,
		city: data.form.city,
		area: data.form.area || null,
		postal_code: data.form.postal_code || null,
		notes: data.form.notes || null,
		subtotal: data.subtotal,
		shipping_fee: data.shipping_fee,
		total: data.total,
		payment_method: "cod"
	}).select("id, order_number").single();
	if (orderErr || !order) throw new Error(orderErr?.message ?? "Failed to create order");
	const itemRows = data.items.map((item) => ({
		order_id: order.id,
		product_id: item.product_id,
		product_name: item.product_name,
		variant: item.variant || null,
		sku: resolveSku(item.product_id, item.variant),
		unit_price: item.unit_price,
		quantity: item.quantity,
		line_total: item.line_total
	}));
	const { error: itemsErr } = await db.from("order_items").insert(itemRows);
	if (itemsErr) throw new Error(itemsErr.message);
	return { orderNumber: order.order_number };
});
//#endregion
export { placeOrder_createServerFn_handler };

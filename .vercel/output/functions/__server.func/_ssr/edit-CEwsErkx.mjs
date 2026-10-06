import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as Route } from "./router-DekkBrBB.mjs";
import { t as ProductForm } from "./ProductForm-mvR0MK7d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/edit-CEwsErkx.js
var import_jsx_runtime = require_jsx_runtime();
function EditProduct() {
	const { product, categories } = Route.useLoaderData();
	const { id } = Route.useParams();
	const defaults = {
		name: product.name,
		slug: product.slug,
		sku: product.sku ?? void 0,
		price: product.price,
		compare_at_price: product.compare_at_price ?? void 0,
		category_id: product.category_id ?? void 0,
		material: product.material ?? void 0,
		color: product.color ?? void 0,
		sizes: product.sizes ? product.sizes.join(", ") : void 0,
		stock_status: product.stock_status,
		stock_quantity: product.stock_quantity,
		is_bestseller: product.is_bestseller,
		is_active: product.is_active,
		short_description: product.short_description ?? void 0,
		description: product.description ?? void 0,
		care_instructions: product.care_instructions ?? void 0
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl mb-8",
			children: "Edit Product"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductForm, {
			productId: id,
			defaultValues: defaults,
			existingImages: product.product_images,
			existingVariants: product.product_variants,
			categories
		})]
	});
}
//#endregion
export { EditProduct as component };

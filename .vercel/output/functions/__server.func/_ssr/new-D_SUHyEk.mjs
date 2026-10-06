import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as Route$3 } from "./router-DekkBrBB.mjs";
import { t as ProductForm } from "./ProductForm-mvR0MK7d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-D_SUHyEk.js
var import_jsx_runtime = require_jsx_runtime();
function NewProduct() {
	const categories = Route$3.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl mb-8",
			children: "New Product"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductForm, { categories })]
	});
}
//#endregion
export { NewProduct as component };

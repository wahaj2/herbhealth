import { n as __exportAll } from "../_runtime.mjs";
import { u as __exportAll$1 } from "./server-ByAcQfZh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sku-t0ounlFa.js
var sku_t0ounlFa_exports = /* @__PURE__ */ __exportAll({
	n: () => suggestProductSku,
	r: () => suggestVariantSku,
	t: () => sku_exports
});
var sku_exports = /* @__PURE__ */ __exportAll$1({
	skuCode: () => skuCode,
	suggestProductSku: () => suggestProductSku,
	suggestVariantSku: () => suggestVariantSku
});
function skuCode(text, maxLen) {
	const clean = text.trim();
	if (!clean) return "";
	const words = clean.split(/\s+/).filter(Boolean);
	if (words.length > 1) return words.map((w) => w[0]).join("").toUpperCase().slice(0, maxLen);
	return clean.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, maxLen);
}
function suggestProductSku(categoryName, productName) {
	return [skuCode(categoryName || "GEN", 3), skuCode(productName, 4)].filter(Boolean).join("-");
}
function suggestVariantSku(productSkuPrefix, colorName) {
	return [productSkuPrefix, skuCode(colorName, 3)].filter(Boolean).join("-");
}
//#endregion
export { suggestProductSku as n, suggestVariantSku as r, sku_t0ounlFa_exports as t };

// Builds a short uppercase code from a label, e.g. for turning a category or
// product name into part of a SKU like "OIL-LAVENDER-30ML-7F3D".
export function skuCode(text: string, maxLen: number): string {
  const clean = text.trim();
  if (!clean) return "";
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    // Multiple words: use initials, e.g. "Herbal Teas" -> "HT"
    return words
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, maxLen);
  }
  // Single word: use its first few letters, e.g. "Supplements" -> "SUP"
  return clean.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, maxLen);
}

export function suggestProductSku(categoryName: string | undefined, productName: string): string {
  const cat = skuCode(categoryName || "GEN", 3);
  const name = skuCode(productName, 4);
  return [cat, name].filter(Boolean).join("-");
}

export function suggestVariantSku(productSkuPrefix: string, colorName: string): string {
  const color = skuCode(colorName, 3);
  return [productSkuPrefix, color].filter(Boolean).join("-");
}
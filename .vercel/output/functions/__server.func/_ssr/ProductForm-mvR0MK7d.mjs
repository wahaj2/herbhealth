import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as createServerFn } from "./server-Ca0AjyFE.mjs";
import { a as literalType, i as enumType, l as stringType, n as booleanType, o as numberType, r as coerce, s as objectType, t as arrayType } from "../_libs/zod.mjs";
import { n as Upload, o as Trash2, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Button, S as createSsrRpc, v as Input } from "./router-DekkBrBB.mjs";
import { t as Label } from "./label-CDFP0lXv.mjs";
import { t as Textarea } from "./textarea-DUFgF9wH.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CqYFVA3i.mjs";
import { n as Controller, r as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { t as Switch } from "./switch-UW6TFcDV.mjs";
import { n as suggestProductSku, r as suggestVariantSku } from "./sku-t0ounlFa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProductForm-mvR0MK7d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var productSchema = objectType({
	name: stringType().min(2),
	slug: stringType().min(2).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
	sku: stringType().optional(),
	price: coerce.number().positive(),
	compare_at_price: coerce.number().positive().optional().or(literalType("")),
	category_id: stringType().optional(),
	material: stringType().optional(),
	color: stringType().optional(),
	sizes: stringType().optional(),
	stock_status: enumType([
		"in",
		"low",
		"out"
	]),
	stock_quantity: coerce.number().int().min(0).default(0),
	is_bestseller: booleanType().default(false),
	is_active: booleanType().default(true),
	short_description: stringType().optional(),
	description: stringType().optional(),
	care_instructions: stringType().optional()
});
var upsertProduct = createServerFn({ method: "POST" }).validator(objectType({
	id: stringType().optional(),
	values: productSchema,
	imagePaths: arrayType(stringType()),
	deletedImageIds: arrayType(stringType())
})).handler(createSsrRpc("0c4d6abbafb89161582ee8a861db446033f1b4fa380543c454a1adfd1a2934cb"));
var uploadProductImage = createServerFn({ method: "POST" }).validator(objectType({
	productSlug: stringType(),
	fileName: stringType(),
	fileBase64: stringType(),
	mimeType: stringType()
})).handler(createSsrRpc("fc6d154f86373a1c5f526ba751a54bcb98c5f26c0d310ce64e05edd7d6a6e695"));
var upsertProductVariants = createServerFn({ method: "POST" }).validator(objectType({
	productId: stringType(),
	variants: arrayType(objectType({
		id: stringType().optional(),
		colorName: stringType().min(1),
		colorHex: stringType().optional(),
		sku: stringType().optional(),
		imagePath: stringType().nullable(),
		stockQuantity: numberType().int().min(0).nullable()
	})),
	deletedIds: arrayType(stringType()),
	replacedImagePaths: arrayType(stringType())
})).handler(createSsrRpc("e97b995ac11be7727cb89431a0241810e0fdbca6255974791b1ba14cffeae571"));
function getImageUrl(path) {
	return `${{
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_ANON_KEY": "sb_publishable_VMGhELtAWH4tg7d69sdMbw_wZ2ZorEm",
		"VITE_SUPABASE_URL": "https://scujsqjyxtjjqcgxnahd.supabase.co"
	}["VITE_SUPABASE_URL"]}/storage/v1/object/public/product-images/${path}`;
}
function fileToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result.split(",")[1] ?? "");
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
function ProductForm({ defaultValues, productId, existingImages = [], existingVariants = [], categories }) {
	const navigate = useNavigate();
	const fileRef = (0, import_react.useRef)(null);
	const [images, setImages] = (0, import_react.useState)(existingImages.sort((a, b) => a.sort_order - b.sort_order));
	const [newFiles, setNewFiles] = (0, import_react.useState)([]);
	const [deletedIds, setDeletedIds] = (0, import_react.useState)([]);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [variants, setVariants] = (0, import_react.useState)(existingVariants.sort((a, b) => a.sort_order - b.sort_order).map((v) => ({
		id: v.id,
		colorName: v.color_name,
		colorHex: v.color_hex ?? "#1a1a1a",
		sku: v.sku ?? "",
		stockQuantity: v.stock_quantity === null ? "" : String(v.stock_quantity),
		existingImagePath: v.image_path,
		preview: v.image_path ? getImageUrl(v.image_path) : void 0
	})));
	const [deletedVariantIds, setDeletedVariantIds] = (0, import_react.useState)([]);
	const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm({
		resolver: u(productSchema),
		defaultValues: {
			stock_status: "in",
			stock_quantity: 0,
			is_bestseller: false,
			is_active: true,
			...defaultValues
		}
	});
	const nameValue = watch("name");
	const skuValue = watch("sku");
	const categoryIdValue = watch("category_id");
	const autoSlug = () => {
		setValue("slug", nameValue.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
	};
	const autoSku = () => {
		if (skuValue?.trim()) return;
		const categoryName = categories.find((c) => c.id === categoryIdValue)?.name;
		const suggestion = suggestProductSku(categoryName, nameValue || "");
		if (suggestion) setValue("sku", suggestion);
	};
	const handleFiles = (files) => {
		if (!files) return;
		const remaining = 20 - images.length - newFiles.length;
		const toAdd = Array.from(files).slice(0, remaining);
		const allowed = [
			"image/jpeg",
			"image/png",
			"image/webp"
		];
		for (const f of toAdd) {
			if (!allowed.includes(f.type)) {
				toast.error(`${f.name}: only JPEG/PNG/WebP allowed`);
				continue;
			}
			if (f.size > 5242880) {
				toast.error(`${f.name}: must be under 5MB`);
				continue;
			}
			setNewFiles((prev) => [...prev, {
				file: f,
				preview: URL.createObjectURL(f)
			}]);
		}
	};
	const removeExisting = (id) => {
		setImages((prev) => prev.filter((i) => i.id !== id));
		setDeletedIds((prev) => [...prev, id]);
	};
	const removeNew = (idx) => {
		setNewFiles((prev) => prev.filter((_, i) => i !== idx));
	};
	const addVariantRow = () => {
		setVariants((prev) => [...prev, {
			colorName: "",
			colorHex: "#1a1a1a",
			sku: "",
			stockQuantity: "",
			existingImagePath: null
		}]);
	};
	const removeVariantRow = (idx) => {
		setVariants((prev) => {
			const row = prev[idx];
			if (row?.id) setDeletedVariantIds((d) => [...d, row.id]);
			return prev.filter((_, i) => i !== idx);
		});
	};
	const updateVariant = (idx, patch) => {
		setVariants((prev) => prev.map((v, i) => i === idx ? {
			...v,
			...patch
		} : v));
	};
	const suggestVariantSkuFor = (idx) => {
		const v = variants[idx];
		if (!v?.colorName.trim()) {
			toast.error("Enter a color name first");
			return;
		}
		const prefix = skuValue?.trim() || "SKU";
		updateVariant(idx, { sku: suggestVariantSku(prefix, v.colorName) });
	};
	const pickVariantImage = (idx, file) => {
		if (!file) return;
		if (![
			"image/jpeg",
			"image/png",
			"image/webp"
		].includes(file.type)) {
			toast.error("Only JPEG/PNG/WebP allowed");
			return;
		}
		if (file.size > 5242880) {
			toast.error("Image must be under 5MB");
			return;
		}
		updateVariant(idx, {
			newFile: file,
			preview: URL.createObjectURL(file)
		});
	};
	const clearVariantImage = (idx) => {
		updateVariant(idx, {
			newFile: void 0,
			existingImagePath: null,
			preview: void 0
		});
	};
	const onSubmit = async (values) => {
		setUploading(true);
		const uploadedPaths = [];
		try {
			for (const { file } of newFiles) {
				const base64 = await fileToBase64(file);
				const { path } = await uploadProductImage({ data: {
					productSlug: values.slug,
					fileName: file.name,
					fileBase64: base64,
					mimeType: file.type
				} });
				uploadedPaths.push(path);
			}
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Image upload failed");
			setUploading(false);
			return;
		}
		const replacedImagePaths = [];
		const resolvedVariants = [];
		try {
			for (const v of variants) {
				if (!v.colorName.trim()) continue;
				let imagePath = v.existingImagePath;
				if (v.newFile) {
					const base64 = await fileToBase64(v.newFile);
					const { path } = await uploadProductImage({ data: {
						productSlug: values.slug,
						fileName: v.newFile.name,
						fileBase64: base64,
						mimeType: v.newFile.type
					} });
					if (v.existingImagePath) replacedImagePaths.push(v.existingImagePath);
					imagePath = path;
				}
				resolvedVariants.push({
					id: v.id,
					colorName: v.colorName.trim(),
					colorHex: v.colorHex,
					sku: v.sku.trim() || void 0,
					imagePath,
					stockQuantity: v.stockQuantity === "" ? null : Number(v.stockQuantity)
				});
			}
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Variant image upload failed");
			setUploading(false);
			return;
		}
		setUploading(false);
		try {
			const { id: savedProductId } = await upsertProduct({ data: {
				id: productId,
				values,
				imagePaths: uploadedPaths,
				deletedImageIds: deletedIds
			} });
			await upsertProductVariants({ data: {
				productId: savedProductId,
				variants: resolvedVariants,
				deletedIds: deletedVariantIds,
				replacedImagePaths
			} });
			toast.success(productId ? "Product updated" : "Product created");
			navigate({ to: "/admin/products" });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Save failed");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit(onSubmit),
		className: "space-y-8 max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "Basic Info"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name *" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-2 rounded-none",
								...register("name"),
								onBlur: () => {
									autoSlug();
									autoSku();
								}
							}),
							errors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-destructive",
								children: errors.name.message
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Slug *" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "mt-2 rounded-none",
								...register("slug")
							}),
							errors.slug && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-destructive",
								children: errors.slug.message
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: ["SKU ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground font-normal",
						children: "(admin-only, never shown on the site)"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-2 rounded-none font-mono uppercase",
						placeholder: "Auto-filled from category + name — edit freely",
						...register("sku")
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Short Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-2 rounded-none",
						...register("short_description")
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 4,
						className: "mt-2 rounded-none",
						...register("description")
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Care Instructions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						rows: 2,
						className: "mt-2 rounded-none",
						...register("care_instructions")
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: "Pricing (PKR)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Price *" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							className: "mt-2 rounded-none",
							...register("price")
						}),
						errors.price && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-destructive",
							children: errors.price.message
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Compare-at Price" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						className: "mt-2 rounded-none",
						...register("compare_at_price")
					})] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: "Details"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
							control,
							name: "category_id",
							render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: field.value ?? "",
								onValueChange: (v) => {
									field.onChange(v);
									autoSku();
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "mt-2 rounded-none",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select category" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: c.id,
									children: c.name
								}, c.id)) })]
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Form" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-2 rounded-none",
							...register("material")
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Default Variant" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-2 rounded-none",
							...register("color"),
							placeholder: "Used if no variants are added below"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Sizes (comma-separated)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-2 rounded-none",
							placeholder: "Standard, Large",
							...register("sizes")
						})] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: "Stock"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Stock Status *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
						control,
						name: "stock_status",
						render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: field.value,
							onValueChange: field.onChange,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "mt-2 rounded-none",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "in",
									children: "In Stock"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "low",
									children: "Low Stock"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "out",
									children: "Out of Stock"
								})
							] })]
						})
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Quantity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						className: "mt-2 rounded-none",
						...register("stock_quantity")
					})] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg",
					children: "Visibility"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
						control,
						name: "is_active",
						render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: field.value,
								onCheckedChange: field.onChange
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Active (visible on storefront)" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
						control,
						name: "is_bestseller",
						render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: field.value,
								onCheckedChange: field.onChange
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mark as Bestseller" })]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "Images (max 20, JPEG/PNG/WebP, 5MB each)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3",
						children: [
							images.map((img) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative size-24 border border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: getImageUrl(img.storage_path),
									alt: "",
									className: "size-full object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => removeExisting(img.id),
									className: "absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-background/90 hover:text-destructive",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
								})]
							}, img.id)),
							newFiles.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative size-24 border border-gold/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: f.preview,
									alt: "",
									className: "size-full object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => removeNew(i),
									className: "absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-background/90 hover:text-destructive",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
								})]
							}, i)),
							images.length + newFiles.length < 20 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => fileRef.current?.click(),
								className: "size-24 border border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-gold hover:text-gold transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px]",
									children: "Add"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: "image/jpeg,image/png,image/webp",
						multiple: true,
						className: "hidden",
						onChange: (e) => handleFiles(e.target.files)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "Product Variants"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Optional. Add a row per variant the customer can pick on the product page. Leave empty to keep this a single-variant product using the \"Default Variant\" field above."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: variants.map((v, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start gap-3 border border-border bg-card p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative size-16 shrink-0 overflow-hidden border border-border",
									children: [
										v.preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: v.preview,
											alt: "",
											className: "size-full object-cover"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-full bg-secondary/40" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "absolute inset-x-0 bottom-0 cursor-pointer bg-background/90 py-0.5 text-center text-[9px] text-gold",
											children: [v.preview ? "Change" : "Photo", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												accept: "image/jpeg,image/png,image/webp",
												className: "hidden",
												onChange: (e) => pickVariantImage(idx, e.target.files?.[0] ?? null)
											})]
										}),
										v.preview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => clearVariantImage(idx),
											className: "absolute right-0 top-0 bg-background/90 p-0.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-[140px] flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Color name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "mt-1 rounded-none",
										placeholder: "e.g. Midnight Black",
										value: v.colorName,
										onChange: (e) => updateVariant(idx, { colorName: e.target.value })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "w-28",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Swatch color"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "color",
											value: v.colorHex,
											onChange: (e) => updateVariant(idx, { colorHex: e.target.value }),
											className: "size-9 shrink-0 cursor-pointer border border-border p-0"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											className: "rounded-none text-xs",
											value: v.colorHex,
											onChange: (e) => updateVariant(idx, { colorHex: e.target.value })
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "w-36",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "SKU"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => suggestVariantSkuFor(idx),
											className: "text-[10px] text-gold underline",
											children: "Suggest"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "mt-1 rounded-none font-mono text-xs uppercase",
										placeholder: "—",
										value: v.sku,
										onChange: (e) => updateVariant(idx, { sku: e.target.value })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "w-24",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Stock (optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 0,
										className: "mt-1 rounded-none",
										placeholder: "—",
										value: v.stockQuantity,
										onChange: (e) => updateVariant(idx, { stockQuantity: e.target.value })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => removeVariantRow(idx),
									className: "mt-6 p-1 text-muted-foreground hover:text-destructive",
									"aria-label": "Remove color",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})
							]
						}, idx))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "quiet",
						onClick: addVariantRow,
						children: "+ Add Color"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "hero",
					disabled: isSubmitting || uploading,
					children: isSubmitting || uploading ? "Saving…" : productId ? "Update Product" : "Create Product"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "quiet",
					onClick: () => navigate({ to: "/admin/products" }),
					children: "Cancel"
				})]
			})
		]
	});
}
//#endregion
export { ProductForm as t };

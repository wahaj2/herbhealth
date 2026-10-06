import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as createServerFn } from "./server-Ca0AjyFE.mjs";
import { l as stringType, s as objectType } from "../_libs/zod.mjs";
import { m as Pencil, n as Upload, o as Trash2, p as Plus, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Button, S as createSsrRpc, u as Route$8, v as Input } from "./router-DekkBrBB.mjs";
import { t as Label } from "./label-CDFP0lXv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/categories-BAu2PDJy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
var uploadCategoryImage = createServerFn({ method: "POST" }).validator(objectType({
	fileName: stringType(),
	fileBase64: stringType(),
	mimeType: stringType()
})).handler(createSsrRpc("50140c06251d210c5caf148d199bcf318ddfeca172946350c24cd4128bfa5fd5"));
var createCategory = createServerFn({ method: "POST" }).validator(objectType({
	name: stringType().min(2),
	slug: stringType().min(2),
	imagePath: stringType().nullable()
})).handler(createSsrRpc("0c109456bb524fce2c9d327280ec02c729a75c90d704618ace4a24410304ff80"));
var updateCategory = createServerFn({ method: "POST" }).validator(objectType({
	id: stringType(),
	name: stringType().min(2),
	slug: stringType().min(2),
	imagePath: stringType().nullable(),
	oldImagePath: stringType().nullable()
})).handler(createSsrRpc("1cf92ed22c48c12c3fd7d0b02cbb90c5cd8f04e835b55cee9ece2bbe727c2d05"));
var deleteCategory = createServerFn({ method: "POST" }).validator(objectType({ id: stringType() })).handler(createSsrRpc("1143998405e861799fe2fb326c89e72bd88e47a6b0d86991dde59090cc6eefab"));
function fileToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result.split(",")[1]);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
function AdminCategories() {
	const initial = Route$8.useLoaderData();
	const [categories, setCategories] = (0, import_react.useState)(initial);
	const [name, setName] = (0, import_react.useState)("");
	const [slug, setSlug] = (0, import_react.useState)("");
	const [file, setFile] = (0, import_react.useState)(null);
	const [preview, setPreview] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [editName, setEditName] = (0, import_react.useState)("");
	const [editSlug, setEditSlug] = (0, import_react.useState)("");
	const [editFile, setEditFile] = (0, import_react.useState)(null);
	const [editPreview, setEditPreview] = (0, import_react.useState)(null);
	const autoSlug = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
	const pickFile = (f, setF, setP) => {
		if (!f) return;
		if (![
			"image/jpeg",
			"image/png",
			"image/webp"
		].includes(f.type)) {
			toast.error("Only JPEG/PNG/WebP allowed");
			return;
		}
		if (f.size > 5242880) {
			toast.error("Image must be under 5MB");
			return;
		}
		setF(f);
		setP(URL.createObjectURL(f));
	};
	const handleAdd = async (e) => {
		e.preventDefault();
		if (!name.trim() || !slug.trim()) return;
		setSaving(true);
		try {
			let imagePath = null;
			if (file) {
				const base64 = await fileToBase64(file);
				const { path } = await uploadCategoryImage({ data: {
					fileName: file.name,
					fileBase64: base64,
					mimeType: file.type
				} });
				imagePath = path;
			}
			const created = await createCategory({ data: {
				name: name.trim(),
				slug: slug.trim(),
				imagePath
			} });
			setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
			setName("");
			setSlug("");
			setFile(null);
			setPreview(null);
			if (fileRef.current) fileRef.current.value = "";
			toast.success("Category created");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to create category");
		}
		setSaving(false);
	};
	const startEdit = (c) => {
		setEditingId(c.id);
		setEditName(c.name);
		setEditSlug(c.slug);
		setEditFile(null);
		setEditPreview(c.image_path ? getImageUrl(c.image_path) : null);
	};
	const saveEdit = async (c) => {
		setSaving(true);
		try {
			let imagePath = c.image_path;
			if (editFile) {
				const base64 = await fileToBase64(editFile);
				const { path } = await uploadCategoryImage({ data: {
					fileName: editFile.name,
					fileBase64: base64,
					mimeType: editFile.type
				} });
				imagePath = path;
			}
			const updated = await updateCategory({ data: {
				id: c.id,
				name: editName.trim(),
				slug: editSlug.trim(),
				imagePath,
				oldImagePath: editFile ? c.image_path : null
			} });
			setCategories((prev) => prev.map((cat) => cat.id === c.id ? updated : cat).sort((a, b) => a.name.localeCompare(b.name)));
			setEditingId(null);
			toast.success("Category updated");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to update category");
		}
		setSaving(false);
	};
	const handleDelete = async (id, catName) => {
		if (!confirm(`Delete category "${catName}"? This will permanently delete ALL products in this category and their photos. This cannot be undone.`)) return;
		try {
			const { deletedProducts } = await deleteCategory({ data: { id } });
			setCategories((prev) => prev.filter((c) => c.id !== id));
			toast.success(deletedProducts > 0 ? `Category and ${deletedProducts} product${deletedProducts === 1 ? "" : "s"} deleted` : "Category deleted");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Failed to delete category");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl mb-8",
				children: "Categories"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleAdd,
				className: "border border-border bg-card p-5 mb-8 space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg",
						children: "Add Category"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-2 rounded-none",
						value: name,
						onChange: (e) => {
							setName(e.target.value);
							setSlug(autoSlug(e.target.value));
						},
						placeholder: "e.g. Mini Bags"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Slug" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-2 rounded-none",
						value: slug,
						onChange: (e) => setSlug(e.target.value),
						placeholder: "e.g. mini-bags"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Category Image" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center gap-4",
							children: [preview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative size-20 shrink-0 overflow-hidden border border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: preview,
									alt: "",
									className: "size-full object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setFile(null);
										setPreview(null);
										if (fileRef.current) fileRef.current.value = "";
									},
									className: "absolute right-0 top-0 bg-background/80 p-0.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex cursor-pointer items-center gap-2 border border-dashed border-border px-4 py-2 text-xs text-muted-foreground hover:border-gold hover:text-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }),
									preview ? "Replace image" : "Upload image",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: fileRef,
										type: "file",
										accept: "image/jpeg,image/png,image/webp",
										className: "hidden",
										onChange: (e) => pickFile(e.target.files?.[0] ?? null, setFile, setPreview)
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[11px] text-muted-foreground",
							children: "JPEG/PNG/WebP, up to 5MB. Shown on the homepage category tiles."
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						variant: "hero",
						disabled: saving,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4 mr-2" }),
							" ",
							saving ? "Adding…" : "Add Category"
						]
					})
				]
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
								children: "Image"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Slug"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
						className: "divide-y divide-border",
						children: [categories.map((c) => editingId === c.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "relative size-12 overflow-hidden border border-border",
										children: editPreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: editPreview,
											alt: "",
											className: "size-full object-cover"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-full bg-secondary/40" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "mt-1 block cursor-pointer text-[10px] text-gold underline",
										children: ["Change", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "file",
											accept: "image/jpeg,image/png,image/webp",
											className: "hidden",
											onChange: (e) => pickFile(e.target.files?.[0] ?? null, setEditFile, setEditPreview)
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "rounded-none",
										value: editName,
										onChange: (e) => setEditName(e.target.value)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "rounded-none",
										value: editSlug,
										onChange: (e) => setEditSlug(e.target.value)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3 text-right space-x-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "hero",
										disabled: saving,
										onClick: () => saveEdit(c),
										children: "Save"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "quiet",
										onClick: () => setEditingId(null),
										children: "Cancel"
									})]
								})
							]
						}, c.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "bg-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "size-12 overflow-hidden border border-border bg-secondary/40",
										children: c.image_path && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: getImageUrl(c.image_path),
											alt: "",
											className: "size-full object-cover"
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: c.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: c.slug
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3 text-right space-x-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => startEdit(c),
										className: "p-1 text-muted-foreground hover:text-gold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleDelete(c.id, c.name),
										className: "p-1 text-muted-foreground hover:text-destructive",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})]
								})
							]
						}, c.id)), categories.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 4,
							className: "px-4 py-8 text-center text-muted-foreground",
							children: "No categories yet."
						}) })]
					})]
				})
			})
		]
	});
}
//#endregion
export { AdminCategories as component };

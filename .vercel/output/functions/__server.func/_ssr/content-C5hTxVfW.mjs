import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as createServerFn } from "./server-ByAcQfZh.mjs";
import { c as recordType, l as stringType, s as objectType } from "../_libs/zod.mjs";
import { n as Upload, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Button, S as createSsrRpc, l as Route$7, v as Input } from "./router-CZJGKrey.mjs";
import { t as Label } from "./label-CDFP0lXv.mjs";
import { t as Textarea } from "./textarea-DUFgF9wH.mjs";
import { t as Switch } from "./switch-UW6TFcDV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/content-C5hTxVfW.js
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
function fileToBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result.split(",")[1] ?? "");
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
var saveContent = createServerFn({ method: "POST" }).validator(objectType({ entries: recordType(stringType(), stringType()) })).handler(createSsrRpc("a8169d1e8ae5abf9a7263caefea5181bfd2fb562cc01048c5fc29c4a867a4632"));
var uploadContentImage = createServerFn({ method: "POST" }).validator(objectType({
	fileName: stringType(),
	fileBase64: stringType(),
	mimeType: stringType()
})).handler(createSsrRpc("b993bed6c771c7965a9cb9026a5ed39f9a2c287dc1fe8a58c3827c46f3c5f8db"));
var FIELDS = [
	{
		key: "hero_eyebrow",
		label: "Homepage hero — small tagline above the title",
		type: "text"
	},
	{
		key: "hero_title",
		label: "Homepage hero — main title",
		type: "text"
	},
	{
		key: "hero_subtitle",
		label: "Homepage hero — subtitle paragraph",
		type: "textarea"
	},
	{
		key: "promo_banner_text",
		label: "Site-wide promo banner text (leave blank to hide)",
		type: "text"
	},
	{
		key: "offer_code",
		label: "Newsletter / exit-offer discount code",
		type: "text"
	},
	{
		key: "offer_discount_text",
		label: "Newsletter / exit-offer headline (e.g. '10% off your first order')",
		type: "text"
	},
	{
		key: "newsletter_heading",
		label: "Newsletter section heading",
		type: "text"
	},
	{
		key: "newsletter_subtext",
		label: "Newsletter section subtext",
		type: "textarea"
	}
];
function AdminContent() {
	const initial = Route$7.useLoaderData();
	const [values, setValues] = (0, import_react.useState)(initial);
	const [bannerEnabled, setBannerEnabled] = (0, import_react.useState)(initial["promo_banner_enabled"] === "true");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [heroFile, setHeroFile] = (0, import_react.useState)(null);
	const [heroPreview, setHeroPreview] = (0, import_react.useState)(initial["hero_image_path"] ? getImageUrl(initial["hero_image_path"]) : null);
	const [uploadingHero, setUploadingHero] = (0, import_react.useState)(false);
	const heroFileRef = (0, import_react.useRef)(null);
	const set = (key, value) => setValues((prev) => ({
		...prev,
		[key]: value
	}));
	const pickHeroImage = (file) => {
		if (!file) return;
		if (![
			"image/jpeg",
			"image/png",
			"image/webp"
		].includes(file.type)) {
			toast.error("Only JPEG/PNG/WebP allowed");
			return;
		}
		if (file.size > 8388608) {
			toast.error("Image must be under 8MB");
			return;
		}
		setHeroFile(file);
		setHeroPreview(URL.createObjectURL(file));
	};
	const clearHeroImage = () => {
		setHeroFile(null);
		setHeroPreview(null);
		set("hero_image_path", "");
		if (heroFileRef.current) heroFileRef.current.value = "";
	};
	const handleSave = async () => {
		setSaving(true);
		setUploadingHero(true);
		try {
			let heroImagePath = values["hero_image_path"] ?? "";
			if (heroFile) {
				const base64 = await fileToBase64(heroFile);
				const { path } = await uploadContentImage({ data: {
					fileName: heroFile.name,
					fileBase64: base64,
					mimeType: heroFile.type
				} });
				heroImagePath = path;
			}
			setUploadingHero(false);
			await saveContent({ data: { entries: {
				...values,
				hero_image_path: heroImagePath,
				promo_banner_enabled: String(bannerEnabled)
			} } });
			setHeroFile(null);
			toast.success("Content saved");
		} catch (e) {
			setUploadingHero(false);
			toast.error(e instanceof Error ? e.message : "Failed to save content");
		}
		setSaving(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl mb-2",
				children: "Content & Offers"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-8 text-sm text-muted-foreground",
				children: "Edit homepage copy and the newsletter/exit-intent offer without touching code."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6 border border-border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b border-border pb-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Homepage Hero / Slider Image" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Shown at the top of the homepage. If nothing is uploaded here, the site falls back to its current default image automatically."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center gap-4",
								children: [heroPreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative h-24 w-40 overflow-hidden border border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: heroPreview,
										alt: "",
										className: "size-full object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: clearHeroImage,
										className: "absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-background/90 hover:text-destructive",
										title: "Remove — reverts to the default image",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3" })
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-24 w-40 place-items-center border border-dashed border-border text-[10px] text-muted-foreground",
									children: "Using default"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex cursor-pointer items-center gap-2 border border-dashed border-border px-4 py-2 text-xs text-muted-foreground hover:border-gold hover:text-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }),
										heroPreview ? "Replace image" : "Upload image",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											ref: heroFileRef,
											type: "file",
											accept: "image/jpeg,image/png,image/webp",
											className: "hidden",
											onChange: (e) => pickHeroImage(e.target.files?.[0] ?? null)
										})
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Show site-wide promo banner" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Displays under the header when on."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: bannerEnabled,
							onCheckedChange: setBannerEnabled
						})]
					}),
					FIELDS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: f.label }), f.type === "textarea" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						className: "mt-2 rounded-none",
						rows: 3,
						value: values[f.key] ?? "",
						onChange: (e) => set(f.key, e.target.value)
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-2 rounded-none",
						value: values[f.key] ?? "",
						onChange: (e) => set(f.key, e.target.value)
					})] }, f.key)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "hero",
						onClick: handleSave,
						disabled: saving,
						children: saving ? uploadingHero ? "Uploading image…" : "Saving…" : "Save Changes"
					})
				]
			})
		]
	});
}
//#endregion
export { AdminContent as component };

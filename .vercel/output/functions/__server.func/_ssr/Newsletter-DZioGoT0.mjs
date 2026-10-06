import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Button, _ as supabase, g as subscribeEmail, v as Input } from "./router-CZJGKrey.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Newsletter-DZioGoT0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Newsletter() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [content, setContent] = (0, import_react.useState)({
		heading: "Join the Roots Club",
		subtext: "Early access to new blends, wellness notes and members-only offers.",
		offerCode: "HERB10",
		offerText: "10% off your first order"
	});
	(0, import_react.useEffect)(() => {
		supabase.from("site_content").select("key, value").in("key", [
			"newsletter_heading",
			"newsletter_subtext",
			"offer_code",
			"offer_discount_text"
		]).then(({ data }) => {
			if (!data) return;
			const map = Object.fromEntries(data.map((r) => [r.key, r.value]));
			setContent({
				heading: map["newsletter_heading"] || "Join the Roots Club",
				subtext: map["newsletter_subtext"] || "Early access to new blends, wellness notes and members-only offers.",
				offerCode: map["offer_code"] || "HERB10",
				offerText: map["offer_discount_text"] || "10% off your first order"
			});
		});
	}, []);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			await subscribeEmail({ data: {
				email,
				source: "newsletter"
			} });
			toast("You're on the list", { description: `Code ${content.offerCode} sent to ${email}.` });
			setEmail("");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Something went wrong");
		}
		setSubmitting(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-primary px-5 py-20 text-primary-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-xl text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.28em] text-gold",
					children: content.offerText
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 font-display text-3xl sm:text-4xl",
					children: content.heading
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-primary-foreground/70",
					children: content.subtext
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-8 flex flex-col gap-3 sm:flex-row",
					onSubmit: handleSubmit,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						required: true,
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: "Enter your email",
						className: "h-12 rounded-none border-primary-foreground/25 bg-transparent text-primary-foreground placeholder:text-primary-foreground/50"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						variant: "gold",
						size: "xl",
						disabled: submitting,
						children: submitting ? "Joining…" : `Claim ${content.offerCode}`
					})]
				})
			]
		})
	});
}
//#endregion
export { Newsletter as t };

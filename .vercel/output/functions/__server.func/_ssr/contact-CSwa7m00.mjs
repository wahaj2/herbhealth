import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { C as Instagram, T as Facebook, b as Mail } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as Button, v as Input } from "./router-CZJGKrey.mjs";
import { t as Label } from "./label-CDFP0lXv.mjs";
import { t as Textarea } from "./textarea-DUFgF9wH.mjs";
import { i as AccordionTrigger, n as AccordionContent, r as AccordionItem, t as Accordion } from "./accordion-2fxVN1ha.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-CSwa7m00.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var faqs = [
	{
		q: "How long does delivery take?",
		a: "Orders are dispatched within 24 hours. Standard delivery takes 2–5 business days depending on your city. Major cities (Karachi, Lahore, Islamabad) are typically 2–3 days. Delivery is free on orders over Rs 3,000."
	},
	{
		q: "What is your return policy?",
		a: "You have 7 days from delivery to return any unopened, unused product in its original packaging. Contact us at hello@herbhealth.store to arrange a return."
	},
	{
		q: "Are your products lab-tested?",
		a: "Yes. Every batch is tested for purity before it ships, and the results are summarized on each product page."
	},
	{
		q: "Are your herbs organic and natural?",
		a: "We source organically grown herbs wherever possible. Every product page lists the exact ingredients, form and any allergen notes."
	},
	{
		q: "How does Cash on Delivery work?",
		a: "We only accept Cash on Delivery (COD). Place your order online and pay the exact amount in cash to the rider when your order arrives. No card or online payment is required."
	}
];
function Contact() {
	const [sent, setSent] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "pt-28",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-3xl px-5 py-14 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "We'd love to hear from you"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 font-display text-4xl sm:text-5xl",
						children: "Contact HerbHealth"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-sm text-muted-foreground",
						children: "Wellness advice, order questions or wholesale enquiries — we reply within one business day."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto grid max-w-6xl gap-12 px-5 pb-16 lg:grid-cols-[1fr_320px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-5",
					onSubmit: (e) => {
						e.preventDefault();
						setSent(true);
						toast("Message sent", { description: "We'll be in touch within one business day." });
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "name",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "name",
							required: true,
							className: "mt-2 rounded-none",
							placeholder: "Your name"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "email",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							type: "email",
							required: true,
							className: "mt-2 rounded-none",
							placeholder: "you@email.com"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "message",
							children: "Message"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "message",
							required: true,
							rows: 6,
							className: "mt-2 rounded-none",
							placeholder: "How can we help?"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "hero",
							size: "xl",
							children: "Send message"
						}),
						sent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gold",
							children: "Thank you — your message is on its way."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "space-y-6 border border-border bg-card p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "mailto:hello@herbhealth.store",
							className: "mt-2 flex items-center gap-2 text-sm hover:text-gold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4" }), " hello@herbhealth.store"]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "Follow"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "https://www.instagram.com/",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "flex items-center gap-2 hover:text-gold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "size-4" }), " @herbhealth"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "https://pinterest.com",
									className: "flex items-center gap-2 hover:text-gold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid size-4 place-items-center text-xs",
										children: "P"
									}), " herbhealth"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "https://www.facebook.com/",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "flex items-center gap-2 hover:text-gold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "size-4" }), " HerbHealth"]
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "Support hours"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Mon–Sat, 9am–6pm"
						})] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "faq",
				className: "mx-auto max-w-3xl scroll-mt-28 px-5 pb-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "Good to know"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-3xl",
						children: "Frequently asked questions"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
					type: "single",
					collapsible: true,
					className: "mt-10",
					children: faqs.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
						value: f.q,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
							className: "text-left",
							children: f.q
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, { children: f.a })]
					}, f.q))
				})]
			})
		]
	});
}
//#endregion
export { Contact as component };

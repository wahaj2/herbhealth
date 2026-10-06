import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as createServerFn } from "./server-Ca0AjyFE.mjs";
import { a as literalType, l as stringType, o as numberType, s as objectType, t as arrayType } from "../_libs/zod.mjs";
import { C as PAKISTAN_CITIES, D as Button, E as useShop, S as createSsrRpc, v as Input, w as formatPrice } from "./router-DekkBrBB.mjs";
import { t as Label } from "./label-CDFP0lXv.mjs";
import { t as Textarea } from "./textarea-DUFgF9wH.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-CqYFVA3i.mjs";
import { r as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-BOQAZDyZ.js
var import_jsx_runtime = require_jsx_runtime();
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
})).handler(createSsrRpc("9ffed147b32bb82d855966951f6a5ba0d4d2fa1e74ff11e33df73d8ad55a1e33"));
function Checkout() {
	const { lines, subtotal, clearCart } = useShop();
	const navigate = useNavigate();
	const shippingFee = subtotal >= 3e3 ? 0 : 200;
	const total = subtotal + shippingFee;
	const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({ resolver: u(checkoutSchema) });
	if (lines.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "pt-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-xl px-5 py-20 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl",
				children: "Your cart is empty"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "hero",
				className: "mt-6",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/shop",
					children: "Shop the collection"
				})
			})]
		})
	});
	const onSubmit = async (form) => {
		const { orderNumber } = await placeOrder({ data: {
			form,
			items: lines.map(({ product, qty, variant }) => ({
				product_id: product.id ?? null,
				product_name: product.name,
				variant,
				unit_price: product.price,
				quantity: qty,
				line_total: product.price * qty
			})),
			subtotal,
			shipping_fee: shippingFee,
			total
		} });
		clearCart();
		navigate({
			to: "/order-confirmation/$orderNumber",
			params: { orderNumber }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "pt-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-5 pb-20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "py-10 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Almost there"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl sm:text-5xl",
					children: "Checkout"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit(onSubmit),
				className: "grid gap-12 lg:grid-cols-[1fr_380px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: "Delivery Details"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "customer_name",
									children: "Full Name *"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "customer_name",
									className: "mt-2 rounded-none",
									placeholder: "Your full name",
									...register("customer_name")
								}),
								errors.customer_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-destructive",
									children: errors.customer_name.message
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "phone",
									children: "Mobile Number *"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "phone",
									className: "mt-2 rounded-none",
									placeholder: "03XXXXXXXXX",
									...register("phone")
								}),
								errors.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-destructive",
									children: errors.phone.message
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								children: "Email (optional)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								type: "email",
								className: "mt-2 rounded-none",
								placeholder: "you@email.com",
								...register("email")
							}),
							errors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-destructive",
								children: errors.email.message
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "address_line1",
								children: "Address *"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "address_line1",
								className: "mt-2 rounded-none",
								placeholder: "House/flat no., street name",
								...register("address_line1")
							}),
							errors.address_line1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-destructive",
								children: errors.address_line1.message
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "address_line2",
							children: "Address Line 2 (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "address_line2",
							className: "mt-2 rounded-none",
							placeholder: "Apartment, block, landmark",
							...register("address_line2")
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "city",
									children: "City *"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									onValueChange: (v) => setValue("city", v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "mt-2 rounded-none",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select city" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PAKISTAN_CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: c,
										children: c
									}, c)) })]
								}),
								errors.city && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-destructive",
									children: errors.city.message
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "area",
								children: "Area / Neighbourhood (optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "area",
								className: "mt-2 rounded-none",
								placeholder: "e.g. DHA Phase 5",
								...register("area")
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "postal_code",
							children: "Postal Code (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "postal_code",
							className: "mt-2 rounded-none",
							placeholder: "e.g. 75500",
							...register("postal_code")
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "notes",
							children: "Order Notes (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "notes",
							rows: 3,
							className: "mt-2 rounded-none",
							placeholder: "Delivery instructions, gate code, etc.",
							...register("notes")
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-gold/40 bg-gold/5 p-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: "Payment: Cash on Delivery"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-muted-foreground",
								children: "Please keep the exact amount ready for the rider. No card or online payment is required."
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl",
							children: "Order Summary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-border bg-card p-6 space-y-4",
							children: [lines.map(({ product, qty, variant }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: product.images[0],
										alt: product.name,
										className: "size-16 shrink-0 object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-display",
												children: product.name
											}),
											variant && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: variant
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-muted-foreground",
												children: ["Qty: ", qty]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm",
										children: formatPrice(product.price * qty)
									})
								]
							}, `${product.slug}-${variant ?? "default"}`)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-border pt-4 space-y-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Subtotal"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPrice(subtotal) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Delivery"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: shippingFee === 0 ? "Free" : formatPrice(shippingFee) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between font-display text-lg pt-2 border-t border-border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPrice(total) })]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "hero",
							size: "xl",
							className: "w-full",
							disabled: isSubmitting,
							children: isSubmitting ? "Placing Order…" : "Place Order (COD)"
						})
					]
				})]
			})]
		})
	});
}
//#endregion
export { Checkout as component };

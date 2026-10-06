import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, q as redirect, v as createFileRoute, x as useNavigate, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as Slot, v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as TSS_SERVER_FUNCTION, i as createServerFn, o as getServerFnById, u as __exportAll } from "./server-ByAcQfZh.mjs";
import { a as literalType, i as enumType, l as stringType, s as objectType } from "../_libs/zod.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as createBrowserClient } from "../_libs/@supabase/ssr+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Analytics } from "../_libs/vercel__analytics.mjs";
import { C as Instagram, T as Facebook, _ as Minus, b as Mail, l as ShoppingBag, o as Trash2, p as Plus, t as X, v as Menu, w as Heart } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-Dyzfq_l2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline",
			hero: "bg-primary text-primary-foreground rounded-none tracking-[0.2em] uppercase text-xs hover:bg-gold hover:text-gold-foreground",
			gold: "bg-gold text-gold-foreground rounded-none tracking-[0.2em] uppercase text-xs hover:bg-primary hover:text-primary-foreground",
			quiet: "border border-foreground/25 bg-transparent rounded-none tracking-[0.2em] uppercase text-xs hover:bg-primary hover:text-primary-foreground hover:border-primary"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			xl: "h-12 px-10",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/createSsrRpc-BCHicYaA.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-CZJGKrey.js
var styles_default = "/assets/styles-rf_QxCM7.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var ShopContext = (0, import_react.createContext)(null);
var CART_KEY = "ha_cart";
var WISH_KEY = "ha_wishlist";
function read(key, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function sameLine(a, slug, variant) {
	return a.slug === slug && (a.variant ?? "") === (variant ?? "");
}
function ShopProvider({ children }) {
	const [cart, setCart] = (0, import_react.useState)([]);
	const [wishlist, setWishlist] = (0, import_react.useState)([]);
	const [cartOpen, setCartOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setCart(read(CART_KEY, []));
		setWishlist(read(WISH_KEY, []));
	}, []);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
	}, [cart]);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
	}, [wishlist]);
	const value = (0, import_react.useMemo)(() => {
		const lines = cart.map((line) => ({
			product: line.snapshot,
			qty: line.qty,
			variant: line.variant
		}));
		return {
			cart,
			wishlist,
			cartOpen,
			setCartOpen,
			lines,
			count: cart.reduce((sum, l) => sum + l.qty, 0),
			subtotal: lines.reduce((sum, l) => sum + l.product.price * l.qty, 0),
			addToCart: (product, qty = 1, variant) => setCart((prev) => {
				if (prev.find((l) => sameLine(l, product.slug, variant))) return prev.map((l) => sameLine(l, product.slug, variant) ? {
					...l,
					qty: l.qty + qty
				} : l);
				return [...prev, {
					slug: product.slug,
					qty,
					variant,
					snapshot: product
				}];
			}),
			removeFromCart: (slug, variant) => setCart((prev) => prev.filter((l) => !sameLine(l, slug, variant))),
			setQty: (slug, qty, variant) => setCart((prev) => qty <= 0 ? prev.filter((l) => !sameLine(l, slug, variant)) : prev.map((l) => sameLine(l, slug, variant) ? {
				...l,
				qty
			} : l)),
			toggleWishlist: (slug) => setWishlist((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]),
			clearCart: () => setCart([])
		};
	}, [
		cart,
		wishlist,
		cartOpen
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopContext.Provider, {
		value,
		children
	});
}
function useShop() {
	const ctx = (0, import_react.useContext)(ShopContext);
	if (!ctx) throw new Error("useShop must be used inside ShopProvider");
	return ctx;
}
var nav = [
	{
		to: "/",
		label: "Home"
	},
	{
		to: "/shop",
		label: "Shop"
	},
	{
		to: "/about",
		label: "About"
	},
	{
		to: "/contact",
		label: "Contact"
	}
];
function Header() {
	const { count, wishlist, setCartOpen } = useShop();
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 24);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", scrolled ? "bg-background/85 backdrop-blur-md border-b border-border" : "bg-transparent border-b border-transparent"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "md:hidden -ml-2 p-2",
					onClick: () => setOpen((v) => !v),
					"aria-label": "Toggle menu",
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "font-display text-lg tracking-[0.18em] uppercase sm:text-xl",
					children: ["Herb", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-gold",
						children: "Health"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-9 md:flex",
					children: nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						className: "text-xs uppercase tracking-[0.2em] text-foreground/75 transition-colors hover:text-gold",
						activeProps: { className: "text-gold" },
						activeOptions: { exact: item.to === "/" },
						children: item.label
					}, item.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						search: { wishlist: true },
						className: "relative p-2",
						"aria-label": "Wishlist",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-5" }), wishlist.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-gold text-[10px] text-gold-foreground",
							children: wishlist.length
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "relative p-2",
						onClick: () => setCartOpen(true),
						"aria-label": "Open cart",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-5" }), count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-gold text-[10px] text-gold-foreground",
							children: count
						})]
					})]
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border bg-background md:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "mx-auto flex max-w-6xl flex-col px-5 py-3",
				children: nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					onClick: () => setOpen(false),
					className: "py-3 text-xs uppercase tracking-[0.2em] text-foreground/80",
					children: item.label
				}, item.to))
			})
		})]
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-24 border-t border-border bg-secondary/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-lg tracking-[0.18em] uppercase",
					children: ["Herb", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-gold",
						children: "Health"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-xs text-sm text-muted-foreground",
					children: "Natural wellness, gently sourced. Herbal oils, teas and tonics for a more balanced everyday."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Shop"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-2 text-sm",
					children: [
						"Essential Oils",
						"Herbal Teas",
						"Supplements",
						"Tinctures & Tonics"
					].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						search: { category: c },
						className: "text-muted-foreground transition-colors hover:text-gold",
						children: c
					}) }, c))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Company"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/about",
							className: "text-muted-foreground hover:text-gold",
							children: "About Us"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contact",
							className: "text-muted-foreground hover:text-gold",
							children: "Contact"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contact",
							hash: "faq",
							className: "text-muted-foreground hover:text-gold",
							children: "Shipping & Returns"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/contact",
							hash: "faq",
							className: "text-muted-foreground hover:text-gold",
							children: "Privacy Policy"
						}) })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "Contact"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "mailto:hello@herbhealth.store",
						className: "mt-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-gold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4" }), " hello@herbhealth.store"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://www.instagram.com/",
								target: "_blank",
								rel: "noopener noreferrer",
								"aria-label": "Instagram",
								className: "hover:text-gold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://pinterest.com",
								"aria-label": "Pinterest",
								className: "hover:text-gold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
									viewBox: "0 0 24 24",
									className: "size-5",
									fill: "currentColor",
									"aria-hidden": "true",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.1-2 .1-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.6 2.2-.9 3.4-.2 1 .5 1.9 1.5 1.9 1.8 0 3.2-1.9 3.2-4.7 0-2.4-1.8-4.1-4.3-4.1-2.9 0-4.6 2.2-4.6 4.4 0 .9.3 1.8.8 2.3.1.1.1.2.1.3l-.3 1c0 .2-.2.2-.3.1-1.2-.6-2-2.4-2-3.8 0-3.1 2.3-6 6.5-6 3.4 0 6.1 2.4 6.1 5.7 0 3.4-2.1 6.2-5.1 6.2-1 0-1.9-.5-2.2-1.1l-.6 2.3c-.2.9-.8 2-1.2 2.6A10 10 0 1 0 12 2z" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://www.facebook.com/",
								target: "_blank",
								rel: "noopener noreferrer",
								"aria-label": "Facebook",
								className: "hover:text-gold",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "size-5" })
							})
						]
					})
				] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-border px-5 py-5 text-center text-xs text-muted-foreground",
			children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" HerbHealth · herbhealth.store · Rooted in nature, made for everyday."
			]
		})]
	});
}
var Sheet = Dialog$1;
var SheetPortal = DialogPortal$1;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay$1.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent$1.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle$1.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription$1.displayName;
var stockLabel = {
	in: "In Stock",
	low: "Low Stock",
	out: "Sold Out"
};
var formatPrice = (value) => `Rs ${Math.round(value).toLocaleString("en-PK")}`;
var FREE_SHIPPING_THRESHOLD = 3e3;
var PAKISTAN_CITIES = [
	"Karachi",
	"Lahore",
	"Islamabad",
	"Rawalpindi",
	"Faisalabad",
	"Multan",
	"Peshawar",
	"Quetta",
	"Sialkot",
	"Gujranwala",
	"Hyderabad",
	"Abbottabad",
	"Bahawalpur",
	"Sargodha",
	"Sukkur",
	"Other"
];
function CartDrawer() {
	const { cartOpen, setCartOpen, lines, setQty, removeFromCart, subtotal } = useShop();
	const navigate = useNavigate();
	const shippingFee = subtotal >= 3e3 ? 0 : 200;
	const total = subtotal + shippingFee;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: cartOpen,
		onOpenChange: setCartOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			className: "flex w-full flex-col sm:max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
				className: "font-display text-xl",
				children: "Your Cart"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, { children: subtotal >= 3e3 ? "You've unlocked free delivery!" : `Free delivery on orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)}.` })] }), lines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col items-center justify-center gap-4 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Your cart is still empty."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "hero",
					onClick: () => setCartOpen(false),
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						children: "Shop the collection"
					})
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 space-y-5 overflow-y-auto py-4",
				children: lines.map(({ product, qty, variant }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: product.images[0],
						alt: product.name,
						width: 1024,
						height: 1024,
						loading: "lazy",
						className: "size-20 shrink-0 object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-sm",
								children: product.name
							}),
							variant && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: variant
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm",
								children: formatPrice(product.price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "grid size-7 place-items-center border border-border",
										onClick: () => setQty(product.slug, qty - 1, variant),
										"aria-label": "Decrease quantity",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-3" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-6 text-center text-sm",
										children: qty
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "grid size-7 place-items-center border border-border",
										onClick: () => setQty(product.slug, qty + 1, variant),
										"aria-label": "Increase quantity",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "ml-auto text-muted-foreground hover:text-destructive",
										onClick: () => removeFromCart(product.slug, variant),
										"aria-label": "Remove item",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})
								]
							})
						]
					})]
				}, `${product.slug}-${variant ?? "default"}`))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 border-t border-border pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Subtotal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPrice(subtotal) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Delivery"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: shippingFee === 0 ? "Free" : formatPrice(shippingFee) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between font-display text-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPrice(total) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "hero",
						size: "xl",
						className: "w-full",
						onClick: () => {
							setCartOpen(false);
							navigate({ to: "/checkout" });
						},
						children: "Proceed to Checkout"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-[11px] text-muted-foreground",
						children: "Cash on Delivery — pay when your order arrives."
					})
				]
			})] })]
		})
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var supabaseUrl = {
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
}["VITE_SUPABASE_URL"];
var supabaseAnonKey = {
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
}["VITE_SUPABASE_ANON_KEY"];
if (!supabaseUrl || !supabaseAnonKey) throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables");
var supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
var subscribeEmail = createServerFn({ method: "POST" }).validator(objectType({
	email: stringType().email(),
	source: enumType(["newsletter", "exit_intent"])
})).handler(createSsrRpc("93f0fb5996db0ee0b80c54c88651bdefe61bbe5ba4f3daad0eceeb9409aef363"));
var KEY = "hh_exit_offer_seen";
function ExitIntentPopup() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [offerCode, setOfferCode] = (0, import_react.useState)("HERB10");
	const [offerText, setOfferText] = (0, import_react.useState)("10% off your first order");
	(0, import_react.useEffect)(() => {
		supabase.from("site_content").select("key, value").in("key", ["offer_code", "offer_discount_text"]).then(({ data }) => {
			if (!data) return;
			const map = Object.fromEntries(data.map((r) => [r.key, r.value]));
			if (map["offer_code"]) setOfferCode(map["offer_code"]);
			if (map["offer_discount_text"]) setOfferText(map["offer_discount_text"]);
		});
	}, []);
	(0, import_react.useEffect)(() => {
		if (window.localStorage.getItem(KEY)) return;
		const onLeave = (e) => {
			if (e.clientY <= 0) {
				setOpen(true);
				window.localStorage.setItem(KEY, "1");
				document.removeEventListener("mouseout", onLeave);
			}
		};
		const timer = window.setTimeout(() => document.addEventListener("mouseout", onLeave), 5e3);
		return () => {
			window.clearTimeout(timer);
			document.removeEventListener("mouseout", onLeave);
		};
	}, []);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			await subscribeEmail({ data: {
				email,
				source: "exit_intent"
			} });
			setOpen(false);
			toast("Welcome to HerbHealth", { description: `Code ${offerCode} sent to ${email}.` });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Something went wrong");
		}
		setSubmitting(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Before you go"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "font-display text-3xl",
					children: offerText
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Join the Roots Club for early access to new blends and wellness notes." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-2 flex flex-col gap-2 sm:flex-row",
					onSubmit: handleSubmit,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						required: true,
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: "you@email.com",
						className: "rounded-none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						variant: "gold",
						size: "xl",
						disabled: submitting,
						children: submitting ? "Joining…" : `Claim ${offerCode}`
					})]
				})
			]
		})
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-7xl text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center bg-primary px-6 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-gold hover:text-gold-foreground",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center bg-primary px-6 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground hover:bg-gold hover:text-gold-foreground",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center border border-input px-6 py-3 text-xs uppercase tracking-[0.2em] text-foreground hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$19 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "HerbHealth — Natural Wellness & Balanced Living" },
			{
				name: "description",
				content: "Herbal oils, teas, supplements and tonics for everyday wellness. Naturally sourced, small-batch made. Free delivery on orders over Rs 3,000."
			},
			{
				property: "og:site_name",
				content: "HerbHealth"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "Organization",
				name: "HerbHealth",
				url: "https://herbhealth.store",
				email: "hello@herbhealth.store",
				sameAs: [
					"https://www.instagram.com/",
					"https://pinterest.com",
					"https://www.facebook.com/"
				]
			})
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$19.useRouteContext();
	const isAdmin = useRouterState({ select: (s) => s.location.pathname }).startsWith("/admin");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ShopProvider, { children: [
			!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {}),
			!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExitIntentPopup, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Analytics, {})
		] })
	});
}
var $$splitComponentImporter$18 = () => import("./routes-CNnM9FIR.mjs");
var fetchHomeData = createServerFn({ method: "GET" }).handler(createSsrRpc("26dbbcbe40063e8aedfd343cf1dfd4dfe5589f24591c0ba35e80c611d7c57c7c"));
var Route$18 = createFileRoute("/")({
	loader: () => fetchHomeData(),
	head: () => ({
		meta: [
			{ title: "HerbHealth — Natural Wellness & Balanced Living" },
			{
				name: "description",
				content: "Herbal oils, teas, supplements and tonics for everyday wellness. Naturally sourced, small-batch made. Free delivery on orders over Rs 3,000."
			},
			{
				property: "og:title",
				content: "HerbHealth — Natural Wellness & Balanced Living"
			},
			{
				property: "og:description",
				content: "Small-batch herbal wellness, made honestly. Rooted in nature, made for you."
			},
			{
				property: "og:url",
				content: "/"
			}
		],
		links: [{
			rel: "canonical",
			href: "/"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./about-BlbD_8ek.mjs");
var Route$17 = createFileRoute("/about")({
	head: () => ({
		meta: [
			{ title: "Our Story — HerbHealth" },
			{
				name: "description",
				content: "HerbHealth was born from a love of traditional herbal remedies and honest sourcing. Meet the founder and our commitment to natural, small-batch wellness."
			},
			{
				property: "og:title",
				content: "Our Story — HerbHealth"
			},
			{
				property: "og:description",
				content: "Naturally sourced, small-batch made, honestly labelled."
			},
			{
				property: "og:url",
				content: "/about"
			}
		],
		links: [{
			rel: "canonical",
			href: "/about"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./route-DisDR3kv.mjs");
var checkAdminSession = createServerFn({ method: "GET" }).handler(createSsrRpc("15e979322b805e51ff201ebb738cff155eca4cf23b24de0f24d34dd6c3c0ff13"));
var Route$16 = createFileRoute("/admin")({
	beforeLoad: async ({ location }) => {
		if (location.pathname === "/admin/login") return;
		const { authenticated } = await checkAdminSession();
		if (!authenticated) throw redirect({ to: "/admin/login" });
	},
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./checkout-2mP3yv5L.mjs");
objectType({
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
var Route$15 = createFileRoute("/checkout")({
	head: () => ({ meta: [{ title: "Checkout — HerbHealth" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./contact-CSwa7m00.mjs");
var Route$14 = createFileRoute("/contact")({
	head: () => ({
		meta: [
			{ title: "Contact & FAQ — HerbHealth" },
			{
				name: "description",
				content: "Questions about shipping, returns or exchanges? Email hello@herbhealth.store or send us a message — we reply within one business day."
			},
			{
				property: "og:title",
				content: "Contact & FAQ — HerbHealth"
			},
			{
				property: "og:description",
				content: "We reply within one business day. Shipping, returns and exchange answers inside."
			},
			{
				property: "og:url",
				content: "/contact"
			}
		],
		links: [{
			rel: "canonical",
			href: "/contact"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./shop-udOdaUx8.mjs");
var fetchShopData = createServerFn({ method: "GET" }).handler(createSsrRpc("7bad808d98f4f7ab0ca5e1a25feb4f379a64f6a4ff1c7fe9e3b77c62f2dfb29d"));
var Route$13 = createFileRoute("/shop")({
	validateSearch: (search) => ({
		...typeof search["category"] === "string" ? { category: search["category"] } : {},
		...search["wishlist"] ? { wishlist: true } : {}
	}),
	loader: () => fetchShopData(),
	head: () => ({
		meta: [
			{ title: "Shop All Wellness Products — HerbHealth" },
			{
				name: "description",
				content: "Browse the full HerbHealth collection: essential oils, herbal teas, supplements and tinctures. Filter by form, variant and price."
			},
			{
				property: "og:title",
				content: "Shop All Wellness Products — HerbHealth"
			},
			{
				property: "og:description",
				content: "Filter by form, variant, price and category. Free delivery on orders over Rs 3,000."
			},
			{
				property: "og:url",
				content: "/shop"
			}
		],
		links: [{
			rel: "canonical",
			href: "/shop"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./admin-DyoZoVQJ.mjs");
var fetchDashboardStats = createServerFn({ method: "GET" }).handler(createSsrRpc("6da4d9ed9ee2b9ba7cf52ec430089b93fef7001ad18dbd212252f31ef6171053"));
var Route$12 = createFileRoute("/admin/")({
	loader: () => fetchDashboardStats(),
	head: () => ({ meta: [{ title: "Dashboard — HerbHealth Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./login-B8RGUarw.mjs");
var Route$11 = createFileRoute("/admin/login")({
	head: () => ({ meta: [{ title: "Admin Login — HerbHealth" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./order-confirmation._orderNumber-tGOjekP4.mjs");
var fetchOrder$1 = createServerFn({ method: "GET" }).validator(objectType({ orderNumber: stringType() })).handler(createSsrRpc("688fd3234f171004f3e460daa4c77dec3fc43e71d131fd31552c2838be4469c8"));
var Route$10 = createFileRoute("/order-confirmation/$orderNumber")({
	loader: async ({ params }) => fetchOrder$1({ data: { orderNumber: params.orderNumber } }),
	head: () => ({ meta: [{ title: "Order Confirmed — HerbHealth" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./product._slug-B0DY23NC.mjs");
var fetchProduct = createServerFn({ method: "GET" }).validator(objectType({ slug: stringType() })).handler(createSsrRpc("7827dd85f105cbd55e7dee491cd245a2ac9b8460b87c2c99e9ccef31eabb59ef"));
var Route$9 = createFileRoute("/product/$slug")({
	loader: ({ params }) => fetchProduct({ data: { slug: params.slug } }),
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Product not found — HerbHealth" }, {
			name: "robots",
			content: "noindex"
		}] };
		const p = loaderData.product;
		return {
			meta: [
				{ title: `${p.name} — HerbHealth` },
				{
					name: "description",
					content: `${p.short_description ?? ""} ${p.description ?? ""}`.slice(0, 155)
				},
				{
					property: "og:title",
					content: `${p.name} — HerbHealth`
				},
				{
					property: "og:description",
					content: p.short_description ?? p.name
				},
				{
					property: "og:type",
					content: "product"
				},
				{
					property: "og:url",
					content: `/product/${p.slug}`
				}
			],
			links: [{
				rel: "canonical",
				href: `/product/${p.slug}`
			}],
			scripts: [{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "Product",
					name: p.name,
					description: p.description,
					material: p.material,
					color: p.color,
					brand: {
						"@type": "Brand",
						name: "HerbHealth"
					},
					offers: {
						"@type": "Offer",
						price: p.price,
						priceCurrency: "PKR",
						availability: p.stock_status === "out" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
					}
				})
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./categories-Dg7OpMXh.mjs");
var fetchCategories$1 = createServerFn({ method: "GET" }).handler(createSsrRpc("9e1a5e0d9fa74a784fa70b4cea0f0806aa5f0e752f874e5febc21115dcae0aa6"));
var Route$8 = createFileRoute("/admin/categories/")({
	loader: () => fetchCategories$1(),
	head: () => ({ meta: [{ title: "Categories — HerbHealth Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./content-C5hTxVfW.mjs");
var fetchContent = createServerFn({ method: "GET" }).handler(createSsrRpc("a7f96bcef2db868a9fe9c74dac5bd51ab3015a3a88ea6e47a715b0cdc14d7bf3"));
var Route$7 = createFileRoute("/admin/content/")({
	loader: () => fetchContent(),
	head: () => ({ meta: [{ title: "Content & Offers — HerbHealth Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./orders-JEdu24Kf.mjs");
var fetchOrders = createServerFn({ method: "GET" }).handler(createSsrRpc("2a0552dd9d0bc11fd63967359811874a81f865df25944556928e32bf34cea1a2"));
var Route$6 = createFileRoute("/admin/orders/")({
	loader: () => fetchOrders(),
	head: () => ({ meta: [{ title: "Orders — HerbHealth Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("../_id-BGw_yMb0.mjs");
var fetchOrder = createServerFn({ method: "GET" }).validator(objectType({ id: stringType() })).handler(createSsrRpc("75ec024c368b1e938dcf8698759c0537df2840d531e4fd51529df76dd17306e7"));
var Route$5 = createFileRoute("/admin/orders/$id")({
	loader: ({ params }) => fetchOrder({ data: { id: params.id } }),
	head: () => ({ meta: [{ title: "Order Detail — HerbHealth Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./products-BAODnf0S.mjs");
var fetchProducts = createServerFn({ method: "GET" }).handler(createSsrRpc("887d1bedc4c752a5fc0d72635ae03a11b4dfaecc30214062e2e393115b0a2b66"));
var Route$4 = createFileRoute("/admin/products/")({
	loader: () => fetchProducts(),
	head: () => ({ meta: [{ title: "Products — HerbHealth Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./new-DuFhYmTP.mjs");
var fetchCategories = createServerFn({ method: "GET" }).handler(createSsrRpc("0cac52cd340bd4bc3f511ad5af3942480712e99ef43bd0053522ce9c76ff7cc1"));
var Route$3 = createFileRoute("/admin/products/new")({
	loader: () => fetchCategories(),
	head: () => ({ meta: [{ title: "New Product — HerbHealth Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./reviews-CCVeMY26.mjs");
var fetchReviews = createServerFn({ method: "GET" }).handler(createSsrRpc("1f73ea70113108aac94876cbf31d436cf62e6eec8c8bac156fd6556008754a3d"));
var Route$2 = createFileRoute("/admin/reviews/")({
	loader: () => fetchReviews(),
	head: () => ({ meta: [{ title: "Reviews — HerbHealth Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./subscribers-B8f-cSqZ.mjs");
var fetchSubscribers = createServerFn({ method: "GET" }).handler(createSsrRpc("ec402553749e21b05a00e980dee1da30ab3915860f5719e67540942f7e7571d3"));
var Route$1 = createFileRoute("/admin/subscribers/")({
	loader: () => fetchSubscribers(),
	head: () => ({ meta: [{ title: "Subscribers — HerbHealth Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./edit-DB-yHmRo.mjs");
var fetchProductForEdit = createServerFn({ method: "GET" }).validator(objectType({ id: stringType() })).handler(createSsrRpc("5701ab49f9b1200e7e761fac6183a3f5f744acf46eb0117fc7ce8f39297f1d05"));
var Route = createFileRoute("/admin/products/$id/edit")({
	loader: ({ params }) => fetchProductForEdit({ data: { id: params.id } }),
	head: () => ({ meta: [{ title: "Edit Product — HerbHealth Admin" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$18.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$19
});
var AboutRoute = Route$17.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$19
});
var AdminRouteRoute = Route$16.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$19
});
var CheckoutRoute = Route$15.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$19
});
var ContactRoute = Route$14.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$19
});
var ShopRoute = Route$13.update({
	id: "/shop",
	path: "/shop",
	getParentRoute: () => Route$19
});
var AdminIndexRoute = Route$12.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRouteRoute
});
var AdminLoginRoute = Route$11.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => AdminRouteRoute
});
var OrderConfirmationOrderNumberRoute = Route$10.update({
	id: "/order-confirmation/$orderNumber",
	path: "/order-confirmation/$orderNumber",
	getParentRoute: () => Route$19
});
var ProductSlugRoute = Route$9.update({
	id: "/product/$slug",
	path: "/product/$slug",
	getParentRoute: () => Route$19
});
var AdminCategoriesIndexRoute = Route$8.update({
	id: "/categories/",
	path: "/categories/",
	getParentRoute: () => AdminRouteRoute
});
var AdminContentIndexRoute = Route$7.update({
	id: "/content/",
	path: "/content/",
	getParentRoute: () => AdminRouteRoute
});
var AdminOrdersIndexRoute = Route$6.update({
	id: "/orders/",
	path: "/orders/",
	getParentRoute: () => AdminRouteRoute
});
var AdminOrdersIdRoute = Route$5.update({
	id: "/orders/$id",
	path: "/orders/$id",
	getParentRoute: () => AdminRouteRoute
});
var AdminProductsIndexRoute = Route$4.update({
	id: "/products/",
	path: "/products/",
	getParentRoute: () => AdminRouteRoute
});
var AdminRouteRouteChildren = {
	AdminLoginRoute,
	AdminIndexRoute,
	AdminOrdersIdRoute,
	AdminProductsNewRoute: Route$3.update({
		id: "/products/new",
		path: "/products/new",
		getParentRoute: () => AdminRouteRoute
	}),
	AdminCategoriesIndexRoute,
	AdminContentIndexRoute,
	AdminOrdersIndexRoute,
	AdminProductsIndexRoute,
	AdminReviewsIndexRoute: Route$2.update({
		id: "/reviews/",
		path: "/reviews/",
		getParentRoute: () => AdminRouteRoute
	}),
	AdminSubscribersIndexRoute: Route$1.update({
		id: "/subscribers/",
		path: "/subscribers/",
		getParentRoute: () => AdminRouteRoute
	}),
	AdminProductsIdEditRoute: Route.update({
		id: "/products/$id/edit",
		path: "/products/$id/edit",
		getParentRoute: () => AdminRouteRoute
	})
};
var rootRouteChildren = {
	IndexRoute,
	AdminRouteRoute: AdminRouteRoute._addFileChildren(AdminRouteRouteChildren),
	AboutRoute,
	CheckoutRoute,
	ContactRoute,
	ShopRoute,
	OrderConfirmationOrderNumberRoute,
	ProductSlugRoute
};
var routeTree = Route$19._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { PAKISTAN_CITIES as C, Button as D, useShop as E, cn as O, createSsrRpc as S, stockLabel as T, supabase as _, Route$3 as a, DialogContent as b, Route$6 as c, Route$9 as d, Route$10 as f, subscribeEmail as g, Route$18 as h, Route$2 as i, Route$7 as l, Route$13 as m, Route as n, Route$4 as o, Route$12 as p, Route$1 as r, Route$5 as s, router_exports as t, Route$8 as u, Input as v, formatPrice as w, DialogTitle as x, Dialog as y };

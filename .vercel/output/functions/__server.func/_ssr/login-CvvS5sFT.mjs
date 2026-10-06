import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { D as Button, _ as supabase, v as Input } from "./router-DekkBrBB.mjs";
import { t as Label } from "./label-CDFP0lXv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CvvS5sFT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminLogin() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		const { error: authError } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		setLoading(false);
		if (authError) setError("Invalid email or password.");
		else navigate({ to: "/admin" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-2xl tracking-[0.18em] uppercase",
					children: ["Herb", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-gold",
						children: "Health"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Admin Dashboard"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4 border border-border bg-card p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "email",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "email",
						type: "email",
						required: true,
						className: "mt-2 rounded-none",
						value: email,
						onChange: (e) => setEmail(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "password",
						children: "Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "password",
						type: "password",
						required: true,
						className: "mt-2 rounded-none",
						value: password,
						onChange: (e) => setPassword(e.target.value)
					})] }),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-destructive",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						variant: "hero",
						className: "w-full",
						disabled: loading,
						children: loading ? "Signing in…" : "Sign In"
					})
				]
			})]
		})
	});
}
//#endregion
export { AdminLogin as component };

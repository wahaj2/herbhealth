import { i as createServerFn } from "./server-Ca0AjyFE.mjs";
import { t as createServerRpc } from "./createServerRpc-DRx0ojag.mjs";
import { i as enumType, l as stringType, s as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/subscribers-CEeWLENX.js
var subscribeEmail_createServerFn_handler = createServerRpc({
	id: "93f0fb5996db0ee0b80c54c88651bdefe61bbe5ba4f3daad0eceeb9409aef363",
	name: "subscribeEmail",
	filename: "src/lib/subscribers.ts"
}, (opts) => subscribeEmail.__executeServer(opts));
var subscribeEmail = createServerFn({ method: "POST" }).validator(objectType({
	email: stringType().email(),
	source: enumType(["newsletter", "exit_intent"])
})).handler(subscribeEmail_createServerFn_handler, async ({ data }) => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const { error } = await createServerSupabase().from("subscribers").upsert({
		email: data.email.toLowerCase().trim(),
		source: data.source
	}, {
		onConflict: "email",
		ignoreDuplicates: true
	});
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { subscribeEmail_createServerFn_handler };

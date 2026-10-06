import { i as createServerFn } from "./server-Ca0AjyFE.mjs";
import { t as createServerRpc } from "./createServerRpc-DRx0ojag.mjs";
import { c as recordType, l as stringType, s as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/content-D9brBRi_.js
var fetchContent_createServerFn_handler = createServerRpc({
	id: "a7f96bcef2db868a9fe9c74dac5bd51ab3015a3a88ea6e47a715b0cdc14d7bf3",
	name: "fetchContent",
	filename: "src/routes/admin/content/index.tsx"
}, (opts) => fetchContent.__executeServer(opts));
var fetchContent = createServerFn({ method: "GET" }).handler(fetchContent_createServerFn_handler, async () => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const { data } = await createServerSupabase().from("site_content").select("key, value");
	const map = {};
	for (const row of data ?? []) map[row.key] = row.value;
	return map;
});
var saveContent_createServerFn_handler = createServerRpc({
	id: "a8169d1e8ae5abf9a7263caefea5181bfd2fb562cc01048c5fc29c4a867a4632",
	name: "saveContent",
	filename: "src/routes/admin/content/index.tsx"
}, (opts) => saveContent.__executeServer(opts));
var saveContent = createServerFn({ method: "POST" }).validator(objectType({ entries: recordType(stringType(), stringType()) })).handler(saveContent_createServerFn_handler, async ({ data }) => {
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const db = createServerSupabase();
	const rows = Object.entries(data.entries).map(([key, value]) => ({
		key,
		value
	}));
	const { error } = await db.from("site_content").upsert(rows, { onConflict: "key" });
	if (error) throw new Error(error.message);
});
var uploadContentImage_createServerFn_handler = createServerRpc({
	id: "b993bed6c771c7965a9cb9026a5ed39f9a2c287dc1fe8a58c3827c46f3c5f8db",
	name: "uploadContentImage",
	filename: "src/routes/admin/content/index.tsx"
}, (opts) => uploadContentImage.__executeServer(opts));
var uploadContentImage = createServerFn({ method: "POST" }).validator(objectType({
	fileName: stringType(),
	fileBase64: stringType(),
	mimeType: stringType()
})).handler(uploadContentImage_createServerFn_handler, async ({ data }) => {
	if (![
		"image/jpeg",
		"image/png",
		"image/webp"
	].includes(data.mimeType)) throw new Error("Only JPEG, PNG and WebP are allowed");
	const bytes = Buffer.from(data.fileBase64, "base64");
	if (bytes.length > 8388608) throw new Error("Image must be under 8MB");
	const { createServerSupabase } = await import("./supabase-server-CNnhpOtG.mjs");
	const db = createServerSupabase();
	const path = `content/${Date.now()}-${data.fileName}`;
	const { error } = await db.storage.from("product-images").upload(path, bytes, {
		contentType: data.mimeType,
		upsert: false
	});
	if (error) throw new Error(error.message);
	return { path };
});
//#endregion
export { fetchContent_createServerFn_handler, saveContent_createServerFn_handler, uploadContentImage_createServerFn_handler };

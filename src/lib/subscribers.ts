import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const subscribeEmail = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string().email(),
      source: z.enum(["newsletter", "exit_intent"]),
    }),
  )
  .handler(async ({ data }) => {
    const { createServerSupabase } = await import("@/lib/supabase-server");
    const db = createServerSupabase();
    // Re-submitting an existing email updates its row instead of erroring —
    // a repeat signup shouldn't be a bad experience for the customer.
    const { error } = await db
      .from("subscribers")
      .upsert(
        { email: data.email.toLowerCase().trim(), source: data.source },
        { onConflict: "email", ignoreDuplicates: true },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });
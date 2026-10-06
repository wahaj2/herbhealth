import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const submitReview = createServerFn({ method: "POST" })
  .validator(
    z.object({
      productId: z.string(),
      customerName: z.string().min(2),
      customerEmail: z.string().email().optional().or(z.literal("")),
      rating: z.number().int().min(1).max(5),
      title: z.string().optional(),
      comment: z.string().min(5),
    }),
  )
  .handler(async ({ data }) => {
    const { createServerSupabase } = await import("@/lib/supabase-server");
    const db = createServerSupabase();
    const { error } = await db.from("reviews").insert({
      product_id: data.productId,
      customer_name: data.customerName,
      customer_email: data.customerEmail || null,
      rating: data.rating,
      title: data.title || null,
      comment: data.comment,
      is_approved: false, // goes live only after admin approval
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
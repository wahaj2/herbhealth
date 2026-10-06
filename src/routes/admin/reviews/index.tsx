import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Check, X, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ReviewRow = {
  id: string;
  customer_name: string;
  customer_email: string | null;
  rating: number;
  title: string | null;
  comment: string | null;
  is_approved: boolean;
  created_at: string;
  product: { name: string; slug: string } | null;
};

const fetchReviews = createServerFn({ method: "GET" }).handler(async () => {
  const { createServerSupabase } = await import("@/lib/supabase-server");
  const db = createServerSupabase();
  const { data } = await db
    .from("reviews")
    .select(
      "id, customer_name, customer_email, rating, title, comment, is_approved, created_at, product:products(name, slug)",
    )
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as ReviewRow[];
});

const setReviewApproval = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string(), approved: z.boolean() }))
  .handler(async ({ data }) => {
    const { createServerSupabase } = await import("@/lib/supabase-server");
    const db = createServerSupabase();
    const { error } = await db.from("reviews").update({ is_approved: data.approved }).eq("id", data.id);
    if (error) throw new Error(error.message);
  });

const deleteReview = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const { createServerSupabase } = await import("@/lib/supabase-server");
    const db = createServerSupabase();
    const { error } = await db.from("reviews").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
  });

export const Route = createFileRoute("/admin/reviews/")({
  loader: () => fetchReviews(),
  head: () => ({ meta: [{ title: "Reviews — HerbHealth Admin" }] }),
  component: AdminReviews,
});

function AdminReviews() {
  const initial = Route.useLoaderData();
  const [reviews, setReviews] = useState(initial);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

  const visible = reviews.filter((r) =>
    filter === "all" ? true : filter === "pending" ? !r.is_approved : r.is_approved,
  );

  const approve = async (id: string, approved: boolean) => {
    try {
      await setReviewApproval({ data: { id, approved } });
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, is_approved: approved } : r)));
      toast.success(approved ? "Review approved" : "Review hidden");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to update review");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this review permanently?")) return;
    try {
      await deleteReview({ data: { id } });
      setReviews((prev) => prev.filter((r) => r.id !== id));
      toast.success("Review deleted");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to delete review");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl">Reviews</h1>
        <div className="flex gap-2">
          {(["pending", "approved", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider border ${
                filter === f ? "border-gold text-gold" : "border-border text-muted-foreground"
              }`}
            >
              {f} {f === "pending" && `(${reviews.filter((r) => !r.is_approved).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {visible.map((r) => (
          <div key={r.id} className="border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`size-3.5 ${i < r.rating ? "fill-gold text-gold" : "text-border"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    on <span className="text-foreground">{r.product?.name ?? "Unknown product"}</span>
                  </span>
                </div>
                {r.title && <p className="mt-2 font-medium text-sm">{r.title}</p>}
                {r.comment && <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>}
                <p className="mt-2 text-xs text-muted-foreground">
                  {r.customer_name}
                  {r.customer_email && ` · ${r.customer_email}`} · {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                {!r.is_approved ? (
                  <Button size="sm" variant="hero" onClick={() => approve(r.id, true)}>
                    <Check className="size-4 mr-1" /> Approve
                  </Button>
                ) : (
                  <Button size="sm" variant="quiet" onClick={() => approve(r.id, false)}>
                    <X className="size-4 mr-1" /> Unpublish
                  </Button>
                )}
                <button onClick={() => remove(r.id)} className="p-2 text-muted-foreground hover:text-destructive">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <div className="border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            No {filter !== "all" ? filter : ""} reviews.
          </div>
        )}
      </div>
    </div>
  );
}
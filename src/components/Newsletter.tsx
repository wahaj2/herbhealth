import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { subscribeEmail } from "@/lib/subscribers";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState({
    heading: "Join the Roots Club",
    subtext: "Early access to new blends, wellness notes and members-only offers.",
    offerCode: "HERB10",
    offerText: "10% off your first order",
  });

  useEffect(() => {
    supabase
      .from("site_content")
      .select("key, value")
      .in("key", ["newsletter_heading", "newsletter_subtext", "offer_code", "offer_discount_text"])
      .then(({ data }) => {
        if (!data) return;
        const map = Object.fromEntries(data.map((r) => [r.key, r.value]));
        setContent({
          heading: map["newsletter_heading"] || "Join the Roots Club",
          subtext:
            map["newsletter_subtext"] ||
            "Early access to new blends, wellness notes and members-only offers.",
          offerCode: map["offer_code"] || "HERB10",
          offerText: map["offer_discount_text"] || "10% off your first order",
        });
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await subscribeEmail({ data: { email, source: "newsletter" } });
      toast("You're on the list", { description: `Code ${content.offerCode} sent to ${email}.` });
      setEmail("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
    setSubmitting(false);
  };

  return (
    <section className="bg-primary px-5 py-20 text-primary-foreground">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold">{content.offerText}</p>
        <h2 className="mt-4 font-display text-3xl sm:text-4xl">{content.heading}</h2>
        <p className="mt-3 text-sm text-primary-foreground/70">{content.subtext}</p>
        <form className="mt-8 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="h-12 rounded-none border-primary-foreground/25 bg-transparent text-primary-foreground placeholder:text-primary-foreground/50"
          />
          <Button type="submit" variant="gold" size="xl" disabled={submitting}>
            {submitting ? "Joining…" : `Claim ${content.offerCode}`}
          </Button>
        </form>
      </div>
    </section>
  );
}
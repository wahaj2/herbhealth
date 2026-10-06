import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { subscribeEmail } from "@/lib/subscribers";

const KEY = "hh_exit_offer_seen";

export function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [offerCode, setOfferCode] = useState("HERB10");
  const [offerText, setOfferText] = useState("10% off your first order");

  useEffect(() => {
    supabase
      .from("site_content")
      .select("key, value")
      .in("key", ["offer_code", "offer_discount_text"])
      .then(({ data }) => {
        if (!data) return;
        const map = Object.fromEntries(data.map((r) => [r.key, r.value]));
        if (map["offer_code"]) setOfferCode(map["offer_code"]);
        if (map["offer_discount_text"]) setOfferText(map["offer_discount_text"]);
      });
  }, []);

  useEffect(() => {
    if (window.localStorage.getItem(KEY)) return;
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setOpen(true);
        window.localStorage.setItem(KEY, "1");
        document.removeEventListener("mouseout", onLeave);
      }
    };
    const timer = window.setTimeout(() => document.addEventListener("mouseout", onLeave), 5000);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseout", onLeave);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await subscribeEmail({ data: { email, source: "exit_intent" } });
      setOpen(false);
      toast("Welcome to HerbHealth", { description: `Code ${offerCode} sent to ${email}.` });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md text-center">
        <p className="eyebrow">Before you go</p>
        <DialogTitle className="font-display text-3xl">{offerText}</DialogTitle>
        <DialogDescription>
          Join the Roots Club for early access to new blends and wellness notes.
        </DialogDescription>
        <form className="mt-2 flex flex-col gap-2 sm:flex-row" onSubmit={handleSubmit}>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="rounded-none"
          />
          <Button type="submit" variant="gold" size="xl" disabled={submitting}>
            {submitting ? "Joining…" : `Claim ${offerCode}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
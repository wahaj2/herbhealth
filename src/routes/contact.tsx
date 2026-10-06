import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Facebook, Instagram, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & FAQ — HerbHealth" },
      {
        name: "description",
        content:
          "Questions about shipping, returns or exchanges? Email hello@herbhealth.store or send us a message — we reply within one business day.",
      },
      { property: "og:title", content: "Contact & FAQ — HerbHealth" },
      {
        property: "og:description",
        content: "We reply within one business day. Shipping, returns and exchange answers inside.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const faqs = [
  {
    q: "How long does delivery take?",
    a: "Orders are dispatched within 24 hours. Standard delivery takes 2–5 business days depending on your city. Major cities (Karachi, Lahore, Islamabad) are typically 2–3 days. Delivery is free on orders over Rs 3,000.",
  },
  {
    q: "What is your return policy?",
    a: "You have 7 days from delivery to return any unopened, unused product in its original packaging. Contact us at hello@herbhealth.store to arrange a return.",
  },
  {
    q: "Are your products lab-tested?",
    a: "Yes. Every batch is tested for purity before it ships, and the results are summarized on each product page.",
  },
  {
    q: "Are your herbs organic and natural?",
    a: "We source organically grown herbs wherever possible. Every product page lists the exact ingredients, form and any allergen notes.",
  },
  {
    q: "How does Cash on Delivery work?",
    a: "We only accept Cash on Delivery (COD). Place your order online and pay the exact amount in cash to the rider when your order arrives. No card or online payment is required.",
  },
];

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <main className="pt-28">
      <section className="mx-auto max-w-3xl px-5 py-14 text-center">
        <p className="eyebrow">We'd love to hear from you</p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl">Contact HerbHealth</h1>
        <p className="mt-5 text-sm text-muted-foreground">
          Wellness advice, order questions or wholesale enquiries — we reply within one business day.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-16 lg:grid-cols-[1fr_320px]">
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
            toast("Message sent", { description: "We'll be in touch within one business day." });
          }}
        >
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" required className="mt-2 rounded-none" placeholder="Your name" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              className="mt-2 rounded-none"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              required
              rows={6}
              className="mt-2 rounded-none"
              placeholder="How can we help?"
            />
          </div>
          <Button type="submit" variant="hero" size="xl">
            Send message
          </Button>
          {sent && (
            <p className="text-xs text-gold">Thank you — your message is on its way.</p>
          )}
        </form>

        <aside className="space-y-6 border border-border bg-card p-8">
          <div>
            <p className="eyebrow">Email</p>
            <a
              href="mailto:hello@herbhealth.store"
              className="mt-2 flex items-center gap-2 text-sm hover:text-gold"
            >
              <Mail className="size-4" /> hello@herbhealth.store
            </a>
          </div>
          <div>
            <p className="eyebrow">Follow</p>
            <div className="mt-3 space-y-2 text-sm">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gold"
              >
                <Instagram className="size-4" /> @herbhealth
              </a>
              <a href="https://pinterest.com" className="flex items-center gap-2 hover:text-gold">
                <span className="grid size-4 place-items-center text-xs">P</span> herbhealth
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-gold"
              >
                <Facebook className="size-4" /> HerbHealth
              </a>
            </div>
          </div>
          <div>
            <p className="eyebrow">Support hours</p>
            <p className="mt-2 text-sm text-muted-foreground">Mon–Sat, 9am–6pm</p>
          </div>
        </aside>
      </section>

      <section id="faq" className="mx-auto max-w-3xl scroll-mt-28 px-5 pb-24">
        <div className="text-center">
          <p className="eyebrow">Good to know</p>
          <h2 className="mt-3 font-display text-3xl">Frequently asked questions</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
}

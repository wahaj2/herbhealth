import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Newsletter } from "@/components/Newsletter";
import { TrustBadges } from "@/components/TrustBadges";
import founder from "@/assets/founder.svg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — HerbHealth" },
      {
        name: "description",
        content:
          "HerbHealth was born from a love of traditional herbal remedies and honest sourcing. Meet the founder and our commitment to natural, small-batch wellness.",
      },
      { property: "og:title", content: "Our Story — HerbHealth" },
      {
        property: "og:description",
        content: "Naturally sourced, small-batch made, honestly labelled.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const pillars = [
  {
    title: "Sourcing",
    copy: "Herbs and botanicals bought directly from small growers, chosen for potency — not just for how they look on a shelf.",
  },
  {
    title: "Small-batch craft",
    copy: "Every tincture, oil and balm is blended in small runs, batch-tested for purity, and hand-labelled before it ships.",
  },
  {
    title: "Honest pricing",
    copy: "We sell direct, so you pay for the herbs and the craft — not for a middleman's markup.",
  },
];

function About() {
  return (
    <main className="pt-28">
      <section className="mx-auto max-w-3xl px-5 py-14 text-center">
        <p className="eyebrow">Our Story</p>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl">Rooted in nature, made for you</h1>
        <p className="mt-6 text-base text-muted-foreground">
          HerbHealth started with a home kitchen, a mortar and pestle, and a frustration with
          wellness products that promised the earth and delivered a label full of things we
          couldn't pronounce. So we went back to the roots — literally — and started making our
          own.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-10 lg:grid-cols-2">
        <img
          src={founder}
          alt="Founder of HerbHealth surrounded by herbs and botanicals"
          width={1024}
          height={1280}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover"
        />
        <div>
          <p className="eyebrow">Founder &amp; Herbalist</p>
          <h2 className="mt-3 font-display text-3xl">A note from Sana</h2>
          <p className="mt-5 text-sm text-muted-foreground">
            "I grew up watching my grandmother mix turmeric into warm milk for every cold, every
            ache, every bad night's sleep. When I couldn't find that same honesty in a bottle as
            an adult, I started making it myself — one small batch at a time, in my own kitchen."
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            "Our promise is simple: real herbs, real dosages, real transparency about what's in
            the jar. Nothing to prove, nothing to hide. Just wellness the way it used to be made."
          </p>
          <p className="mt-6 font-display text-lg">Sana Farooq</p>
          <Button variant="quiet" size="xl" className="mt-8" asChild>
            <Link to="/shop">Explore the collection</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="text-center">
          <p className="eyebrow">Our commitment</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Wellness you can trust</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {pillars.map((p) => (
            <div key={p.title} className="border border-border bg-card p-8">
              <h3 className="font-display text-xl">{p.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{p.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <TrustBadges />
      <Newsletter />
    </main>
  );
}

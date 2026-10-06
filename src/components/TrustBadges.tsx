import { PackageCheck, RotateCcw, Truck } from "lucide-react";

const badges = [
  { icon: PackageCheck, title: "Cash on Delivery", copy: "Pay when your order arrives" },
  { icon: Truck, title: "Nationwide Delivery", copy: "2–5 business days across Pakistan" },
  { icon: RotateCcw, title: "Easy Returns", copy: "7-day hassle-free return policy" },
];
// Note: all-natural, third-party lab-tested sourcing is described on the About page.

export function TrustBadges() {
  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:grid-cols-3">
        {badges.map((b) => (
          <div key={b.title} className="flex items-center gap-3">
            <b.icon className="size-6 text-gold" />
            <div>
              <p className="text-sm font-medium">{b.title}</p>
              <p className="text-xs text-muted-foreground">{b.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

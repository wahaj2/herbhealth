import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type Subscriber = { id: string; email: string; source: string; created_at: string };

const fetchSubscribers = createServerFn({ method: "GET" }).handler(async () => {
  const { createServerSupabase } = await import("@/lib/supabase-server");
  const db = createServerSupabase();
  const { data } = await db
    .from("subscribers")
    .select("id, email, source, created_at")
    .order("created_at", { ascending: false });
  return (data ?? []) as Subscriber[];
});

export const Route = createFileRoute("/admin/subscribers/")({
  loader: () => fetchSubscribers(),
  head: () => ({ meta: [{ title: "Subscribers — HerbHealth Admin" }] }),
  component: AdminSubscribers,
});

function toCsv(rows: Subscriber[]) {
  const header = "email,source,date\n";
  const body = rows.map((r) => `${r.email},${r.source},${new Date(r.created_at).toISOString()}`).join("\n");
  return header + body;
}

function AdminSubscribers() {
  const subscribers = Route.useLoaderData();

  const download = () => {
    const blob = new Blob([toCsv(subscribers)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl">Subscribers</h1>
          <p className="text-sm text-muted-foreground">
            {subscribers.length} emails collected from the newsletter and exit offer.
          </p>
        </div>
        <Button variant="hero" onClick={download} disabled={subscribers.length === 0}>
          <Download className="size-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Source</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {subscribers.map((s) => (
              <tr key={s.id} className="bg-card">
                <td className="px-4 py-3">{s.email}</td>
                <td className="px-4 py-3 text-muted-foreground capitalize">{s.source.replace("_", " ")}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  No subscribers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
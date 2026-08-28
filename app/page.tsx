import { supabaseAdmin, ChatThread } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic"; // immer aktuelle Daten, kein Caching

async function getThreads(): Promise<ChatThread[]> {
  const { data, error } = await supabaseAdmin
    .from("chat_threads")
    .select("*")
    .order("last_message_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "gerade eben";
  if (mins < 60) return `vor ${mins} Min.`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.floor(hours / 24);
  return `vor ${days} Tag(en)`;
}

export default async function ThreadListPage() {
  const threads = await getThreads();

  if (threads.length === 0) {
    return <p style={{ color: "#666" }}>Noch keine Chats. Sobald eine Kundin/ein Kunde auf einer Produktseite schreibt, erscheint der Chat hier.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {threads.map((t) => (
        <a
          key={t.id}
          href={`/thread/${t.id}`}
          style={{
            display: "block",
            background: "white",
            border: "1px solid #e2e2e5",
            borderRadius: 10,
            padding: "14px 16px",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <strong>{t.customer_name || t.customer_email}</strong>
            <span style={{ fontSize: 13, color: "#888" }}>{timeAgo(t.last_message_at)}</span>
          </div>
          <div style={{ fontSize: 14, color: "#555", marginTop: 4 }}>{t.product_title}</div>
          <div style={{ fontSize: 13, color: "#999", marginTop: 2 }}>{t.customer_email}</div>
        </a>
      ))}
    </div>
  );
}

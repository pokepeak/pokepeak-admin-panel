import { supabaseAdmin, ChatMessage, ChatThread } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

async function getThread(id: string): Promise<ChatThread | null> {
  const { data } = await supabaseAdmin.from("chat_threads").select("*").eq("id", id).single();
  return data ?? null;
}

async function getMessages(threadId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabaseAdmin
    .from("chat_messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export default async function ThreadPage({ params }: { params: { id: string } }) {
  const thread = await getThread(params.id);
  const messages = await getMessages(params.id);

  if (!thread) {
    return <p>Chat nicht gefunden.</p>;
  }

  async function sendReply(formData: FormData) {
    "use server";
    const message = (formData.get("message") as string)?.trim();
    if (!message) return;

    await supabaseAdmin.from("chat_messages").insert({
      thread_id: thread!.id,
      sender: "luca",
      message,
    });
    await supabaseAdmin
      .from("chat_threads")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", thread!.id);

    revalidatePath(`/thread/${thread!.id}`);
  }

  return (
    <div>
      <a href="/" style={{ fontSize: 14, color: "#666" }}>
        ← Alle Chats
      </a>

      <div
        style={{
          background: "white",
          border: "1px solid #e2e2e5",
          borderRadius: 10,
          padding: "14px 16px",
          margin: "16px 0",
        }}
      >
        <strong>{thread.customer_name || "Gast"}</strong> — {thread.customer_email}
        <div style={{ fontSize: 14, marginTop: 4 }}>
          Produkt:{" "}
          <a href={thread.product_url} target="_blank" rel="noreferrer">
            {thread.product_title}
          </a>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              alignSelf: m.sender === "luca" ? "flex-end" : "flex-start",
              maxWidth: "75%",
              background: m.sender === "luca" ? "#111" : "white",
              color: m.sender === "luca" ? "white" : "#111",
              border: m.sender === "luca" ? "none" : "1px solid #e2e2e5",
              borderRadius: 10,
              padding: "8px 12px",
            }}
          >
            <div style={{ fontSize: 15 }}>{m.message}</div>
            <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>
              {new Date(m.created_at).toLocaleString("de-AT")}
            </div>
          </div>
        ))}
      </div>

      <form action={sendReply} style={{ display: "flex", gap: 8 }}>
        <input
          name="message"
          placeholder="Antwort schreiben…"
          autoComplete="off"
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #ccc",
            fontSize: 15,
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            border: "none",
            background: "#111",
            color: "white",
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Senden
        </button>
      </form>
    </div>
  );
}

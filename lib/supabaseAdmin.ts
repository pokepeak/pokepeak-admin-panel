import { createClient } from "@supabase/supabase-js";

// Nutzt den service_role-Key → umgeht Row Level Security komplett.
// Läuft NUR serverseitig (Server Components, Route Handlers, Server Actions),
// wird nie an den Browser ausgeliefert.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export type ChatThread = {
  id: string;
  owner_uid: string;
  customer_name: string | null;
  customer_email: string;
  product_id: string;
  product_title: string;
  product_url: string;
  status: string;
  created_at: string;
  last_message_at: string;
};

export type ChatMessage = {
  id: string;
  thread_id: string;
  sender: "customer" | "luca";
  message: string;
  created_at: string;
};

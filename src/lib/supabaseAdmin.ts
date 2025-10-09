import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client with Service Role Key
// IMPORTANT: Do NOT import this in client components. It exposes elevated privileges.
export function createAdminClient() {
  console.log("Creating admin client");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

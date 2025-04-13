import { createClient } from "npm:@supabase/supabase-js";

import { corsHeaders } from "../_shared/cores.ts";
import { Database } from "../_shared/types.ts";

// eslint-disable-next-line no-undef
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseClient = createClient<Database>(
    // eslint-disable-next-line no-undef
    Deno.env.get("SUPABASE_URL") ?? "",
    // eslint-disable-next-line no-undef
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  );
  // Get the session or user object
  const authHeader = req.headers.get("Authorization")!;
  const token = authHeader.replace("Bearer ", "");
  const { data } = await supabaseClient.auth.getUser(token);
  const user = data.user;
  return new Response(JSON.stringify({ user }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});

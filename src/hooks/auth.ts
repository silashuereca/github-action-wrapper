import { supabase } from "../../supabase";

export async function signIn(): Promise<void> {
  await supabase.auth.signInWithOAuth({
    options: {
      redirectTo: window.location.origin,
    },
    provider: "github",
  });
}

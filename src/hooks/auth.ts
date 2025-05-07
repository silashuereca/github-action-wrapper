import { supabase } from "../../supabase";

export async function signInGithub(): Promise<void> {
  await supabase.auth.signInWithOAuth({
    options: {
      redirectTo: window.location.origin,
    },
    provider: "github",
  });
}

export async function signInGoogle(): Promise<void> {
  await supabase.auth.signInWithOAuth({
    options: {
      redirectTo: window.location.origin,
    },
    provider: "google",
  });
}

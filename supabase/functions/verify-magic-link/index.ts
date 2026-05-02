// Supabase Edge Function: verify-magic-link
// Validates the one-time token, marks it used, generates a Supabase magic link via admin
// API, and redirects the browser through Supabase's verification endpoint so a real
// auth session cookie/JWT is established.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

async function sha256(str: string): Promise<string> {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const redirect = url.searchParams.get("redirect") || "https://synapexdevelopers.lovable.app/join";
  const fail = (reason: string) => Response.redirect(`${redirect}?magic=${reason}`, 302);
  if (!token) return fail("missing");

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const tokenHash = await sha256(token);
    const { data: row } = await supabase
      .from("magic_link_tokens")
      .select("*")
      .eq("token_hash", tokenHash)
      .maybeSingle();

    if (!row || row.used || new Date(row.expires_at).getTime() < Date.now()) {
      return fail("invalid");
    }
    await supabase.from("magic_link_tokens").update({ used: true }).eq("id", row.id);

    const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: row.email,
      options: { redirectTo: redirect },
    });
    if (linkErr) {
      console.error("generateLink error", linkErr);
      return fail("error");
    }
    const actionLink = (linkData as any)?.properties?.action_link;
    if (!actionLink) return fail("error");
    return Response.redirect(actionLink, 302);
  } catch (e) {
    console.error("verify-magic-link error", e);
    return fail("error");
  }
});

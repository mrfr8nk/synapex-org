// Supabase Edge Function: send-magic-link
// Sends a one-time SMTP magic link to the provided email address
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function sha256(str: string): Promise<string> {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomToken(bytes = 32): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}

const SMTP_HOST = Deno.env.get("SMTP_HOST") || "smtp.gmail.com";
const SMTP_PORT = Number(Deno.env.get("SMTP_PORT") || "587");
const SMTP_USER = Deno.env.get("SMTP_USER") || "support.fundo.ai@gmail.com";
const SMTP_PASS = Deno.env.get("SMTP_PASS") || "audb xqfw xnyo gofd";
const SMTP_FROM = Deno.env.get("SMTP_FROM") || SMTP_USER;

async function sendMail(opts: { to: string; subject: string; html: string; text: string }) {
  const host = SMTP_HOST;
  const port = SMTP_PORT;
  const user = SMTP_USER;
  const pass = SMTP_PASS;
  const from = SMTP_FROM;

  // Use denomailer
  const { SMTPClient } = await import("https://deno.land/x/denomailer@1.6.0/mod.ts");
  const client = new SMTPClient({
    connection: {
      hostname: host,
      port,
      tls: port === 465,
      auth: { username: user, password: pass },
    },
  });
  await client.send({
    from,
    to: opts.to,
    subject: opts.subject,
    content: opts.text,
    html: opts.html,
  });
  await client.close();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const { email, origin } = await req.json();
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const baseOrigin = String(origin || "").replace(/\/$/, "") || "https://synapexdevelopers.lovable.app";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const token = randomToken(32);
    const tokenHash = await sha256(token);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const { error: insErr } = await supabase.from("magic_link_tokens").insert({
      email: cleanEmail,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });
    if (insErr) throw insErr;

    // Use edge function URL itself for verification
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const verifyUrl = `${supabaseUrl}/functions/v1/verify-magic-link?token=${token}&redirect=${encodeURIComponent(baseOrigin + "/join")}`;

    const html = `<!DOCTYPE html><html><body style="margin:0;background:#f4f4f4;padding:24px;font-family:-apple-system,Segoe UI,Roboto,sans-serif">
<div style="max-width:560px;margin:0 auto;background:#000;color:#fff;padding:40px 32px;border-radius:18px">
<h1 style="font-size:22px;margin:0 0 12px;font-weight:600">Sign in to Synapex</h1>
<p style="color:#aaa;line-height:1.6;font-size:14px;margin:0 0 28px">Click the button below to sign in to the Synapex Developer Network. This link expires in 30 minutes and can only be used once.</p>
<a href="${verifyUrl}" style="display:inline-block;background:#fff;color:#000;padding:14px 28px;border-radius:999px;text-decoration:none;font-weight:600;font-size:14px">Sign in →</a>
<p style="color:#666;font-size:12px;margin:32px 0 8px">If you didn't request this, you can safely ignore this email.</p>
<p style="color:#444;font-size:11px;margin:0;word-break:break-all">${verifyUrl}</p>
</div></body></html>`;

    await sendMail({
      to: cleanEmail,
      subject: "Your Synapex sign-in link",
      html,
      text: `Sign in to Synapex: ${verifyUrl}\n\nThis link expires in 30 minutes.`,
    });

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("send-magic-link error", e);
    return new Response(JSON.stringify({ error: e?.message || "Server error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

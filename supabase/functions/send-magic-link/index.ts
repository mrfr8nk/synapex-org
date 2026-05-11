// Supabase Edge Function: send-magic-link
// Sends a branded magic-link email via Resend.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { renderEmail, button, infoChips } from "../_shared/email-shell.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_ADDRESS = Deno.env.get("RESEND_FROM") || "Synapex <noreply@noreply.synapex.co.zw>";

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

async function sendViaResend(opts: { to: string; subject: string; html: string; text: string }) {
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM_ADDRESS, to: [opts.to], subject: opts.subject, html: opts.html, text: opts.text }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

function buildEmailHtml(verifyUrl: string, recipientEmail: string): string {
  const body = `
<h1 style="margin:0 0 14px;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.025em;line-height:1.2;">Sign in to Synapex</h1>
<p style="margin:0 0 28px;font-size:14px;color:#9a9aa3;line-height:1.65;">Hi <span style="color:#cfcfd6;">${recipientEmail}</span> — click the button below to sign in to your Synapex account. No password needed.</p>
${button("Sign in to Synapex →", verifyUrl)}
<div style="height:28px;line-height:28px;font-size:0;">&nbsp;</div>
${infoChips({ label: "Expires in", value: "30 minutes" }, { label: "Single use", value: "One click only" })}
<div style="height:24px;line-height:24px;font-size:0;">&nbsp;</div>
<div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:14px 16px;">
  <p style="margin:0 0 6px;font-size:10px;color:#6b6b73;letter-spacing:0.12em;text-transform:uppercase;font-weight:500;">Trouble with the button? Copy this link</p>
  <p style="margin:0;font-size:11px;color:#8a8a93;word-break:break-all;line-height:1.55;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">${verifyUrl}</p>
</div>
<p style="margin:28px 0 0;font-size:12px;color:#6b6b73;line-height:1.6;">If you didn't request this email, you can safely ignore it — no account changes will be made.</p>
`;
  return renderEmail(body, { preheader: "Your one-time sign-in link to Synapex (expires in 30 minutes)." });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const { email, origin } = await req.json();
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const baseOrigin = String(origin || "").replace(/\/$/, "") || "https://synapex.co.zw";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const token = randomToken(32);
    const tokenHash = await sha256(token);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const { error: insErr } = await supabase.from("magic_link_tokens").insert({
      email: cleanEmail, token_hash: tokenHash, expires_at: expiresAt,
    });
    if (insErr) throw insErr;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const verifyUrl = `${supabaseUrl}/functions/v1/verify-magic-link?token=${token}&redirect=${encodeURIComponent(baseOrigin + "/dashboard")}`;

    await sendViaResend({
      to: cleanEmail,
      subject: "Your Synapex sign-in link",
      html: buildEmailHtml(verifyUrl, cleanEmail),
      text: `Sign in to Synapex\n\nClick this link to sign in (expires in 30 minutes):\n${verifyUrl}\n\nIf you didn't request this, ignore this email.\n\n© ${new Date().getFullYear()} Synapex`,
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("send-magic-link error", e);
    return new Response(JSON.stringify({ error: e?.message || "Server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

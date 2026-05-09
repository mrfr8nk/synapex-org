// Supabase Edge Function: newsletter
// Two actions:
//  - { action: "subscribe", email, name? } -> upsert + welcome email
//  - { action: "broadcast", subject, html, text? } -> sends to all active subscribers
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM_ADDRESS = Deno.env.get("RESEND_FROM") || "Synapex <noreply@noreply.synapex.co.zw>";
const SITE_URL = Deno.env.get("SITE_URL") || "https://synapex.co.zw";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function sendOne(opts: { to: string; subject: string; html: string; text?: string }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM_ADDRESS, to: [opts.to], subject: opts.subject, html: opts.html, text: opts.text || "" }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

function shell(title: string, bodyHtml: string, unsubUrl: string) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>${title}</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;"><tr><td align="center" style="padding:40px 16px;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
<tr><td style="background:linear-gradient(135deg,#111 0%,#0d0d0d 100%);border-radius:20px;border:1px solid rgba(255,255,255,0.08);padding:36px 40px;color:#e8e8e8;">
<div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;">
  <div style="width:36px;height:36px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:10px;text-align:center;line-height:36px;color:#fff;font-weight:800;">S</div>
  <span style="color:#fff;font-size:14px;font-weight:700;letter-spacing:0.08em;">SYNAPEX</span>
</div>
${bodyHtml}
<p style="margin-top:32px;color:#666;font-size:11px;">You're receiving this because you subscribed at <a href="${SITE_URL}" style="color:#888;">synapex.co.zw</a>.
&nbsp;·&nbsp;<a href="${unsubUrl}" style="color:#888;">Unsubscribe</a></p>
</td></tr></table></td></tr></table></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const body = await req.json();
    const action = body.action || "subscribe";

    if (action === "subscribe") {
      const email = String(body.email || "").trim().toLowerCase();
      if (!email || !email.includes("@")) throw new Error("Valid email required");
      const name = body.name ? String(body.name).trim() : null;

      const { data: existing } = await supabase.from("newsletter_subscribers").select("*").eq("email", email).maybeSingle();
      let token = existing?.unsubscribe_token;
      if (!existing) {
        const { data: ins, error } = await supabase.from("newsletter_subscribers").insert({ email, name, status: "active" }).select().single();
        if (error) throw error;
        token = ins.unsubscribe_token;
      } else {
        await supabase.from("newsletter_subscribers").update({ status: "active", name: name ?? existing.name }).eq("email", email);
      }
      const unsubUrl = `${SITE_URL}/unsubscribe?token=${token}`;
      const html = shell("Welcome to Synapex", `
<h1 style="color:#fff;font-size:22px;margin:0 0 12px;">You're in${name ? `, ${name}` : ""}.</h1>
<p style="color:#bbb;font-size:14px;line-height:1.6;margin:0 0 20px;">Thanks for subscribing. You'll get monthly drops: engineering deep-dives, case studies and our honest takes on what's happening in tech.</p>
<a href="${SITE_URL}" style="display:inline-block;background:#fff;color:#000;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600;font-size:13px;">Visit synapex.co.zw</a>
`, unsubUrl);
      if (RESEND_API_KEY) {
        try { await sendOne({ to: email, subject: "Welcome to Synapex", html, text: `Welcome to Synapex. Visit ${SITE_URL}` }); } catch (e) { console.error("welcome email failed", e); }
      }
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "broadcast") {
      const subject = String(body.subject || "").trim();
      const htmlIn = String(body.html || body.message || "").trim();
      const text = body.text ? String(body.text) : undefined;
      if (!subject || !htmlIn) throw new Error("subject and html/message required");
      const { data: subs, error } = await supabase.from("newsletter_subscribers").select("email,unsubscribe_token").eq("status", "active");
      if (error) throw error;
      let sent = 0, failed = 0;
      for (const s of subs || []) {
        const unsubUrl = `${SITE_URL}/unsubscribe?token=${s.unsubscribe_token}`;
        const html = shell(subject, htmlIn.includes("<") ? htmlIn : `<p style="color:#ddd;font-size:14px;line-height:1.7;white-space:pre-wrap;">${htmlIn}</p>`, unsubUrl);
        try { await sendOne({ to: s.email, subject, html, text }); sent++; } catch (e) { console.error("broadcast fail", s.email, e); failed++; }
      }
      return new Response(JSON.stringify({ ok: true, sent, failed, total: subs?.length || 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "unsubscribe") {
      const token = String(body.token || "");
      if (!token) throw new Error("token required");
      const { error } = await supabase.from("newsletter_subscribers").update({ status: "unsubscribed" }).eq("unsubscribe_token", token);
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    throw new Error(`Unknown action: ${action}`);
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Failed" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

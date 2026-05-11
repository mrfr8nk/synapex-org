// Supabase Edge Function: newsletter
// Actions: subscribe (welcome email), broadcast (admin send), unsubscribe
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { renderEmail, button } from "../_shared/email-shell.ts";

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

function welcomeBody(name: string | null) {
  const greet = name ? `Welcome, ${name}.` : "Welcome to Synapex.";
  return `
<h1 style="margin:0 0 14px;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.025em;line-height:1.2;">${greet}</h1>
<p style="margin:0 0 22px;font-size:14px;color:#9a9aa3;line-height:1.7;">Thanks for subscribing. Once a month we send a single, well-crafted email — engineering deep-dives, product case studies, and our honest takes on what's happening in tech.</p>
<p style="margin:0 0 28px;font-size:14px;color:#9a9aa3;line-height:1.7;">No spam. No filler. Unsubscribe in one click, anytime.</p>
${button("Visit synapex.co.zw →", SITE_URL)}
<div style="height:32px;line-height:32px;font-size:0;">&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;">
<tr><td>
<p style="margin:0 0 4px;font-size:11px;color:#6b6b73;letter-spacing:0.14em;text-transform:uppercase;font-weight:500;">What to expect</p>
<p style="margin:0;font-size:13px;color:#a8a8b1;line-height:1.7;">Engineering deep-dives · Product case studies · Industry takes</p>
</td></tr></table>
`;
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
      const html = renderEmail(welcomeBody(name), {
        preheader: "You're subscribed to the Synapex monthly newsletter.",
        unsubscribeUrl: unsubUrl,
      });
      if (RESEND_API_KEY) {
        try { await sendOne({ to: email, subject: "Welcome to Synapex", html, text: `Welcome to Synapex. Visit ${SITE_URL}\n\nUnsubscribe: ${unsubUrl}` }); } catch (e) { console.error("welcome email failed", e); }
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
        const inner = htmlIn.includes("<")
          ? `<h1 style="margin:0 0 18px;font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.02em;line-height:1.25;">${subject}</h1><div style="font-size:14px;color:#cfcfd6;line-height:1.75;">${htmlIn}</div>`
          : `<h1 style="margin:0 0 18px;font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.02em;line-height:1.25;">${subject}</h1><div style="font-size:14px;color:#cfcfd6;line-height:1.75;white-space:pre-wrap;">${htmlIn}</div>`;
        const html = renderEmail(inner, { preheader: subject, unsubscribeUrl: unsubUrl });
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

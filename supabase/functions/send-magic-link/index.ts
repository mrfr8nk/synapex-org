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
  const { SMTPClient } = await import("https://deno.land/x/denomailer@1.6.0/mod.ts");
  const client = new SMTPClient({
    connection: {
      hostname: SMTP_HOST,
      port: SMTP_PORT,
      tls: SMTP_PORT === 465,
      auth: { username: SMTP_USER, password: SMTP_PASS },
    },
  });
  await client.send({
    from: SMTP_FROM,
    to: opts.to,
    subject: opts.subject,
    content: opts.text,
    html: opts.html,
  });
  await client.close();
}

function buildEmailHtml(verifyUrl: string, recipientEmail: string): string {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sign in to Synapex</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a0a;min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

          <!-- ── HEADER ── -->
          <tr>
            <td style="background:linear-gradient(135deg,#111 0%,#0d0d0d 100%);border-radius:20px 20px 0 0;border:1px solid rgba(255,255,255,0.08);border-bottom:none;padding:36px 40px 32px;">

              <!-- Logo row -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <!-- Logo mark -->
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width:36px;height:36px;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);border-radius:10px;text-align:center;vertical-align:middle;">
                          <span style="color:#fff;font-size:18px;font-weight:800;letter-spacing:-1px;line-height:36px;">S</span>
                        </td>
                        <td style="padding-left:10px;vertical-align:middle;">
                          <span style="color:#ffffff;font-size:15px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">SYNAPEX</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="display:inline-block;background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.3);color:#a5b4fc;font-size:11px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;padding:4px 12px;border-radius:999px;">Developer Network</span>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
                <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent);"></td></tr>
              </table>
            </td>
          </tr>

          <!-- ── BODY ── -->
          <tr>
            <td style="background:#0d0d0d;border-left:1px solid rgba(255,255,255,0.08);border-right:1px solid rgba(255,255,255,0.08);padding:40px 40px 36px;">

              <!-- Headline -->
              <p style="margin:0 0 8px;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.03em;line-height:1.2;">
                Your sign-in link<br/>is ready.
              </p>
              <p style="margin:0 0 32px;font-size:14px;color:rgba(255,255,255,0.45);line-height:1.7;">
                Hi&nbsp;<strong style="color:rgba(255,255,255,0.7);">${recipientEmail}</strong>, click the button below to securely sign in to the Synapex Developer Network. No password needed.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#ffffff;border-radius:999px;">
                    <a href="${verifyUrl}"
                       style="display:inline-block;padding:14px 32px;background:#ffffff;color:#000000;font-size:14px;font-weight:700;text-decoration:none;border-radius:999px;letter-spacing:0.01em;">
                      Sign in to Synapex &nbsp;→
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Info pills row -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                <tr>
                  <td style="width:50%;padding-right:8px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:14px 16px;">
                          <p style="margin:0 0 3px;font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:0.12em;text-transform:uppercase;">Expires in</p>
                          <p style="margin:0;font-size:15px;font-weight:600;color:#ffffff;">30 minutes</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="width:50%;padding-left:8px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:14px 16px;">
                          <p style="margin:0 0 3px;font-size:10px;color:rgba(255,255,255,0.3);letter-spacing:0.12em;text-transform:uppercase;">Single use</p>
                          <p style="margin:0;font-size:15px;font-weight:600;color:#ffffff;">One click only</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Fallback link box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px 16px;">
                    <p style="margin:0 0 6px;font-size:11px;color:rgba(255,255,255,0.3);letter-spacing:0.1em;text-transform:uppercase;">Button not working? Paste this link</p>
                    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.4);word-break:break-all;line-height:1.5;">${verifyUrl}</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background:#080808;border-radius:0 0 20px 20px;border:1px solid rgba(255,255,255,0.08);border-top:none;padding:28px 40px;">

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent);"></td></tr>
              </table>

              <!-- Footer content -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <!-- Small logo -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
                      <tr>
                        <td style="width:22px;height:22px;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);border-radius:6px;text-align:center;vertical-align:middle;">
                          <span style="color:#fff;font-size:11px;font-weight:800;line-height:22px;">S</span>
                        </td>
                        <td style="padding-left:7px;vertical-align:middle;">
                          <span style="color:rgba(255,255,255,0.4);font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">SYNAPEX</span>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.25);line-height:1.6;">
                      Synapex Developers &mdash; Building software that matters.
                    </p>
                    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.18);">
                      If you didn't request this email, you can safely ignore it. &copy; ${year} Synapex.
                    </p>
                  </td>
                  <td align="right" style="vertical-align:bottom;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-left:16px;">
                          <a href="https://synapex.co.zw" style="font-size:11px;color:rgba(255,255,255,0.3);text-decoration:none;">Website</a>
                        </td>
                        <td style="padding-left:16px;">
                          <a href="https://synapex.co.zw/join" style="font-size:11px;color:rgba(255,255,255,0.3);text-decoration:none;">Join</a>
                        </td>
                        <td style="padding-left:16px;">
                          <a href="https://synapex.co.zw/contact" style="font-size:11px;color:rgba(255,255,255,0.3);text-decoration:none;">Contact</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const { email, origin } = await req.json();
    const cleanEmail = String(email || "").trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
      email: cleanEmail,
      token_hash: tokenHash,
      expires_at: expiresAt,
    });
    if (insErr) throw insErr;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const verifyUrl = `${supabaseUrl}/functions/v1/verify-magic-link?token=${token}&redirect=${encodeURIComponent(baseOrigin + "/join")}`;

    await sendMail({
      to: cleanEmail,
      subject: "Your Synapex sign-in link",
      html: buildEmailHtml(verifyUrl, cleanEmail),
      text: `Sign in to Synapex Developer Network\n\nClick this link to sign in (expires in 30 minutes):\n${verifyUrl}\n\nIf you didn't request this, ignore this email.\n\n© ${new Date().getFullYear()} Synapex`,
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("send-magic-link error", e);
    return new Response(JSON.stringify({ error: e?.message || "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

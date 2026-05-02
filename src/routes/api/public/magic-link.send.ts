import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import { createHash, randomBytes } from "crypto";

export const Route = createFileRoute("/api/public/magic-link/send")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}));
          const email = String(body.email || "").trim().toLowerCase();
          if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return Response.json({ error: "Invalid email" }, { status: 400 });
          }

          const SUPABASE_URL = process.env.SUPABASE_URL!;
          const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
          const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
            auth: { persistSession: false, autoRefreshToken: false },
          });

          // Generate token
          const token = randomBytes(32).toString("hex");
          const tokenHash = createHash("sha256").update(token).digest("hex");
          const expires = new Date(Date.now() + 30 * 60 * 1000).toISOString();

          const { error: insErr } = await admin.from("magic_link_tokens").insert({
            email,
            token_hash: tokenHash,
            expires_at: expires,
          });
          if (insErr) {
            console.error("magic-link insert error", insErr);
            return Response.json({ error: "Could not create token" }, { status: 500 });
          }

          // Build verify URL — use request origin
          const url = new URL(request.url);
          const origin = `${url.protocol}//${url.host}`;
          const verifyUrl = `${origin}/api/public/magic-link/verify?token=${token}`;

          // Send email via SMTP
          const SMTP_HOST = process.env.SMTP_HOST;
          const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
          const SMTP_USER = process.env.SMTP_USER;
          const SMTP_PASS = process.env.SMTP_PASS;
          const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;
          if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
            return Response.json({ error: "SMTP not configured" }, { status: 500 });
          }
          const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: SMTP_PORT === 465,
            auth: { user: SMTP_USER, pass: SMTP_PASS },
          });

          const html = `
<div style="font-family:-apple-system,Segoe UI,sans-serif;background:#000;color:#fff;padding:40px 24px;border-radius:16px;max-width:520px;margin:0 auto">
  <h1 style="font-size:22px;font-weight:600;margin:0 0 16px">Sign in to Synapex</h1>
  <p style="color:#aaa;line-height:1.5;font-size:14px">Click the button below to sign in. This link expires in 30 minutes and can only be used once.</p>
  <a href="${verifyUrl}" style="display:inline-block;background:#fff;color:#000;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:500;font-size:14px;margin:24px 0">Sign in to Synapex</a>
  <p style="color:#666;font-size:12px;margin-top:32px">If you didn't request this, you can safely ignore this email.</p>
  <p style="color:#444;font-size:11px;margin-top:24px;word-break:break-all">${verifyUrl}</p>
</div>`;

          await transporter.sendMail({
            from: SMTP_FROM,
            to: email,
            subject: "Your Synapex sign-in link",
            html,
            text: `Sign in to Synapex: ${verifyUrl}\n\nThis link expires in 30 minutes.`,
          });

          return Response.json({ ok: true });
        } catch (e: any) {
          console.error("magic-link send error", e);
          return Response.json({ error: e?.message || "Server error" }, { status: 500 });
        }
      },
    },
  },
});

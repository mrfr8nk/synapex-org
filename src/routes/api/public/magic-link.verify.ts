import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

export const Route = createFileRoute("/api/public/magic-link/verify")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const token = url.searchParams.get("token");
        const origin = `${url.protocol}//${url.host}`;
        if (!token) {
          return Response.redirect(`${origin}/join?magic=missing`, 302);
        }
        try {
          const SUPABASE_URL = process.env.SUPABASE_URL!;
          const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
          const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
            auth: { persistSession: false, autoRefreshToken: false },
          });

          const tokenHash = createHash("sha256").update(token).digest("hex");
          const { data: row } = await admin
            .from("magic_link_tokens")
            .select("*")
            .eq("token_hash", tokenHash)
            .maybeSingle();

          if (!row || row.used || new Date(row.expires_at).getTime() < Date.now()) {
            return Response.redirect(`${origin}/join?magic=invalid`, 302);
          }

          // Mark used
          await admin.from("magic_link_tokens").update({ used: true }).eq("id", row.id);

          // Find or create user via admin api
          let userId: string | null = null;
          // Try list users (paged) — for simplicity use generateLink with magiclink to create-or-fetch
          const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
            type: "magiclink",
            email: row.email,
          });
          if (linkErr) {
            console.error("generateLink error", linkErr);
            return Response.redirect(`${origin}/join?magic=error`, 302);
          }
          // generateLink returns a hashed_token + action_link. We can extract the action_link and redirect the
          // user there — Supabase will verify and set cookies on /auth/v1/verify.
          const actionLink = (linkData as any)?.properties?.action_link;
          if (!actionLink) {
            return Response.redirect(`${origin}/join?magic=error`, 302);
          }

          // Append redirect_to so user lands on /join (which forwards to /dashboard)
          const verifyUrl = new URL(actionLink);
          verifyUrl.searchParams.set("redirect_to", `${origin}/join`);
          return Response.redirect(verifyUrl.toString(), 302);
        } catch (e: any) {
          console.error("magic-link verify error", e);
          return Response.redirect(`${origin}/join?magic=error`, 302);
        }
      },
    },
  },
});

import { createFileRoute, useSearch, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/unsubscribe")({
  component: UnsubPage,
  validateSearch: (s: Record<string, unknown>) => ({ token: typeof s.token === "string" ? s.token : "" }),
});

function UnsubPage() {
  const { token } = useSearch({ from: "/unsubscribe" });
  const [status, setStatus] = useState<"loading" | "ok" | "err">("loading");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!token) { setStatus("err"); setMsg("Missing token."); return; }
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("newsletter", { body: { action: "unsubscribe", token } });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        setStatus("ok");
      } catch (e: any) {
        setStatus("err"); setMsg(e?.message || "Failed");
      }
    })();
  }, [token]);

  return (
    <SiteLayout>
      <section className="min-h-[60vh] flex items-center justify-center px-6 py-32">
        <div className="rounded-3xl glass p-10 text-center max-w-md">
          {status === "loading" && (<><Loader2 className="h-8 w-8 mx-auto animate-spin text-white/60" /><p className="mt-4 text-sm text-white/60">Unsubscribing...</p></>)}
          {status === "ok" && (<><CheckCircle className="h-8 w-8 mx-auto text-emerald-400" /><h1 className="mt-4 text-xl font-semibold">You're unsubscribed.</h1><p className="mt-2 text-sm text-white/50">Sorry to see you go. You won't get any more emails.</p><Link to="/" className="mt-6 inline-block rounded-full bg-white text-black px-5 py-2.5 text-sm font-medium">Back home</Link></>)}
          {status === "err" && (<><AlertCircle className="h-8 w-8 mx-auto text-red-400" /><p className="mt-4 text-sm text-white/60">{msg}</p></>)}
        </div>
      </section>
    </SiteLayout>
  );
}

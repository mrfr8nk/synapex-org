import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useEffect, useState } from "react";
import { adminLogin, adminLogout, isAdmin } from "@/lib/admin";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Plus, Trash2, Save } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Synapex" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

const TABLES = [
  { key: "services", fields: ["title", "description", "icon", "sort_order"] },
  { key: "projects", fields: ["title", "category", "description", "image_url", "tech", "live_url", "github_url", "sort_order"] },
  { key: "tech_stack", fields: ["name", "category", "sort_order"] },
  { key: "clients", fields: ["name", "logo_url", "website_url", "sort_order"] },
  { key: "testimonials", fields: ["name", "role", "quote", "rating", "avatar_url", "sort_order"] },
  { key: "team_members", fields: ["name", "role", "bio", "image_url", "twitter_url", "linkedin_url", "github_url", "sort_order"] },
  { key: "pricing_plans", fields: ["name", "price", "description", "features", "is_popular", "sort_order"] },
];

function AdminPage() {
  const nav = useNavigate();
  const [logged, setLogged] = useState(false);
  const [u, setU] = useState(""); const [p, setP] = useState(""); const [err, setErr] = useState("");
  const [tab, setTab] = useState("services");
  const [rows, setRows] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => { setLogged(isAdmin()); }, []);
  useEffect(() => { if (logged) loadTab(tab); }, [logged, tab]);
  useEffect(() => { if (logged) supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).then(({ data }) => setMessages(data || [])); }, [logged]);

  async function loadTab(t: string) {
    const { data } = await supabase.from(t as any).select("*").order("sort_order", { ascending: true });
    setRows(data || []);
  }

  async function save(row: any) {
    const { id, created_at, ...rest } = row;
    if (rest.tech && typeof rest.tech === "string") rest.tech = rest.tech.split(",").map((s: string) => s.trim()).filter(Boolean);
    if (rest.features && typeof rest.features === "string") rest.features = rest.features.split("\n").map((s: string) => s.trim()).filter(Boolean);
    await supabase.from(tab as any).update(rest).eq("id", id);
    loadTab(tab);
  }
  async function add() {
    const blank: any = { sort_order: rows.length };
    const fields = TABLES.find((t) => t.key === tab)!.fields;
    fields.forEach((f) => { if (!(f in blank)) blank[f] = f === "tech" || f === "features" ? [] : f === "is_popular" ? false : f === "rating" ? 5 : ""; });
    if (tab === "services") blank.icon = "Code2";
    await supabase.from(tab as any).insert(blank);
    loadTab(tab);
  }
  async function del(id: string) {
    await supabase.from(tab as any).delete().eq("id", id);
    loadTab(tab);
  }

  if (!logged) {
    return (
      <SiteLayout>
        <section className="min-h-[80vh] flex items-center justify-center px-6 relative">
          <div className="absolute inset-0 stars" /><div className="absolute inset-0 spotlight" />
          <motion.form
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            onSubmit={(e) => { e.preventDefault(); if (adminLogin(u, p)) { setLogged(true); setErr(""); } else setErr("Invalid credentials"); }}
            className="relative w-full max-w-sm rounded-3xl glass-strong p-8 space-y-5"
          >
            <h1 className="text-2xl font-semibold tracking-tight">Admin sign in</h1>
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-white/40">Username</label>
              <input value={u} onChange={(e) => setU(e.target.value)} className="w-full bg-transparent border-b border-white/15 py-3 outline-none focus:border-white" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-white/40">Password</label>
              <input type="password" value={p} onChange={(e) => setP(e.target.value)} className="w-full bg-transparent border-b border-white/15 py-3 outline-none focus:border-white" />
            </div>
            {err && <p className="text-xs text-red-400">{err}</p>}
            <button type="submit" className="w-full rounded-full bg-white text-black py-3 text-sm font-medium hover:bg-white/90 transition-colors">Sign in</button>
            <Link to="/" className="block text-center text-xs text-white/40 hover:text-white/70">← Back to site</Link>
          </motion.form>
        </section>
      </SiteLayout>
    );
  }

  const fields = TABLES.find((t) => t.key === tab)!.fields;

  return (
    <SiteLayout>
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-white/40">Synapex CMS</div>
              <h1 className="text-3xl font-semibold tracking-tight mt-1">Content manager</h1>
            </div>
            <button onClick={() => { adminLogout(); nav({ to: "/" }); }} className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm hover:bg-white/10 transition-colors">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {TABLES.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-colors ${tab === t.key ? "bg-white text-black" : "glass hover:bg-white/10"}`}>
                {t.key.replace("_", " ")}
              </button>
            ))}
            <button onClick={() => setTab("messages")} className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-colors ${tab === "messages" ? "bg-white text-black" : "glass hover:bg-white/10"}`}>
              Messages ({messages.filter((m) => !m.read).length})
            </button>
          </div>

          {tab === "messages" ? (
            <div className="space-y-3">
              {messages.length === 0 && <p className="text-white/40 text-sm">No messages yet.</p>}
              {messages.map((m) => (
                <div key={m.id} className="rounded-2xl glass p-5">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="font-semibold">{m.name} <span className="text-white/40 text-sm font-normal">· {m.email}</span></div>
                      <p className="mt-2 text-sm text-white/70 whitespace-pre-wrap">{m.message}</p>
                    </div>
                    <span className="text-[10px] text-white/30 whitespace-nowrap">{new Date(m.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <button onClick={add} className="mb-4 inline-flex items-center gap-2 rounded-full bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 transition-colors">
                <Plus className="h-4 w-4" /> Add new
              </button>
              <div className="space-y-3">
                {rows.length === 0 && <p className="text-white/40 text-sm">Empty — site shows fallback content. Click "Add new" to override.</p>}
                {rows.map((row, idx) => (
                  <div key={row.id} className="rounded-2xl glass p-5 space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      {fields.map((f) => {
                        const val = row[f];
                        const display = Array.isArray(val) ? (f === "features" ? val.join("\n") : val.join(", ")) : val ?? "";
                        const isLong = f === "description" || f === "bio" || f === "quote" || f === "features";
                        return (
                          <div key={f} className={isLong ? "sm:col-span-2" : ""}>
                            <label className="text-[10px] uppercase tracking-wider text-white/40">{f}</label>
                            {f === "is_popular" ? (
                              <input type="checkbox" checked={!!val} onChange={(e) => { const next = [...rows]; next[idx][f] = e.target.checked; setRows(next); }} className="ml-3" />
                            ) : isLong ? (
                              <textarea value={display} rows={3} onChange={(e) => { const next = [...rows]; next[idx][f] = e.target.value; setRows(next); }} className="w-full bg-transparent border border-white/10 rounded-lg p-2 text-sm focus:border-white/40 outline-none" />
                            ) : (
                              <input value={display} onChange={(e) => { const next = [...rows]; next[idx][f] = e.target.value; setRows(next); }} className="w-full bg-transparent border border-white/10 rounded-lg p-2 text-sm focus:border-white/40 outline-none" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-white/10">
                      <button onClick={() => save(row)} className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-3 py-1.5 text-xs font-medium hover:bg-white/90"><Save className="h-3 w-3" /> Save</button>
                      <button onClick={() => del(row.id)} className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs hover:bg-red-500/20"><Trash2 className="h-3 w-3" /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

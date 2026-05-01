import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useEffect, useState } from "react";
import { adminLogin, adminLogout, isAdmin } from "@/lib/admin";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Plus, Trash2, Save, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Synapex" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

const TABLES = [
  { key: "services", label: "Services", fields: ["title", "description", "icon", "sort_order"], orderBy: "sort_order" },
  { key: "projects", label: "Projects", fields: ["title", "category", "description", "image_url", "tech", "live_url", "github_url", "sort_order"], orderBy: "sort_order" },
  { key: "tech_stack", label: "Tech Stack", fields: ["name", "category", "sort_order"], orderBy: "sort_order" },
  { key: "clients", label: "Clients", fields: ["name", "logo_url", "website_url", "sort_order"], orderBy: "sort_order" },
  { key: "testimonials", label: "Testimonials", fields: ["name", "role", "quote", "rating", "avatar_url", "sort_order"], orderBy: "sort_order" },
  { key: "team_members", label: "Team", fields: ["name", "role", "bio", "image_url", "twitter_url", "linkedin_url", "github_url", "sort_order"], orderBy: "sort_order" },
  { key: "pricing_plans", label: "Pricing", fields: ["name", "price", "description", "features", "is_popular", "sort_order"], orderBy: "sort_order" },
  { key: "blog_posts", label: "Blog Posts", fields: ["title", "slug", "summary", "content", "author", "category", "image_url", "published"], orderBy: "created_at" },
];

type Toast = { id: number; type: "success" | "error"; message: string };

function ToastContainer({ toasts, remove }: { toasts: Toast[]; remove: (id: number) => void }) {
  return (
    <div className="fixed top-24 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg pointer-events-auto cursor-pointer ${
              t.type === "success" ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300" : "bg-red-500/20 border border-red-500/30 text-red-300"
            }`}
            onClick={() => remove(t.id)}
          >
            {t.type === "success" ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function AdminPage() {
  const nav = useNavigate();
  const [logged, setLogged] = useState(false);
  const [u, setU] = useState(""); const [p, setP] = useState(""); const [err, setErr] = useState("");
  const [tab, setTab] = useState("services");
  const [rows, setRows] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [supabaseOk, setSupabaseOk] = useState<boolean | null>(null);

  const addToast = (type: "success" | "error", message: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  useEffect(() => {
    setLogged(isAdmin());
    checkSupabase();
  }, []);

  async function checkSupabase() {
    try {
      const { error } = await supabase.from("services" as any).select("id").limit(1);
      setSupabaseOk(!error || error.message !== 'Supabase not configured');
    } catch {
      setSupabaseOk(false);
    }
  }

  useEffect(() => { if (logged) loadTab(tab); }, [logged, tab]);
  useEffect(() => {
    if (!logged) return;
    supabase.from("contact_messages" as any).select("*").order("created_at", { ascending: false }).then(({ data }) => setMessages(data || []));
  }, [logged]);

  async function loadTab(t: string) {
    setLoading(true);
    try {
      const tableConfig = TABLES.find((x) => x.key === t);
      const orderBy = tableConfig?.orderBy || "sort_order";
      const ascending = orderBy !== "created_at";
      const { data, error } = await supabase.from(t as any).select("*").order(orderBy, { ascending });
      if (error) addToast("error", `Load failed: ${error.message}`);
      else setRows(data || []);
    } catch (e: any) {
      addToast("error", e?.message || "Failed to load data");
    }
    setLoading(false);
  }

  async function save(row: any) {
    setSaving(row.id);
    try {
      const { id, created_at, ...rest } = row;
      if (rest.tech && typeof rest.tech === "string") rest.tech = rest.tech.split(",").map((s: string) => s.trim()).filter(Boolean);
      if (rest.features && typeof rest.features === "string") rest.features = rest.features.split("\n").map((s: string) => s.trim()).filter(Boolean);
      const { error } = await supabase.from(tab as any).update(rest).eq("id", id);
      if (error) addToast("error", `Save failed: ${error.message}`);
      else { addToast("success", "Saved!"); await loadTab(tab); }
    } catch (e: any) {
      addToast("error", e?.message || "Save failed");
    }
    setSaving(null);
  }

  async function add() {
    setLoading(true);
    try {
      const tableConfig = TABLES.find((t) => t.key === tab)!;
      const blank: any = tableConfig.orderBy === "sort_order" ? { sort_order: rows.length } : {};
      tableConfig.fields.forEach((f) => {
        if (!(f in blank)) blank[f] = f === "tech" || f === "features" ? [] : f === "is_popular" || f === "published" ? false : f === "rating" ? 5 : "";
      });
      if (tab === "services") blank.icon = "Code2";
      if (tab === "blog_posts") { blank.slug = `post-${Date.now()}`; blank.published = false; blank.author = "Synapex Team"; }
      const { error } = await supabase.from(tab as any).insert(blank);
      if (error) addToast("error", `Add failed: ${error.message}`);
      else { addToast("success", "Added new row"); await loadTab(tab); }
    } catch (e: any) {
      addToast("error", e?.message || "Add failed");
    }
    setLoading(false);
  }

  async function del(id: string) {
    try {
      const { error } = await supabase.from(tab as any).delete().eq("id", id);
      if (error) addToast("error", `Delete failed: ${error.message}`);
      else { addToast("success", "Deleted"); await loadTab(tab); }
    } catch (e: any) {
      addToast("error", e?.message || "Delete failed");
    }
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
            <div className="flex items-center gap-3 mb-2">
              <img src="/synapex-logo.png" alt="Synapex" className="h-8 w-8 object-contain" />
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Admin sign in</h1>
                <p className="text-[11px] text-white/40">Synapex CMS</p>
              </div>
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-white/40">Username</label>
              <input value={u} onChange={(e) => setU(e.target.value)} autoFocus
                className="w-full bg-transparent border-b border-white/15 py-3 outline-none focus:border-white transition-colors" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.2em] text-white/40">Password</label>
              <input type="password" value={p} onChange={(e) => setP(e.target.value)}
                className="w-full bg-transparent border-b border-white/15 py-3 outline-none focus:border-white transition-colors" />
            </div>
            {err && <p className="text-xs text-red-400">{err}</p>}
            <button type="submit" className="w-full rounded-full bg-white text-black py-3 text-sm font-medium hover:bg-white/90 transition-colors">
              Sign in
            </button>
            <Link to="/" className="block text-center text-xs text-white/40 hover:text-white/70 transition-colors">← Back to site</Link>
          </motion.form>
        </section>
      </SiteLayout>
    );
  }

  const fields = TABLES.find((t) => t.key === tab)?.fields || [];

  return (
    <SiteLayout>
      <ToastContainer toasts={toasts} remove={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <img src="/synapex-logo.png" alt="" className="h-8 w-8 object-contain" />
              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-white/40">Synapex CMS</div>
                <h1 className="text-2xl font-semibold tracking-tight mt-0.5">Content Manager</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {supabaseOk === false && (
                <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs text-amber-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Supabase not connected
                </div>
              )}
              {supabaseOk === true && (
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs text-emerald-400">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Connected
                </div>
              )}
              <button onClick={() => { adminLogout(); nav({ to: "/" }); }}
                className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm hover:bg-white/10 transition-colors">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>

          {supabaseOk === false && (
            <div className="mb-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 p-5">
              <p className="text-sm text-amber-300 font-medium">Supabase not configured</p>
              <p className="mt-1 text-sm text-white/50">
                Add your <code className="text-white/70">VITE_SUPABASE_URL</code> and <code className="text-white/70">VITE_SUPABASE_PUBLISHABLE_KEY</code> environment variables to enable data management. The site currently shows fallback content.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {TABLES.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all duration-200 ${tab === t.key ? "bg-white text-black scale-105" : "glass hover:bg-white/10"}`}>
                {t.label}
              </button>
            ))}
            <button onClick={() => setTab("messages")}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all duration-200 ${tab === "messages" ? "bg-white text-black scale-105" : "glass hover:bg-white/10"}`}>
              Messages
              {messages.filter((m) => !m.read).length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-500 text-[10px] font-bold">
                  {messages.filter((m) => !m.read).length}
                </span>
              )}
            </button>
          </div>

          {tab === "messages" ? (
            <div className="space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-16 text-white/40 text-sm">No messages yet.</div>
              )}
              {messages.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl glass p-5">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="font-semibold">{m.name}
                        <span className="text-white/40 text-sm font-normal"> · {m.email}</span>
                        {m.phone && <span className="text-white/40 text-sm font-normal"> · {m.phone}</span>}
                      </div>
                      {m.subject && <div className="mt-1 text-xs text-white/50 font-medium uppercase tracking-wider">{m.subject}</div>}
                      <p className="mt-2 text-sm text-white/70 whitespace-pre-wrap leading-relaxed">{m.message}</p>
                    </div>
                    <span className="text-[10px] text-white/30 whitespace-nowrap shrink-0">
                      {new Date(m.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-5">
                <button onClick={add}
                  className="inline-flex items-center gap-2 rounded-full bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 transition-colors">
                  <Plus className="h-4 w-4" /> Add new
                </button>
                <button onClick={() => loadTab(tab)}
                  className={`inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm hover:bg-white/10 transition-colors ${loading ? "opacity-50" : ""}`}>
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
                </button>
              </div>

              {loading ? (
                <div className="text-center py-16">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto text-white/40" />
                  <p className="mt-2 text-sm text-white/40">Loading...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rows.length === 0 && (
                    <div className="rounded-2xl glass p-8 text-center">
                      <p className="text-white/40 text-sm">Empty — site shows fallback content.</p>
                      <p className="text-white/30 text-xs mt-1">Click "Add new" to override with custom content.</p>
                    </div>
                  )}
                  <AnimatePresence>
                    {rows.map((row, idx) => (
                      <motion.div
                        key={row.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="rounded-2xl glass p-5 space-y-3"
                      >
                        <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-wider mb-1">
                          <span>#{idx + 1}</span>
                          {row.title && <span className="text-white/50 font-medium normal-case text-xs tracking-normal">{row.title}</span>}
                          {row.name && <span className="text-white/50 font-medium normal-case text-xs tracking-normal">{row.name}</span>}
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {fields.map((f) => {
                            const val = row[f];
                            const display = Array.isArray(val)
                              ? (f === "features" ? val.join("\n") : val.join(", "))
                              : val ?? "";
                            const isLong = f === "description" || f === "bio" || f === "quote" || f === "features" || f === "summary";
                            const isContent = f === "content";
                            const isBool = f === "is_popular" || f === "published";
                            return (
                              <div key={f} className={isLong || isContent ? "sm:col-span-2" : ""}>
                                <label className="text-[10px] uppercase tracking-wider text-white/40 mb-1 block">{f.replace(/_/g, " ")}</label>
                                {isBool ? (
                                  <div className="flex items-center gap-2">
                                    <input type="checkbox" checked={!!val}
                                      onChange={(e) => { const next = [...rows]; next[idx][f] = e.target.checked; setRows(next); }}
                                      className="h-4 w-4 accent-white" />
                                    <span className="text-sm text-white/60">
                                      {f === "published" ? (val ? "Published" : "Draft") : (val ? "Popular" : "Standard")}
                                    </span>
                                  </div>
                                ) : isContent ? (
                                  <textarea value={display} rows={10}
                                    onChange={(e) => { const next = [...rows]; next[idx][f] = e.target.value; setRows(next); }}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-white/40 outline-none transition-colors resize-y font-mono" />
                                ) : isLong ? (
                                  <textarea value={display} rows={3}
                                    onChange={(e) => { const next = [...rows]; next[idx][f] = e.target.value; setRows(next); }}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-white/40 outline-none transition-colors resize-none" />
                                ) : (
                                  <input value={display}
                                    onChange={(e) => { const next = [...rows]; next[idx][f] = e.target.value; setRows(next); }}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:border-white/40 outline-none transition-colors" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex gap-2 pt-3 border-t border-white/10">
                          <button onClick={() => save(row)}
                            disabled={saving === row.id}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-4 py-2 text-xs font-medium hover:bg-white/90 transition-colors disabled:opacity-50">
                            {saving === row.id ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                            {saving === row.id ? "Saving..." : "Save"}
                          </button>
                          <button onClick={() => del(row.id)}
                            className="inline-flex items-center gap-1.5 rounded-full glass px-4 py-2 text-xs hover:bg-red-500/20 hover:border-red-500/30 transition-colors">
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

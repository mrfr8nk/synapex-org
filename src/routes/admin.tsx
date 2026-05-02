import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { adminLogin, adminLogout, isAdmin } from "@/lib/admin";
import { supabase } from "@/integrations/supabase/client";
import { saveSiteContentKey, useSiteContent } from "@/lib/useContent";
import { fallbackContent } from "@/lib/content";
import {
  LogOut, Plus, Trash2, Save, RefreshCw, CheckCircle, AlertCircle,
  LayoutDashboard, FileText, Users, Star, DollarSign, Briefcase,
  MessageSquare, Settings, Eye, EyeOff, Upload, Link2, Mail,
  ExternalLink, ChevronRight, Layers, BookOpen, Code2, Globe,
  Image as ImageIcon, X, Check, Inbox, Send, Newspaper, Zap,
  Building2, Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageInput } from "@/components/ImageInput";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

type Toast = { id: number; type: "success" | "error"; message: string };

const NAV_ITEMS = [
  { key: "overview", label: "Overview", Icon: LayoutDashboard },
  { key: "events", label: "Events & News", Icon: Newspaper },
  { key: "services", label: "Services", Icon: Briefcase },
  { key: "projects", label: "Projects", Icon: Layers },
  { key: "tech_stack", label: "Tech Stack", Icon: Code2 },
  { key: "clients", label: "Clients", Icon: Globe },
  { key: "testimonials", label: "Testimonials", Icon: Star },
  { key: "team_members", label: "Team", Icon: Users },
  { key: "pricing_plans", label: "Pricing", Icon: DollarSign },
  { key: "blog_posts", label: "Blog Posts", Icon: BookOpen },
  { key: "sponsors_mgmt", label: "Sponsors", Icon: Heart },
  { key: "developers", label: "Developers", Icon: FileText },
  { key: "newsletter", label: "Newsletter", Icon: Mail },
  { key: "messages", label: "Messages", Icon: Inbox },
  { key: "settings", label: "Site Settings", Icon: Settings },
];

const TABLE_CONFIG: Record<string, { fields: string[]; orderBy: string }> = {
  events: { fields: ["title", "type", "summary", "image_url", "link_url", "event_date", "sort_order", "visible"], orderBy: "created_at" },
  services: { fields: ["title", "description", "icon", "sort_order", "visible"], orderBy: "sort_order" },
  projects: { fields: ["title", "category", "description", "image_url", "tech", "live_url", "github_url", "is_open", "sort_order", "visible"], orderBy: "sort_order" },
  tech_stack: { fields: ["name", "category", "sort_order", "visible"], orderBy: "sort_order" },
  clients: { fields: ["name", "logo_url", "website_url", "sort_order", "visible"], orderBy: "sort_order" },
  testimonials: { fields: ["name", "role", "quote", "rating", "avatar_url", "sort_order", "visible"], orderBy: "sort_order" },
  team_members: { fields: ["name", "role", "bio", "image_url", "twitter_url", "linkedin_url", "github_url", "sort_order", "visible"], orderBy: "sort_order" },
  pricing_plans: { fields: ["name", "price", "description", "features", "is_popular", "sort_order", "visible"], orderBy: "sort_order" },
  blog_posts: { fields: ["title", "slug", "summary", "content", "author", "category", "image_url", "published", "pending_approval", "visible"], orderBy: "created_at" },
};

const IMAGE_FIELDS = ["image_url", "logo_url", "avatar_url", "photo_url", "cover_url", "thumbnail_url"];

const SETTINGS_FIELDS = [
  { group: "Social Links", items: [
    { key: "social_github", label: "GitHub URL", placeholder: "https://github.com/your-org" },
    { key: "social_twitter", label: "Twitter / X URL", placeholder: "https://twitter.com/your-handle" },
    { key: "social_linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/your-org" },
    { key: "social_instagram", label: "Instagram URL", placeholder: "https://instagram.com/your-handle" },
    { key: "social_facebook", label: "Facebook URL", placeholder: "https://facebook.com/your-page" },
    { key: "social_youtube", label: "YouTube URL", placeholder: "https://youtube.com/@your-channel" },
  ]},
  { group: "Contact Info", items: [
    { key: "contact_email", label: "Email Address", placeholder: "hello@company.com" },
    { key: "contact_whatsapp", label: "WhatsApp / Phone", placeholder: "+1 234 567 8900" },
    { key: "contact_location", label: "Location", placeholder: "City, Country" },
  ]},
  { group: "Footer & Brand", items: [
    { key: "footer_tagline", label: "Footer Tagline", placeholder: "What you do, for who." },
    { key: "hero_title", label: "Hero Headline", placeholder: "We build the future." },
    { key: "hero_subtitle", label: "Hero Subtitle", placeholder: "Short description of your agency." },
    { key: "about_body", label: "About Paragraph", placeholder: "Tell your story..." },
  ]},
];

function Toast({ toasts, remove }: { toasts: Toast[]; remove: (id: number) => void }) {
  return (
    <div className="fixed top-6 right-6 z-[100] space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            onClick={() => remove(t.id)}
            className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-medium shadow-2xl pointer-events-auto cursor-pointer border ${
              t.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300 backdrop-blur-xl"
                : "bg-red-950/90 border-red-500/30 text-red-300 backdrop-blur-xl"
            }`}
          >
            {t.type === "success" ? <Check className="h-4 w-4 shrink-0" /> : <X className="h-4 w-4 shrink-0" />}
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("images").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("images").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e: any) {
      alert(`Upload failed: ${e?.message || "Unknown error"}. Make sure you have an 'images' bucket in Supabase Storage with public access.`);
    }
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or upload below"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors placeholder:text-white/20"
        />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/10 px-3 py-2.5 text-xs hover:bg-white/15 transition-colors disabled:opacity-50 shrink-0"
        >
          {uploading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <input ref={ref} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
      </div>
      {value && (
        <div className="flex items-center gap-2">
          <img src={value} alt="" className="h-12 w-12 rounded-lg object-cover border border-white/10" onError={(e) => { (e.target as any).style.display = "none"; }} />
          <span className="text-[10px] text-white/30 truncate max-w-[200px]">{value}</span>
          <button type="button" onClick={() => onChange("")} className="text-white/30 hover:text-white/60 transition-colors ml-auto"><X className="h-3.5 w-3.5" /></button>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, Icon }: { label: string; value: number | string; Icon: any }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex items-center gap-4">
      <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-white/50" />
      </div>
      <div>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <div className="text-xs text-white/40 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

/* ── SMTP provider presets ─────────────────────────────────── */
const SMTP_PRESETS: Record<string, { host: string; port: string }> = {
  "gmail.com":       { host: "smtp.gmail.com",           port: "587" },
  "googlemail.com":  { host: "smtp.gmail.com",           port: "587" },
  "outlook.com":     { host: "smtp-mail.outlook.com",    port: "587" },
  "hotmail.com":     { host: "smtp-mail.outlook.com",    port: "587" },
  "live.com":        { host: "smtp-mail.outlook.com",    port: "587" },
  "yahoo.com":       { host: "smtp.mail.yahoo.com",      port: "465" },
  "yahoo.co.uk":     { host: "smtp.mail.yahoo.com",      port: "465" },
  "icloud.com":      { host: "smtp.mail.me.com",         port: "587" },
  "me.com":          { host: "smtp.mail.me.com",         port: "587" },
  "protonmail.com":  { host: "smtp.protonmail.com",      port: "587" },
  "proton.me":       { host: "smtp.protonmail.com",      port: "587" },
  "zoho.com":        { host: "smtp.zoho.com",            port: "587" },
};

function SettingsTab({
  settingsValues, setSettingsValues, settingsSaving, saveSettings, supabaseOk,
}: {
  settingsValues: Record<string, string>;
  setSettingsValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  settingsSaving: boolean;
  saveSettings: () => void;
  supabaseOk: boolean | null;
}) {
  const [smtpEmail, setSmtpEmail] = useState("");
  const [smtpPass,  setSmtpPass]  = useState("");
  const [smtpFrom,  setSmtpFrom]  = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const domain  = smtpEmail.includes("@") ? smtpEmail.split("@")[1].toLowerCase() : "";
  const preset  = SMTP_PRESETS[domain] ?? null;
  const smtpHost = preset?.host ?? (domain ? `smtp.${domain}` : "");
  const smtpPort = preset?.port ?? "587";
  const fromAddr = smtpFrom || smtpEmail;

  const secrets: { key: string; label: string; value: string }[] = [
    { key: "SMTP_HOST", label: "SMTP_HOST", value: smtpHost },
    { key: "SMTP_PORT", label: "SMTP_PORT", value: smtpPort },
    { key: "SMTP_USER", label: "SMTP_USER", value: smtpEmail },
    { key: "SMTP_PASS", label: "SMTP_PASS", value: smtpPass },
    { key: "SMTP_FROM", label: "SMTP_FROM", value: fromAddr },
  ];

  function copySecret(key: string, value: string) {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
    });
  }

  function copyAll() {
    const text = secrets.map((s) => `${s.key}=${s.value}`).join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey("ALL");
      setTimeout(() => setCopiedKey(null), 1800);
    });
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Site Settings</h2>
        <p className="text-sm text-white/40 mt-1">Changes save to Supabase and appear on your site immediately.</p>
      </div>

      {SETTINGS_FIELDS.map(({ group, items }) => (
        <div key={group} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
          <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 pb-2 border-b border-white/8">{group}</h3>
          {items.map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label className="text-xs text-white/60 font-medium">{label}</label>
              <input
                value={settingsValues[key] ?? ""}
                onChange={(e) => setSettingsValues((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors placeholder:text-white/20"
              />
            </div>
          ))}
        </div>
      ))}

      <div className="flex items-center gap-3">
        <button onClick={saveSettings} disabled={settingsSaving || supabaseOk === false}
          className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-2.5 text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50">
          {settingsSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {settingsSaving ? "Saving..." : "Save all settings"}
        </button>
        {supabaseOk === false && (
          <p className="text-xs text-amber-400">Connect Supabase first to save settings.</p>
        )}
      </div>

      {/* SMTP helper */}
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-5">
        <div>
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <span className="h-5 w-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 text-[10px]">✉</span>
            Email magic-link — SMTP secrets helper
          </h3>
          <p className="text-xs text-white/40 mt-1">
            Enter your email + app password. Secrets are auto-generated — copy them into{" "}
            <span className="text-white/60">Supabase → Project Settings → Edge Functions → Secrets</span>.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-white/40">Your email address</label>
            <input
              type="email"
              value={smtpEmail}
              onChange={(e) => setSmtpEmail(e.target.value)}
              placeholder="you@gmail.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors placeholder:text-white/20"
            />
            {smtpEmail && preset && (
              <p className="text-[11px] text-emerald-400">
                ✓ Auto-detected: {preset.host}:{preset.port}
              </p>
            )}
            {smtpEmail && !preset && domain && (
              <p className="text-[11px] text-white/35">Using: smtp.{domain}:{smtpPort}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-white/40">App password</label>
            <input
              type="password"
              value={smtpPass}
              onChange={(e) => setSmtpPass(e.target.value)}
              placeholder="16-char app password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors placeholder:text-white/20"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-[11px] uppercase tracking-wider text-white/40">
              Sender address <span className="normal-case text-white/25">(optional — defaults to your email above)</span>
            </label>
            <input
              type="email"
              value={smtpFrom}
              onChange={(e) => setSmtpFrom(e.target.value)}
              placeholder="no-reply@synapex.co.zw"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors placeholder:text-white/20"
            />
          </div>
        </div>

        {smtpEmail && smtpPass && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-wider text-white/40">Secrets to paste into Supabase</p>
              <button
                onClick={copyAll}
                className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
              >
                {copiedKey === "ALL" ? "✓ Copied all" : "Copy all"}
              </button>
            </div>
            <div className="rounded-xl bg-black/40 border border-white/8 overflow-hidden divide-y divide-white/5">
              {secrets.map((s) => (
                <div key={s.key} className="flex items-center gap-3 px-4 py-2.5 group">
                  <span className="text-[11px] text-white/30 w-24 shrink-0 font-mono">{s.label}</span>
                  <span className="text-xs text-white/70 font-mono flex-1 truncate">
                    {s.key === "SMTP_PASS" ? "•".repeat(Math.min(s.value.length, 16)) : s.value || <span className="text-white/20 italic">—</span>}
                  </span>
                  <button
                    onClick={() => copySecret(s.key, s.value)}
                    className="text-[11px] text-white/30 hover:text-white/70 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                  >
                    {copiedKey === s.key ? "✓" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-white/25 leading-relaxed">
              Gmail users: generate an <span className="text-white/50">App Password</span> at myaccount.google.com → Security → 2-Step Verification → App passwords. Do not use your regular Gmail password.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function NewsletterTab() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("newsletter_subscribers" as any)
      .select("*")
      .order("subscribed_at", { ascending: false })
      .then(({ data }) => { setSubs(data || []); setLoading(false); });
  }, []);

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <h2 className="text-base font-semibold">Newsletter subscribers</h2>
        <p className="text-xs text-white/40 mt-0.5">{loading ? "Loading..." : `${subs.length} subscriber${subs.length !== 1 ? "s" : ""}`}</p>
      </div>

      {!loading && subs.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-16 text-center">
          <Mail className="h-8 w-8 text-white/20 mx-auto mb-3" />
          <p className="text-sm text-white/40">No subscribers yet.</p>
          <p className="text-xs text-white/25 mt-1">People who sign up via the newsletter section will appear here.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="divide-y divide-white/5">
            {subs.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-7 w-7 rounded-full bg-white/5 border border-white/8 flex items-center justify-center shrink-0 text-[10px] font-bold text-white/30">
                    {s.email[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-white/70">{s.email}</span>
                </div>
                <span className="text-[11px] text-white/25 whitespace-nowrap">
                  {s.subscribed_at ? new Date(s.subscribed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                </span>
              </div>
            ))}
          </div>
          {subs.length > 0 && (
            <div className="px-5 py-3 border-t border-white/5">
              <a
                href={`data:text/csv;charset=utf-8,email,subscribed_at\n${subs.map((s) => `${s.email},${s.subscribed_at}`).join("\n")}`}
                download="newsletter-subscribers.csv"
                className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
              >
                <Upload className="h-3 w-3" /> Export CSV
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AdminPage() {
  const nav = useNavigate();
  const [logged, setLogged] = useState(false);
  const [u, setU] = useState(""); const [p, setP] = useState(""); const [err, setErr] = useState("");
  const [tab, setTab] = useState("overview");
  const [rows, setRows] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [developers, setDevelopers] = useState<any[]>([]);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [sponsorApps, setSponsorApps] = useState<any[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [supabaseOk, setSupabaseOk] = useState<boolean | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const siteContent = useSiteContent();
  const [settingsValues, setSettingsValues] = useState<Record<string, string>>({});
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [newSponsor, setNewSponsor] = useState({ name: "", logo_url: "", website_url: "", tier: "community", description: "" });
  const [addingSponsor, setAddingSponsor] = useState(false);
  const [collabApps, setCollabApps] = useState<any[]>([]);

  const addToast = (type: "success" | "error", message: string) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  useEffect(() => {
    setLogged(isAdmin());
    checkSupabase();
  }, []);

  useEffect(() => {
    const init: Record<string, string> = {};
    SETTINGS_FIELDS.forEach(({ items }) => items.forEach(({ key }) => {
      init[key] = String(siteContent[key] ?? fallbackContent[key] ?? "");
    }));
    setSettingsValues(init);
  }, [siteContent]);

  async function checkSupabase() {
    try {
      const { error } = await supabase.from("services" as any).select("id").limit(1);
      setSupabaseOk(!error || error.message !== "Supabase not configured");
    } catch {
      setSupabaseOk(false);
    }
  }

  async function loadStats() {
    const tables = Object.keys(TABLE_CONFIG);
    const counts: Record<string, number> = {};
    await Promise.all(tables.map(async (t) => {
      try {
        const { count } = await supabase.from(t as any).select("id", { count: "exact", head: true });
        counts[t] = count ?? 0;
      } catch { counts[t] = 0; }
    }));
    setStats(counts);
  }

  useEffect(() => {
    if (!logged) return;
    loadStats();
    supabase.from("contact_messages" as any).select("*").order("created_at", { ascending: false })
      .then(({ data }) => setMessages(data || []));
    supabase.from("developer_profiles" as any).select("*").order("joined_at", { ascending: false })
      .then(({ data }) => setDevelopers(data || []));
  }, [logged]);

  useEffect(() => {
    if (!logged) return;
    if (tab in TABLE_CONFIG) loadTab(tab);
    if (tab === "developers") {
      supabase.from("developer_profiles" as any).select("*").order("joined_at", { ascending: false })
        .then(({ data }) => setDevelopers(data || []));
    }
    if (tab === "sponsors_mgmt") {
      loadSponsors();
    }
    if (tab === "projects") {
      supabase.from("project_collaborators" as any)
        .select("*, projects(title, category)")
        .order("created_at", { ascending: false })
        .then(({ data }) => setCollabApps(data || []));
    }
  }, [logged, tab]);

  async function loadSponsors() {
    const [sRes, aRes] = await Promise.all([
      supabase.from("sponsors" as any).select("*").order("sort_order", { ascending: true }),
      supabase.from("sponsor_applications" as any).select("*").order("created_at", { ascending: false }),
    ]);
    setSponsors(sRes.data || []);
    setSponsorApps(aRes.data || []);
  }

  async function addSponsor() {
    if (!newSponsor.name) return;
    setAddingSponsor(true);
    const { error } = await supabase.from("sponsors" as any).insert({
      name: newSponsor.name,
      logo_url: newSponsor.logo_url || null,
      website_url: newSponsor.website_url || null,
      tier: newSponsor.tier,
      description: newSponsor.description || null,
      sort_order: sponsors.length,
      visible: true,
    });
    if (error) addToast("error", `Failed: ${error.message}`);
    else { addToast("success", "Sponsor added"); setNewSponsor({ name: "", logo_url: "", website_url: "", tier: "community", description: "" }); await loadSponsors(); }
    setAddingSponsor(false);
  }

  async function deleteSponsor(id: string) {
    if (!confirm("Delete sponsor?")) return;
    await supabase.from("sponsors" as any).delete().eq("id", id);
    addToast("success", "Deleted"); loadSponsors();
  }

  async function markSponsorAppRead(id: string) {
    await supabase.from("sponsor_applications" as any).update({ read: true }).eq("id", id);
    setSponsorApps((prev) => prev.map((a) => a.id === id ? { ...a, read: true } : a));
  }

  async function deleteSponsorApp(id: string) {
    if (!confirm("Delete this application?")) return;
    await supabase.from("sponsor_applications" as any).delete().eq("id", id);
    setSponsorApps((prev) => prev.filter((a) => a.id !== id));
  }

  async function loadTab(t: string) {
    if (!(t in TABLE_CONFIG)) return;
    setLoading(true);
    try {
      const cfg = TABLE_CONFIG[t];
      const asc = cfg.orderBy !== "created_at";
      const { data, error } = await supabase.from(t as any).select("*").order(cfg.orderBy, { ascending: asc });
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
      else { addToast("success", "Saved successfully"); await loadTab(tab); }
    } catch (e: any) {
      addToast("error", e?.message || "Save failed");
    }
    setSaving(null);
  }

  async function add() {
    setLoading(true);
    try {
      const cfg = TABLE_CONFIG[tab];
      const blank: any = cfg.orderBy === "sort_order" ? { sort_order: rows.length, visible: true } : { visible: true };
      cfg.fields.forEach((f) => {
        if (!(f in blank)) blank[f] = f === "tech" || f === "features" ? [] : ["is_popular", "published", "visible"].includes(f) ? (f === "visible" ? true : false) : f === "rating" ? 5 : "";
      });
      if (tab === "services") blank.icon = "Code2";
      if (tab === "blog_posts") { blank.slug = `post-${Date.now()}`; blank.published = false; blank.author = "Synapex Team"; }
      if (tab === "events") { blank.title = "New event"; blank.type = "update"; blank.sort_order = rows.length; }
      const { error } = await supabase.from(tab as any).insert(blank);
      if (error) addToast("error", `Add failed: ${error.message}`);
      else { addToast("success", "Added new item"); await loadTab(tab); await loadStats(); }
    } catch (e: any) {
      addToast("error", e?.message || "Add failed");
    }
    setLoading(false);
  }

  async function del(id: string) {
    if (!confirm("Delete this item?")) return;
    try {
      const { error } = await supabase.from(tab as any).delete().eq("id", id);
      if (error) addToast("error", `Delete failed: ${error.message}`);
      else { addToast("success", "Deleted"); await loadTab(tab); await loadStats(); }
    } catch (e: any) {
      addToast("error", e?.message || "Delete failed");
    }
  }

  async function markRead(id: string) {
    await supabase.from("contact_messages" as any).update({ read: true }).eq("id", id);
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: true } : m));
  }

  async function deleteMessage(id: string) {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_messages" as any).delete().eq("id", id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  async function saveSettings() {
    setSettingsSaving(true);
    let ok = true;
    for (const [key, value] of Object.entries(settingsValues)) {
      const success = await saveSiteContentKey(key, value);
      if (!success) ok = false;
    }
    setSettingsSaving(false);
    if (ok) addToast("success", "Settings saved — reload to see changes");
    else addToast("error", "Some settings failed to save");
  }

  if (!logged) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6 relative">
        <div className="absolute inset-0 stars" />
        <div className="absolute inset-0 spotlight" />
        <motion.form
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={(e) => { e.preventDefault(); if (adminLogin(u, p)) { setLogged(true); setErr(""); } else setErr("Invalid credentials"); }}
          className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 space-y-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <img src="/synapex-logo.png" alt="Synapex" className="h-9 w-9 object-contain" />
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Admin sign in</h1>
              <p className="text-[11px] text-white/40">Synapex CMS</p>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-[0.2em] text-white/40">Username</label>
            <input value={u} onChange={(e) => setU(e.target.value)} autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 outline-none focus:border-white/40 transition-colors text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-[0.2em] text-white/40">Password</label>
            <input type="password" value={p} onChange={(e) => setP(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 outline-none focus:border-white/40 transition-colors text-sm" />
          </div>
          {err && <p className="text-xs text-red-400">{err}</p>}
          <button type="submit" className="w-full rounded-full bg-white text-black py-3 text-sm font-medium hover:bg-white/90 transition-colors">
            Sign in
          </button>
          <Link to="/" className="block text-center text-xs text-white/40 hover:text-white/70 transition-colors">← Back to site</Link>
        </motion.form>
      </div>
    );
  }

  const unreadCount = messages.filter((m) => !m.read).length;
  const fields = TABLE_CONFIG[tab]?.fields || [];
  const navLabel = NAV_ITEMS.find((n) => n.key === tab)?.label || tab;

  return (
    <div className="min-h-screen bg-black flex text-white">
      <Toast toasts={toasts} remove={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-white/10 bg-black/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <img src="/synapex-logo.png" alt="" className="h-8 w-8 object-contain" />
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-white/30">Synapex</div>
            <div className="text-sm font-semibold">CMS Dashboard</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {NAV_ITEMS.map(({ key, label, Icon }) => (
            <button key={key} onClick={() => { setTab(key); setMobileNav(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                tab === key ? "bg-white text-black font-medium" : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {key === "messages" && unreadCount > 0 && (
                <span className={`h-5 min-w-5 rounded-full text-[10px] font-bold flex items-center justify-center px-1 ${tab === key ? "bg-black text-white" : "bg-blue-500 text-white"}`}>
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10 space-y-3">
          <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs ${
            supabaseOk === true ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            : supabaseOk === false ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            : "bg-white/5 text-white/30 border border-white/10"
          }`}>
            <div className={`h-1.5 w-1.5 rounded-full ${supabaseOk === true ? "bg-emerald-400" : supabaseOk === false ? "bg-amber-400" : "bg-white/30"}`} />
            {supabaseOk === true ? "Supabase connected" : supabaseOk === false ? "Supabase not connected" : "Checking..."}
          </div>
          <div className="flex gap-2">
            <Link to="/" className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              <ExternalLink className="h-3.5 w-3.5" /> View site
            </Link>
            <button onClick={() => { adminLogout(); nav({ to: "/" }); }}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileNav && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileNav(false)} />}

      {/* Main */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex items-center gap-4 px-6 py-4 border-b border-white/10 bg-black/90 backdrop-blur-xl">
          <button onClick={() => setMobileNav(true)} className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <Layers className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-white/40">Dashboard</span>
            <ChevronRight className="h-3 w-3 text-white/20" />
            <span className="font-medium">{navLabel}</span>
          </div>
          {tab in TABLE_CONFIG && (
            <div className="ml-auto flex items-center gap-2">
              <button onClick={add}
                className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-4 py-2 text-xs font-medium hover:bg-white/90 transition-colors">
                <Plus className="h-3.5 w-3.5" /> Add new
              </button>
              <button onClick={() => loadTab(tab)}
                className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs hover:bg-white/10 transition-colors ${loading ? "opacity-50" : ""}`}>
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 p-6 overflow-auto">
          {/* Supabase warning */}
          {supabaseOk === false && (
            <div className="mb-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 p-4 flex gap-3 items-start">
              <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-amber-300 font-medium">Supabase not connected</p>
                <p className="mt-0.5 text-xs text-white/50">
                  Add <code className="text-white/70">VITE_SUPABASE_URL</code> and <code className="text-white/70">VITE_SUPABASE_PUBLISHABLE_KEY</code> to your environment variables.
                  The site shows fallback content until then.
                </p>
              </div>
            </div>
          )}

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">Good to see you 👋</h2>
                <p className="text-sm text-white/40 mt-1">Here's a snapshot of your site content.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                <StatCard label="Services" value={stats.services ?? "—"} Icon={Briefcase} />
                <StatCard label="Projects" value={stats.projects ?? "—"} Icon={Layers} />
                <StatCard label="Team members" value={stats.team_members ?? "—"} Icon={Users} />
                <StatCard label="Blog posts" value={stats.blog_posts ?? "—"} Icon={BookOpen} />
                <StatCard label="Pending posts" value={rows.filter((r) => r.pending_approval && !r.published).length || "—"} Icon={BookOpen} />
                <StatCard label="Clients" value={stats.clients ?? "—"} Icon={Globe} />
                <StatCard label="Testimonials" value={stats.testimonials ?? "—"} Icon={Star} />
                <StatCard label="Pricing plans" value={stats.pricing_plans ?? "—"} Icon={DollarSign} />
                <StatCard label="Messages" value={messages.length} Icon={MessageSquare} />
                <StatCard label="Developers" value={developers.length} Icon={Users} />
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="text-sm font-medium mb-3">Quick actions</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(TABLE_CONFIG).map((t) => (
                    <button key={t} onClick={() => setTab(t)}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs hover:bg-white/10 transition-colors capitalize">
                      Edit {t.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CONTENT TABLE */}
          {tab in TABLE_CONFIG && (
            <div className="space-y-4">
              {loading ? (
                <div className="flex flex-col items-center py-20 text-white/30">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                  <p className="mt-3 text-sm">Loading...</p>
                </div>
              ) : rows.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">
                  <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
                    <Plus className="h-5 w-5 text-white/30" />
                  </div>
                  <p className="text-sm text-white/50 font-medium">No items yet</p>
                  <p className="text-xs text-white/30 mt-1">The site shows fallback content. Click "Add new" to override with your own.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {rows.map((row, idx) => (
                    <motion.div key={row.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className={`rounded-2xl border p-5 space-y-4 transition-colors ${
                        row.visible === false ? "border-white/5 bg-white/[0.01] opacity-60" : "border-white/10 bg-white/[0.03]"
                      }`}
                    >
                      {/* Row header */}
                      <div className="flex items-center gap-3 justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-white/25 font-mono">#{idx + 1}</span>
                          <span className="text-sm font-medium text-white/80">{row.title || row.name || row.slug || "Untitled"}</span>
                          {row.published === true && <span className="rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10px] px-2 py-0.5">Published</span>}
                          {row.published === false && row.pending_approval && tab === "blog_posts" && <span className="rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 text-[10px] px-2 py-0.5">⏳ Pending review</span>}
                          {row.published === false && !row.pending_approval && tab === "blog_posts" && <span className="rounded-full bg-white/5 border border-white/10 text-white/30 text-[10px] px-2 py-0.5">Draft</span>}
                          {row.is_popular && <span className="rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-400 text-[10px] px-2 py-0.5">Popular</span>}
                        </div>
                        {/* Visible toggle */}
                        <button
                          onClick={() => {
                            const next = [...rows];
                            next[idx].visible = row.visible === false ? true : false;
                            setRows(next);
                          }}
                          title={row.visible === false ? "Hidden from site — click to show" : "Visible on site — click to hide"}
                          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] border transition-colors ${
                            row.visible === false
                              ? "bg-white/5 border-white/10 text-white/30 hover:text-white/60"
                              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                          }`}
                        >
                          {row.visible === false ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          {row.visible === false ? "Hidden" : "Visible"}
                        </button>
                      </div>

                      {/* Fields grid */}
                      <div className="grid sm:grid-cols-2 gap-3">
                        {fields.filter((f) => f !== "visible").map((f) => {
                          const val = row[f];
                          const display = Array.isArray(val)
                            ? (f === "features" ? val.join("\n") : val.join(", "))
                            : val ?? "";
                          const isLong = ["description", "bio", "quote", "features", "summary"].includes(f);
                          const isContent = f === "content";
                          const isBool = ["is_popular", "published", "is_open"].includes(f);
                          const isImage = IMAGE_FIELDS.includes(f);

                          const isEventType = tab === "events" && f === "type";

                          return (
                            <div key={f} className={isLong || isContent || isImage ? "sm:col-span-2" : ""}>
                              <label className="text-[10px] uppercase tracking-wider text-white/35 mb-1.5 block">{f.replace(/_/g, " ")}</label>
                              {isEventType ? (
                                <select
                                  value={display}
                                  onChange={(e) => { const next = [...rows]; next[idx][f] = e.target.value; setRows(next); }}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors text-white/80"
                                >
                                  <option value="update">Update</option>
                                  <option value="news">News</option>
                                  <option value="event">Event</option>
                                  <option value="announcement">Announcement</option>
                                  <option value="achievement">Achievement</option>
                                </select>
                              ) : isBool ? (
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <div
                                    onClick={() => { const next = [...rows]; next[idx][f] = !val; setRows(next); }}
                                    className={`h-5 w-9 rounded-full transition-colors cursor-pointer relative ${val ? "bg-white" : "bg-white/15"}`}
                                  >
                                    <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-black transition-all ${val ? "left-[18px]" : "left-0.5"}`} />
                                  </div>
                                  <span className="text-sm text-white/60">{f === "published" ? (val ? "Published" : "Draft") : (val ? "Popular" : "Standard")}</span>
                                </label>
                              ) : isImage ? (
                                <ImageInput value={display} onChange={(v) => { const next = [...rows]; next[idx][f] = v; setRows(next); }} />
                              ) : isContent ? (
                                <textarea value={display} rows={10}
                                  onChange={(e) => { const next = [...rows]; next[idx][f] = e.target.value; setRows(next); }}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors resize-y font-mono leading-relaxed" />
                              ) : isLong ? (
                                <textarea value={display} rows={3}
                                  onChange={(e) => { const next = [...rows]; next[idx][f] = e.target.value; setRows(next); }}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors resize-none leading-relaxed" />
                              ) : (
                                <input value={display}
                                  onChange={(e) => { const next = [...rows]; next[idx][f] = e.target.value; setRows(next); }}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors" />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Row actions */}
                      <div className="flex flex-wrap gap-2 pt-3 border-t border-white/8">
                        <button onClick={() => save(row)} disabled={saving === row.id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-5 py-2 text-xs font-medium hover:bg-white/90 transition-colors disabled:opacity-50">
                          {saving === row.id ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                          {saving === row.id ? "Saving..." : "Save changes"}
                        </button>
                        {tab === "blog_posts" && row.pending_approval && !row.published && (
                          <button
                            onClick={async () => {
                              const { error } = await supabase.from("blog_posts" as any)
                                .update({ published: true, pending_approval: false, visible: true })
                                .eq("id", row.id);
                              if (!error) {
                                const next = [...rows];
                                next[idx] = { ...row, published: true, pending_approval: false, visible: true };
                                setRows(next);
                                addToast("success", `"${row.title}" approved and published!`);
                              } else {
                                addToast("error", "Approve failed: " + error.message);
                              }
                            }}
                            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 text-white px-4 py-2 text-xs font-medium hover:bg-emerald-400 transition-colors"
                          >
                            <CheckCircle className="h-3 w-3" /> Approve &amp; Publish
                          </button>
                        )}
                        {tab === "blog_posts" && row.slug && (
                          <Link to="/blog/$slug" params={{ slug: row.slug }} target="_blank"
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                            <ExternalLink className="h-3 w-3" /> View post
                          </Link>
                        )}
                        {tab === "projects" && row.live_url && row.live_url !== "#" && (
                          <a href={row.live_url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                            <Globe className="h-3 w-3" /> View live
                          </a>
                        )}
                        <button onClick={() => del(row.id)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-colors ml-auto">
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          )}

          {/* PROJECT COLLABORATION REQUESTS */}
          {tab === "projects" && collabApps.length > 0 && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-white/8" />
                <h3 className="text-xs uppercase tracking-[0.2em] text-white/40 whitespace-nowrap">Join requests</h3>
                <span className="h-px flex-1 bg-white/8" />
              </div>
              <div className="space-y-3">
                {collabApps.map((app) => (
                  <div key={app.id} className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${
                    app.status === "pending" ? "border-amber-500/20 bg-amber-500/5" :
                    app.status === "accepted" ? "border-emerald-500/20 bg-emerald-500/5" :
                    "border-white/8 bg-white/[0.02] opacity-60"
                  }`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">{app.developer_name || "Anonymous dev"}</span>
                        <span className={`rounded-full text-[10px] px-2 py-0.5 border ${
                          app.status === "pending" ? "bg-amber-500/15 border-amber-500/30 text-amber-400" :
                          app.status === "accepted" ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" :
                          "bg-white/5 border-white/10 text-white/30"
                        }`}>{app.status}</span>
                      </div>
                      <p className="text-xs text-white/40 mt-0.5">
                        {app.developer_email} · <span className="text-white/60">{app.projects?.title || app.project_id}</span>
                        {app.projects?.category && ` (${app.projects.category})`}
                      </p>
                      {app.message && <p className="text-xs text-white/55 mt-2 leading-relaxed italic">"{app.message}"</p>}
                    </div>
                    {app.status === "pending" && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={async () => {
                            await supabase.from("project_collaborators" as any).update({ status: "accepted" }).eq("id", app.id);
                            setCollabApps((prev) => prev.map((a) => a.id === app.id ? { ...a, status: "accepted" } : a));
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 text-white px-4 py-2 text-xs font-medium hover:bg-emerald-400 transition-colors"
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Accept
                        </button>
                        <button
                          onClick={async () => {
                            await supabase.from("project_collaborators" as any).update({ status: "rejected" }).eq("id", app.id);
                            setCollabApps((prev) => prev.map((a) => a.id === app.id ? { ...a, status: "rejected" } : a));
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" /> Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DEVELOPERS */}
          {tab === "developers" && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-base font-semibold">Developer network</h2>
                  <p className="text-xs text-white/40 mt-0.5">{developers.length} registered developer{developers.length !== 1 ? "s" : ""} worldwide</p>
                </div>
              </div>
              {developers.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-16 text-center">
                  <Users className="h-8 w-8 text-white/20 mx-auto mb-3" />
                  <p className="text-sm text-white/40">No developers yet</p>
                  <p className="text-xs text-white/25 mt-1">Developers who sign up via /join will appear here.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  <AnimatePresence>
                    {developers.map((dev, i) => (
                      <motion.div key={dev.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                      >
                        <div className="flex items-start gap-3">
                          {dev.avatar_url ? (
                            <img src={dev.avatar_url} alt="" className="h-10 w-10 rounded-xl object-cover border border-white/10 shrink-0" />
                          ) : (
                            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                              <span className="text-sm font-semibold text-white/40">{(dev.name || "?")[0].toUpperCase()}</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-medium truncate">{dev.name || "Unnamed"}</span>
                              <span className={`rounded-full text-[10px] px-2 py-0.5 border ${
                                dev.status === "active"
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                  : "bg-white/5 border-white/10 text-white/30"
                              }`}>{dev.status || "active"}</span>
                            </div>
                            {dev.location && <p className="text-[11px] text-white/35 mt-0.5 flex items-center gap-1"><Globe className="h-2.5 w-2.5" />{dev.location}</p>}
                            {dev.bio && <p className="text-xs text-white/45 mt-1.5 line-clamp-2 leading-relaxed">{dev.bio}</p>}
                            {dev.skills && dev.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {dev.skills.slice(0, 4).map((s: string) => (
                                  <span key={s} className="rounded-full bg-white/5 border border-white/8 text-[10px] text-white/40 px-2 py-0.5">{s}</span>
                                ))}
                                {dev.skills.length > 4 && <span className="text-[10px] text-white/25">+{dev.skills.length - 4}</span>}
                              </div>
                            )}
                            <div className="mt-2 flex gap-3">
                              {dev.github_url && (
                                <a href={dev.github_url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-white/35 hover:text-white transition-colors flex items-center gap-1">
                                  <ExternalLink className="h-2.5 w-2.5" /> GitHub
                                </a>
                              )}
                              {dev.portfolio_url && (
                                <a href={dev.portfolio_url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-white/35 hover:text-white transition-colors flex items-center gap-1">
                                  <ExternalLink className="h-2.5 w-2.5" /> Portfolio
                                </a>
                              )}
                              <span className="text-[11px] text-white/20 ml-auto">
                                {dev.joined_at ? new Date(dev.joined_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {/* SPONSORS MANAGEMENT */}
          {tab === "sponsors_mgmt" && (
            <div className="space-y-8 max-w-4xl">
              {/* Current Sponsors */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-semibold">Current sponsors</h2>
                    <p className="text-xs text-white/40 mt-0.5">{sponsors.length} sponsor{sponsors.length !== 1 ? "s" : ""} displayed on site</p>
                  </div>
                </div>

                {/* Add sponsor form */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 mb-4 space-y-3">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-white/40">Add new sponsor</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-white/35 mb-1.5 block">Name *</label>
                      <input value={newSponsor.name} onChange={(e) => setNewSponsor((s) => ({ ...s, name: e.target.value }))}
                        placeholder="Company name" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors placeholder:text-white/20" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-white/35 mb-1.5 block">Tier</label>
                      <select value={newSponsor.tier} onChange={(e) => setNewSponsor((s) => ({ ...s, tier: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors">
                        <option value="community">Community</option>
                        <option value="growth">Growth</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-white/35 mb-1.5 block">Website URL</label>
                      <input value={newSponsor.website_url} onChange={(e) => setNewSponsor((s) => ({ ...s, website_url: e.target.value }))}
                        placeholder="https://company.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors placeholder:text-white/20" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-white/35 mb-1.5 block">Description</label>
                      <input value={newSponsor.description} onChange={(e) => setNewSponsor((s) => ({ ...s, description: e.target.value }))}
                        placeholder="Short note (optional)" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors placeholder:text-white/20" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[10px] uppercase tracking-wider text-white/35 mb-1.5 block">Logo URL</label>
                      <ImageInput value={newSponsor.logo_url} onChange={(v) => setNewSponsor((s) => ({ ...s, logo_url: v }))} placeholder="Paste logo URL or upload" />
                    </div>
                  </div>
                  <button onClick={addSponsor} disabled={addingSponsor || !newSponsor.name}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-5 py-2 text-xs font-medium hover:bg-white/90 transition-colors disabled:opacity-50">
                    {addingSponsor ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                    Add sponsor
                  </button>
                </div>

                {sponsors.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">
                    <Building2 className="h-7 w-7 text-white/20 mx-auto mb-2" />
                    <p className="text-sm text-white/40">No sponsors yet — add one above.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {sponsors.map((s: any) => (
                      <motion.div key={s.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex items-center gap-3">
                        {s.logo_url ? (
                          <img src={s.logo_url} alt={s.name} className="h-10 w-10 rounded-lg object-contain border border-white/10 shrink-0 bg-white/5" />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-xs font-bold text-white/30">{s.name[0]}</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{s.name}</div>
                          <div className="text-[11px] text-white/35 capitalize">{s.tier}</div>
                        </div>
                        <button onClick={() => deleteSponsor(s.id)}
                          className="text-white/25 hover:text-red-400 transition-colors shrink-0"><Trash2 className="h-3.5 w-3.5" /></button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sponsor Applications */}
              <div>
                <div className="mb-4">
                  <h2 className="text-base font-semibold">Sponsorship applications</h2>
                  <p className="text-xs text-white/40 mt-0.5">{sponsorApps.filter((a) => !a.read).length} unread</p>
                </div>
                {sponsorApps.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">
                    <Heart className="h-7 w-7 text-white/20 mx-auto mb-2" />
                    <p className="text-sm text-white/40">No applications yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sponsorApps.map((a: any) => (
                      <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className={`rounded-2xl border p-5 ${!a.read ? "border-amber-500/20 bg-amber-500/[0.03]" : "border-white/8 bg-white/[0.02]"}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-sm font-medium flex items-center gap-2">
                              {a.name}
                              {!a.read && <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />}
                            </div>
                            <div className="text-xs text-white/40 mt-0.5">{a.email}{a.company ? ` · ${a.company}` : ""}</div>
                          </div>
                          <span className="text-[11px] text-white/25 whitespace-nowrap">{new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        </div>
                        {a.amount && <div className="mt-2 text-xs font-semibold text-emerald-400">Offering: {a.amount}</div>}
                        {a.message && <p className="mt-2 text-sm text-white/60 leading-relaxed">{a.message}</p>}
                        <div className="mt-3 flex gap-2 pt-3 border-t border-white/8">
                          <a href={`mailto:${a.email}?subject=Re: Sponsorship Application`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-4 py-2 text-xs font-medium hover:bg-white/90 transition-colors">
                            <Send className="h-3 w-3" /> Reply
                          </a>
                          {!a.read && (
                            <button onClick={() => markSponsorAppRead(a.id)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 hover:text-white transition-colors">
                              <CheckCircle className="h-3 w-3" /> Mark read
                            </button>
                          )}
                          <button onClick={() => deleteSponsorApp(a.id)}
                            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/8 px-3 py-2 text-xs text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* NEWSLETTER SUBSCRIBERS */}
          {tab === "newsletter" && (
            <NewsletterTab />
          )}

          {/* MESSAGES */}
          {tab === "messages" && (
            <div className="space-y-3 max-w-3xl">
              {messages.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-16 text-center">
                  <Inbox className="h-8 w-8 text-white/20 mx-auto mb-3" />
                  <p className="text-sm text-white/40">Your inbox is empty</p>
                  <p className="text-xs text-white/25 mt-1">Messages from your contact form will appear here.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-white/50">{messages.length} message{messages.length !== 1 ? "s" : ""}</span>
                    {unreadCount > 0 && <span className="rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] px-2 py-0.5">{unreadCount} unread</span>}
                  </div>
                  <AnimatePresence>
                    {messages.map((m) => (
                      <motion.div key={m.id}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className={`rounded-2xl border p-5 transition-colors ${
                          !m.read ? "border-blue-500/20 bg-blue-500/[0.04]" : "border-white/8 bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-9 w-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-sm font-semibold">
                              {(m.name || "?")[0].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium flex items-center gap-2">
                                {m.name}
                                {!m.read && <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />}
                              </div>
                              <div className="text-xs text-white/40 truncate">{m.email}{m.phone ? ` · ${m.phone}` : ""}</div>
                            </div>
                          </div>
                          <span className="text-[11px] text-white/25 whitespace-nowrap shrink-0">
                            {new Date(m.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        {m.subject && (
                          <div className="mt-3 text-xs font-semibold uppercase tracking-wider text-white/40">{m.subject}</div>
                        )}
                        <p className="mt-2 text-sm text-white/70 whitespace-pre-wrap leading-relaxed">{m.message}</p>
                        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-white/8">
                          <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "Your message")}`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-4 py-2 text-xs font-medium hover:bg-white/90 transition-colors">
                            <Send className="h-3 w-3" /> Reply via email
                          </a>
                          {!m.read && (
                            <button onClick={() => markRead(m.id)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                              <CheckCircle className="h-3 w-3" /> Mark read
                            </button>
                          )}
                          <button onClick={() => deleteMessage(m.id)}
                            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/8 px-3 py-2 text-xs text-white/30 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-colors">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </>
              )}
            </div>
          )}

          {/* SETTINGS */}
          {tab === "settings" && (
            <SettingsTab
              settingsValues={settingsValues}
              setSettingsValues={setSettingsValues}
              settingsSaving={settingsSaving}
              saveSettings={saveSettings}
              supabaseOk={supabaseOk}
            />
          )}
        </div>
      </main>
    </div>
  );
}

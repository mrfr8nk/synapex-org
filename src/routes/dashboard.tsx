import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  Github, Globe, Code2, User, MapPin, LogOut, Edit3, CheckCircle,
  Loader2, ExternalLink, Calendar, Star, Zap, Users, BarChart3,
  ArrowUpRight, Link2,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const nav = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { nav({ to: "/join" }); return; }
      setSession(data.session);
      loadProfile(data.session.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!s) { nav({ to: "/join" }); return; }
      setSession(s);
      loadProfile(s.user);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function loadProfile(user: any) {
    setLoading(true);
    try {
      const { data } = await supabase.from("developer_profiles" as any)
        .select("*").eq("user_id", user.id).single();
      if (!data) { nav({ to: "/join" }); return; }
      setProfile(data);
      setForm(data);
    } catch {
      nav({ to: "/join" });
    }
    setLoading(false);
  }

  async function saveProfile() {
    setSaving(true);
    try {
      await supabase.from("developer_profiles" as any)
        .update({ name: form.name, bio: form.bio, location: form.location, github_url: form.github_url, portfolio_url: form.portfolio_url, skills: form.skills })
        .eq("user_id", session.user.id);
      setProfile(form);
      setEditing(false);
    } catch {}
    setSaving(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    nav({ to: "/" });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/30" />
      </div>
    );
  }

  const avatar = session?.user?.user_metadata?.avatar_url || profile?.avatar_url;
  const joined = profile?.joined_at ? new Date(profile.joined_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Recently";
  const skills: string[] = profile?.skills || [];

  return (
    <SiteLayout>
      <div className="absolute inset-0 stars opacity-15 pointer-events-none" />
      <div className="relative pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Developer Dashboard</h1>
              <p className="text-sm text-white/40 mt-0.5">Welcome back, {profile?.name?.split(" ")[0] || "dev"}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(!editing)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs hover:bg-white/10 transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit profile
              </button>
              <button
                onClick={signOut}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          </div>

          {/* Profile card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-7"
          >
            {editing ? (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Edit your profile</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "Full name", placeholder: "Your name" },
                    { key: "location", label: "Location", placeholder: "City, Country" },
                    { key: "github_url", label: "GitHub URL", placeholder: "https://github.com/you" },
                    { key: "portfolio_url", label: "Portfolio URL", placeholder: "https://your-site.com" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="text-[10px] uppercase tracking-wider text-white/35 mb-1.5 block">{label}</label>
                      <input
                        value={form[key] || ""}
                        onChange={(e) => setForm((f: any) => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors placeholder:text-white/20"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-white/35 mb-1.5 block">Bio</label>
                  <textarea
                    value={form.bio || ""}
                    onChange={(e) => setForm((f: any) => ({ ...f, bio: e.target.value }))}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors resize-none"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-5 py-2 text-xs font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                    Save changes
                  </button>
                  <button
                    onClick={() => { setEditing(false); setForm(profile); }}
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {avatar ? (
                  <img src={avatar} alt="" className="h-16 w-16 rounded-2xl border border-white/15 object-cover shrink-0" />
                ) : (
                  <div className="h-16 w-16 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                    <User className="h-7 w-7 text-white/30" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold tracking-tight">{profile.name}</h2>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5">Active</span>
                  </div>
                  {profile.bio && <p className="mt-2 text-sm text-white/50 leading-relaxed max-w-lg">{profile.bio}</p>}
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/35">
                    {profile.location && (
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {profile.location}</span>
                    )}
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Joined {joined}</span>
                    {profile.github_url && (
                      <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                        <Github className="h-3 w-3" /> GitHub <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                    {profile.portfolio_url && (
                      <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                        <Link2 className="h-3 w-3" /> Portfolio <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                  {skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {skills.map((s) => (
                        <span key={s} className="rounded-full bg-white/5 border border-white/10 text-white/50 text-[11px] px-2.5 py-1">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Projects contributed", value: "—", Icon: Code2 },
              { label: "Network members", value: "Growing", Icon: Users },
              { label: "Skill badges", value: skills.length || "—", Icon: Star },
              { label: "Status", value: "Active", Icon: Zap },
            ].map(({ label, value, Icon }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Icon className="h-4 w-4 text-white/30 mb-3" />
                <div className="text-lg font-semibold">{value}</div>
                <div className="text-[11px] text-white/35 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Network CTA */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <BarChart3 className="h-5 w-5 text-white/30 mb-3" />
              <h3 className="font-semibold text-sm">Explore open projects</h3>
              <p className="text-xs text-white/40 mt-1 leading-relaxed">Browse current Synapex projects and apply to contribute.</p>
              <Link to="/projects" className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors">
                View projects <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <Globe className="h-5 w-5 text-white/30 mb-3" />
              <h3 className="font-semibold text-sm">Connect with the team</h3>
              <p className="text-xs text-white/40 mt-1 leading-relaxed">Reach out to collaborate, ask questions, or join a live project.</p>
              <Link to="/contact" className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors">
                Contact us <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </SiteLayout>
  );
}

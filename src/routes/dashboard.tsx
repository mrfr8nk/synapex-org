import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github, Globe, User, MapPin, LogOut, Edit3, CheckCircle,
  Loader2, ExternalLink, Calendar, Star, Users,
  Link2, Send, Clock, XCircle, Briefcase, ChevronRight,
  FolderOpen, MessageSquare, Code2, BookOpen, PenLine,
  ImageIcon, Tag, FileText, RefreshCw, Plus, Megaphone,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

type Tab = "overview" | "projects" | "blog" | "write";

function extractGithubUsername(url: string): string {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    if (u.hostname === "github.com") return u.pathname.replace(/^\//, "").split("/")[0];
  } catch {}
  return "";
}

function githubAvatarFromUrl(url: string): string {
  const user = extractGithubUsername(url);
  return user ? `https://avatars.githubusercontent.com/${user}` : "";
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function DashboardPage() {
  const nav = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");

  // profile edit
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});

  // projects / collabs
  const [openProjects, setOpenProjects] = useState<any[]>([]);
  const [myCollabs, setMyCollabs] = useState<any[]>([]);
  const [networkCount, setNetworkCount] = useState<number>(0);
  const [applying, setApplying] = useState<string | null>(null);
  const [applyMsg, setApplyMsg] = useState<Record<string, string>>({});
  const [applyPanel, setApplyPanel] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);

  // project updates
  const [updateText, setUpdateText] = useState<Record<string, string>>({});
  const [updatePanel, setUpdatePanel] = useState<string | null>(null);
  const [postingUpdate, setPostingUpdate] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  // blog
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [blogForm, setBlogForm] = useState({ title: "", summary: "", content: "", category: "", image_url: "" });
  const [blogSaving, setBlogSaving] = useState(false);
  const [blogSuccess, setBlogSuccess] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { nav({ to: "/join" }); return; }
      setSession(data.session);
      loadAll(data.session.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!s) { nav({ to: "/join" }); return; }
      setSession(s);
      loadAll(s.user);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function loadAll(user: any) {
    setLoading(true);
    try {
      const [profileRes, openRes, collabRes, countRes, postsRes] = await Promise.all([
        supabase.from("developer_profiles" as any).select("*").eq("user_id", user.id).single(),
        supabase.from("projects" as any).select("*").eq("is_open", true).eq("visible", true).order("sort_order", { ascending: true }),
        supabase.from("project_collaborators" as any)
          .select("*, projects(id,title,category,description,tech,live_url,github_url,image_url)")
          .eq("user_id", user.id),
        supabase.from("developer_profiles" as any).select("id", { count: "exact", head: true }),
        supabase.from("blog_posts" as any)
          .select("id,title,slug,summary,published,pending_approval,created_at")
          .eq("submitted_by_user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      if (!profileRes.data) { nav({ to: "/join" }); return; }

      // auto-update avatar from GitHub URL if missing
      const p = profileRes.data as any;
      if (!p.avatar_url && p.github_url) {
        const ghAvatar = githubAvatarFromUrl(p.github_url);
        if (ghAvatar) {
          await supabase.from("developer_profiles" as any).update({ avatar_url: ghAvatar }).eq("user_id", user.id);
          p.avatar_url = ghAvatar;
        }
      }

      setProfile(p);
      setForm(p);

      const myProjectIds = new Set((collabRes.data || []).map((c: any) => c.project_id));
      setOpenProjects((openRes.data || []).filter((pr: any) => !myProjectIds.has(pr.id)));
      setMyCollabs(collabRes.data || []);
      setNetworkCount((countRes as any).count ?? 0);
      setMyPosts(postsRes.data || []);
    } catch {
      nav({ to: "/join" });
    }
    setLoading(false);
  }

  async function saveProfile() {
    setSaving(true);
    try {
      // derive avatar from github URL if not set
      let avatar = form.avatar_url || "";
      if (!avatar && form.github_url) avatar = githubAvatarFromUrl(form.github_url);

      await supabase.from("developer_profiles" as any)
        .update({ name: form.name, bio: form.bio, location: form.location, github_url: form.github_url, portfolio_url: form.portfolio_url, skills: form.skills, avatar_url: avatar || form.avatar_url })
        .eq("user_id", session.user.id);
      const updated = { ...form, avatar_url: avatar || form.avatar_url };
      setProfile(updated);
      setForm(updated);
      setEditing(false);
    } catch {}
    setSaving(false);
  }

  async function applyToProject(projectId: string) {
    if (!session) return;
    setApplying(projectId);
    try {
      const { error } = await supabase.from("project_collaborators" as any).insert({
        project_id: projectId, user_id: session.user.id,
        developer_name: profile.name, developer_email: session.user.email,
        message: applyMsg[projectId] || null, status: "pending",
      });
      if (!error) {
        const applied = openProjects.find((p) => p.id === projectId);
        setOpenProjects((prev) => prev.filter((p) => p.id !== projectId));
        if (applied) setMyCollabs((prev) => [...prev, { project_id: projectId, status: "pending", projects: applied, message: applyMsg[projectId] }]);
        setApplyPanel(null);
        setApplySuccess(projectId);
        setTimeout(() => setApplySuccess(null), 3500);
      }
    } catch {}
    setApplying(null);
  }

  async function postProjectUpdate(projectId: string) {
    if (!session || !updateText[projectId]?.trim()) return;
    setPostingUpdate(projectId);
    try {
      const { error } = await supabase.from("project_updates" as any).insert({
        project_id: projectId, user_id: session.user.id,
        developer_name: profile.name, content: updateText[projectId].trim(),
      });
      if (!error) {
        setUpdatePanel(null);
        setUpdateText((t) => ({ ...t, [projectId]: "" }));
        setUpdateSuccess(projectId);
        setTimeout(() => setUpdateSuccess(null), 3000);
      }
    } catch {}
    setPostingUpdate(null);
  }

  async function submitBlogPost() {
    if (!blogForm.title.trim() || !blogForm.content.trim()) return;
    setBlogSaving(true);
    try {
      const slug = slugify(blogForm.title) + "-" + Date.now().toString(36);
      const { error } = await supabase.from("blog_posts" as any).insert({
        title: blogForm.title.trim(),
        slug,
        summary: blogForm.summary.trim() || null,
        content: blogForm.content.trim(),
        category: blogForm.category.trim() || null,
        image_url: blogForm.image_url.trim() || null,
        author: profile.name,
        published: false,
        pending_approval: true,
        submitted_by_user_id: session.user.id,
      });
      if (!error) {
        setBlogSuccess(true);
        setBlogForm({ title: "", summary: "", content: "", category: "", image_url: "" });
        // reload posts
        const { data } = await supabase.from("blog_posts" as any)
          .select("id,title,slug,summary,published,pending_approval,created_at")
          .eq("submitted_by_user_id", session.user.id)
          .order("created_at", { ascending: false });
        setMyPosts(data || []);
        setTimeout(() => setBlogSuccess(false), 4000);
        setTab("blog");
      }
    } catch {}
    setBlogSaving(false);
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

  const avatar = profile?.avatar_url || session?.user?.user_metadata?.avatar_url
    || (profile?.github_url ? githubAvatarFromUrl(profile.github_url) : "");
  const joined = profile?.joined_at ? new Date(profile.joined_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Recently";
  const skills: string[] = Array.isArray(profile?.skills) ? profile.skills : [];
  const acceptedCollabs = myCollabs.filter((c) => c.status === "accepted");
  const pendingCollabs = myCollabs.filter((c) => c.status === "pending");
  const rejectedCollabs = myCollabs.filter((c) => c.status === "rejected");

  const TABS: { key: Tab; label: string; Icon: any; badge?: number }[] = [
    { key: "overview", label: "Overview", Icon: User },
    { key: "projects", label: "Projects", Icon: FolderOpen, badge: acceptedCollabs.length + openProjects.length || undefined },
    { key: "blog", label: "My posts", Icon: BookOpen, badge: myPosts.length || undefined },
    { key: "write", label: "Write post", Icon: PenLine },
  ];

  return (
    <SiteLayout>
      <div className="absolute inset-0 stars opacity-10 pointer-events-none" />
      <div className="relative pt-28 pb-24 px-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {avatar ? (
                <img src={avatar} alt="" className="h-12 w-12 rounded-2xl border border-white/15 object-cover shrink-0" />
              ) : (
                <div className="h-12 w-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-white/30" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-semibold tracking-tight">{profile?.name?.split(" ")[0] || "Developer"}'s dashboard</h1>
                <p className="text-xs text-white/35 mt-0.5 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" /> Active · Joined {joined}
                </p>
              </div>
            </div>
            <button onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-colors">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 p-1 rounded-2xl border border-white/8 bg-white/[0.02] w-fit">
            {TABS.map(({ key, label, Icon, badge }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                  tab === key ? "bg-white text-black" : "text-white/45 hover:text-white/70"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                {badge != null && (
                  <span className={`rounded-full text-[10px] px-1.5 py-0.5 ${tab === key ? "bg-black/15 text-black" : "bg-white/10 text-white/50"}`}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW TAB ── */}
          {tab === "overview" && (
            <div className="space-y-5">

              {/* Edit profile panel */}
              <AnimatePresence>
                {editing && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-7 space-y-4">
                    <h3 className="text-sm font-semibold">Edit profile</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { key: "name", label: "Full name", placeholder: "Your name" },
                        { key: "location", label: "Location", placeholder: "City, Country" },
                        { key: "github_url", label: "GitHub URL", placeholder: "https://github.com/you" },
                        { key: "portfolio_url", label: "Portfolio URL", placeholder: "https://your-site.com" },
                        { key: "avatar_url", label: "Avatar URL (leave blank to auto-detect from GitHub)", placeholder: "https://…/photo.jpg" },
                      ].map(({ key, label, placeholder }) => (
                        <div key={key} className={key === "avatar_url" ? "sm:col-span-2" : ""}>
                          <label className="text-[10px] uppercase tracking-wider text-white/35 mb-1.5 block">{label}</label>
                          <input value={form[key] || ""} onChange={(e) => setForm((f: any) => ({ ...f, [key]: e.target.value }))}
                            placeholder={placeholder}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors placeholder:text-white/20" />
                        </div>
                      ))}
                      <div className="sm:col-span-2">
                        <label className="text-[10px] uppercase tracking-wider text-white/35 mb-1.5 block">Bio</label>
                        <textarea value={form.bio || ""} onChange={(e) => setForm((f: any) => ({ ...f, bio: e.target.value }))} rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors resize-none" />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={saveProfile} disabled={saving}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-5 py-2 text-xs font-medium hover:bg-white/90 transition-colors disabled:opacity-50">
                        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />} Save
                      </button>
                      <button onClick={() => { setEditing(false); setForm(profile); }}
                        className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs hover:bg-white/10 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Profile card */}
              {!editing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-7">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    {avatar ? (
                      <img src={avatar} alt="" className="h-20 w-20 rounded-2xl border border-white/15 object-cover shrink-0" />
                    ) : (
                      <div className="h-20 w-20 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                        <User className="h-8 w-8 text-white/30" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-semibold tracking-tight">{profile.name}</h2>
                        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2.5 py-0.5">Active</span>
                      </div>
                      {profile.bio && <p className="mt-2 text-sm text-white/50 leading-relaxed max-w-lg">{profile.bio}</p>}
                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/35">
                        {profile.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{profile.location}</span>}
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Joined {joined}</span>
                        {profile.github_url && (
                          <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                            <Github className="h-3 w-3" />GitHub<ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                        {profile.portfolio_url && (
                          <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                            <Link2 className="h-3 w-3" />Portfolio<ExternalLink className="h-2.5 w-2.5" />
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
                      <button onClick={() => setEditing(true)}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs hover:bg-white/10 transition-colors">
                        <Edit3 className="h-3.5 w-3.5" /> Edit profile
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Active projects", value: acceptedCollabs.length || "—", Icon: Code2, color: "text-blue-400" },
                  { label: "Pending requests", value: pendingCollabs.length || "—", Icon: Clock, color: "text-amber-400" },
                  { label: "Blog posts", value: myPosts.length || "—", Icon: BookOpen, color: "text-violet-400" },
                  { label: "Network members", value: networkCount || "—", Icon: Users, color: "text-emerald-400" },
                ].map(({ label, value, Icon, color }) => (
                  <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                    <Icon className={`h-4 w-4 ${color} mb-3`} />
                    <div className="text-lg font-semibold">{value}</div>
                    <div className="text-[11px] text-white/30 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {/* Quick nav */}
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { to: "/team", Icon: Users, title: "Developer network", desc: "See who else is building with Synapex.", cta: "Explore" },
                  { to: "/projects", Icon: Briefcase, title: "Synapex portfolio", desc: "View all completed and shipped projects.", cta: "View all" },
                  { to: "/contact", Icon: MessageSquare, title: "Talk to the team", desc: "Questions, ideas or collaboration proposals.", cta: "Get in touch" },
                ].map(({ to, Icon, title, desc, cta }) => (
                  <Link key={to} to={to as any}
                    className="group rounded-2xl border border-white/8 bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-white/15 transition-all">
                    <Icon className="h-5 w-5 text-white/25 mb-3 group-hover:text-white/50 transition-colors" />
                    <h3 className="font-semibold text-sm">{title}</h3>
                    <p className="text-xs text-white/35 mt-1 leading-relaxed">{desc}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs text-white/30 group-hover:text-white/60 transition-colors">
                      {cta} <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── PROJECTS TAB ── */}
          {tab === "projects" && (
            <div className="space-y-6">

              {/* Apply success */}
              <AnimatePresence>
                {applySuccess && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-sm text-emerald-400 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0" /> Application submitted! The team will review your request.
                  </motion.div>
                )}
                {updateSuccess && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="rounded-2xl border border-blue-500/20 bg-blue-500/10 px-5 py-3 text-sm text-blue-400 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0" /> Update posted! The admin can see it.
                  </motion.div>
                )}
              </AnimatePresence>

              {/* My Active Projects */}
              {acceptedCollabs.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-emerald-400" /> My projects
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10px] px-2 py-0.5">{acceptedCollabs.length}</span>
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {acceptedCollabs.map((c, i) => {
                      const p = c.projects;
                      if (!p) return null;
                      const tech: string[] = Array.isArray(p.tech) ? p.tech : [];
                      const pid = p.id;
                      const panelOpen = updatePanel === pid;
                      return (
                        <motion.div key={c.id ?? i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                          className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-5 flex flex-col gap-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-emerald-400/60">{p.category}</span>
                              <h3 className="text-sm font-semibold mt-0.5">{p.title}</h3>
                              {p.description && <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>}
                            </div>
                            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10px] px-2 py-0.5 whitespace-nowrap shrink-0">Active</span>
                          </div>
                          {tech.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {tech.slice(0, 4).map((t: string) => (
                                <span key={t} className="rounded-full bg-white/5 border border-white/8 text-[10px] text-white/40 px-2 py-0.5">{t}</span>
                              ))}
                              {tech.length > 4 && <span className="text-[10px] text-white/25">+{tech.length - 4}</span>}
                            </div>
                          )}

                          {/* Post update panel */}
                          <AnimatePresence>
                            {panelOpen && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                <textarea value={updateText[pid] || ""}
                                  onChange={(e) => setUpdateText((t) => ({ ...t, [pid]: e.target.value }))}
                                  rows={3} placeholder="Share a progress update, blocker, or note for the team…"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:border-white/40 outline-none transition-colors resize-none placeholder:text-white/20 leading-relaxed" />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <div className="flex flex-wrap gap-2 items-center">
                            {!panelOpen ? (
                              <button onClick={() => setUpdatePanel(pid)}
                                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10 transition-colors">
                                <Megaphone className="h-3 w-3" /> Post update
                              </button>
                            ) : (
                              <>
                                <button onClick={() => postProjectUpdate(pid)} disabled={!updateText[pid]?.trim() || postingUpdate === pid}
                                  className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-4 py-2 text-xs font-medium hover:bg-white/90 transition-colors disabled:opacity-40">
                                  {postingUpdate === pid ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                                  {postingUpdate === pid ? "Posting…" : "Post update"}
                                </button>
                                <button onClick={() => setUpdatePanel(null)}
                                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/40 hover:text-white transition-colors">
                                  <XCircle className="h-3 w-3" /> Cancel
                                </button>
                              </>
                            )}
                            <div className="flex gap-2 ml-auto">
                              {p.github_url && (
                                <a href={p.github_url} target="_blank" rel="noopener noreferrer"
                                  className="h-7 w-7 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors" title="Repo">
                                  <Github className="h-3.5 w-3.5 text-white/40" />
                                </a>
                              )}
                              {p.live_url && p.live_url !== "#" && (
                                <a href={p.live_url} target="_blank" rel="noopener noreferrer"
                                  className="h-7 w-7 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors" title="Live">
                                  <Globe className="h-3.5 w-3.5 text-white/40" />
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pending applications */}
              {pendingCollabs.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-400" /> Pending applications
                    <span className="rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 text-[10px] px-2 py-0.5">{pendingCollabs.length}</span>
                  </h2>
                  <div className="space-y-2">
                    {pendingCollabs.map((c, i) => {
                      const p = c.projects;
                      return (
                        <div key={c.id ?? i} className="rounded-2xl border border-amber-500/15 bg-amber-500/5 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium">{p?.title || "Project"}</p>
                            {p?.category && <p className="text-xs text-white/35 mt-0.5">{p.category}</p>}
                            {c.message && <p className="text-xs text-white/30 mt-1 italic">"{c.message}"</p>}
                          </div>
                          <span className="text-[11px] text-amber-400 flex items-center gap-1 shrink-0">
                            <Clock className="h-3 w-3" /> Awaiting review
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Open projects */}
              {openProjects.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-blue-400" /> Open to contributors
                    <span className="rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-400 text-[10px] px-2 py-0.5">{openProjects.length}</span>
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {openProjects.map((p, i) => {
                      const tech: string[] = Array.isArray(p.tech) ? p.tech : [];
                      const panelOpen = applyPanel === p.id;
                      return (
                        <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                          className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col gap-3">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[10px] uppercase tracking-wider text-white/30">{p.category}</span>
                                <h3 className="text-sm font-semibold mt-0.5">{p.title}</h3>
                              </div>
                              <span className="rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 shrink-0">Open</span>
                            </div>
                            {p.description && <p className="text-xs text-white/40 mt-2 line-clamp-3 leading-relaxed">{p.description}</p>}
                          </div>
                          {tech.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {tech.slice(0, 5).map((t: string) => (
                                <span key={t} className="rounded-full bg-white/5 border border-white/8 text-[10px] text-white/40 px-2 py-0.5">{t}</span>
                              ))}
                            </div>
                          )}
                          <AnimatePresence>
                            {panelOpen && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                <textarea value={applyMsg[p.id] || ""}
                                  onChange={(e) => setApplyMsg((m) => ({ ...m, [p.id]: e.target.value }))}
                                  rows={3} placeholder="Why do you want to join? What can you contribute?"
                                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:border-white/40 outline-none transition-colors resize-none placeholder:text-white/20 leading-relaxed" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <div className="flex flex-wrap gap-2 items-center">
                            {!panelOpen ? (
                              <button onClick={() => setApplyPanel(p.id)}
                                className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-4 py-2 text-xs font-medium hover:bg-white/90 transition-colors">
                                <Send className="h-3 w-3" /> Apply to join
                              </button>
                            ) : (
                              <>
                                <button onClick={() => applyToProject(p.id)} disabled={applying === p.id}
                                  className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-4 py-2 text-xs font-medium hover:bg-white/90 transition-colors disabled:opacity-50">
                                  {applying === p.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                                  {applying === p.id ? "Sending…" : "Submit"}
                                </button>
                                <button onClick={() => setApplyPanel(null)}
                                  className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/40 hover:text-white transition-colors">
                                  <XCircle className="h-3 w-3" /> Cancel
                                </button>
                              </>
                            )}
                            <div className="flex gap-2 ml-auto">
                              {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="h-7 w-7 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"><Github className="h-3.5 w-3.5 text-white/40" /></a>}
                              {p.live_url && p.live_url !== "#" && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="h-7 w-7 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"><Globe className="h-3.5 w-3.5 text-white/40" /></a>}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty */}
              {acceptedCollabs.length === 0 && pendingCollabs.length === 0 && openProjects.length === 0 && (
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-10 text-center">
                  <FolderOpen className="h-8 w-8 text-white/15 mx-auto mb-3" />
                  <p className="text-sm text-white/40 font-medium">No open projects right now</p>
                  <p className="text-xs text-white/25 mt-1 max-w-xs mx-auto leading-relaxed">The admin will post open projects here when they're looking for contributors.</p>
                </div>
              )}

              {/* Declined */}
              {rejectedCollabs.length > 0 && (
                <div className="space-y-2">
                  <h2 className="text-xs uppercase tracking-wider text-white/25 flex items-center gap-2"><XCircle className="h-3.5 w-3.5" /> Not selected</h2>
                  {rejectedCollabs.map((c, i) => (
                    <div key={c.id ?? i} className="rounded-xl border border-white/5 bg-white/[0.01] px-4 py-3 flex items-center justify-between opacity-50">
                      <p className="text-xs text-white/40">{c.projects?.title || "Project"}</p>
                      <span className="text-[11px] text-white/25">Not selected</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── MY POSTS TAB ── */}
          {tab === "blog" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-violet-400" /> My blog posts
                </h2>
                <button onClick={() => setTab("write")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-4 py-2 text-xs font-medium hover:bg-white/90 transition-colors">
                  <PenLine className="h-3.5 w-3.5" /> Write new post
                </button>
              </div>
              {myPosts.length === 0 ? (
                <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-10 text-center">
                  <PenLine className="h-8 w-8 text-white/15 mx-auto mb-3" />
                  <p className="text-sm text-white/40 font-medium">No posts yet</p>
                  <p className="text-xs text-white/25 mt-1">Write your first post — the admin will review and publish it.</p>
                  <button onClick={() => setTab("write")} className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 px-5 py-2 text-xs text-white/50 hover:text-white transition-colors">
                    <Plus className="h-3.5 w-3.5" /> Write a post
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {myPosts.map((post) => (
                    <div key={post.id} className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{post.title}</p>
                        {post.summary && <p className="text-xs text-white/35 mt-0.5 truncate">{post.summary}</p>}
                        <p className="text-[11px] text-white/25 mt-1">{new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                      </div>
                      <div className="shrink-0">
                        {post.published ? (
                          <span className="rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10px] px-2.5 py-1 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" /> Published
                          </span>
                        ) : post.pending_approval ? (
                          <span className="rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 text-[10px] px-2.5 py-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Pending review
                          </span>
                        ) : (
                          <span className="rounded-full bg-white/5 border border-white/10 text-white/30 text-[10px] px-2.5 py-1">Draft</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── WRITE TAB ── */}
          {tab === "write" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <button onClick={() => setTab("blog")} className="text-xs text-white/35 hover:text-white transition-colors flex items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5 rotate-180" /> Back to posts
                </button>
                <h2 className="text-sm font-semibold flex items-center gap-2"><PenLine className="h-4 w-4 text-violet-400" /> Write a blog post</h2>
              </div>

              <AnimatePresence>
                {blogSuccess && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-sm text-emerald-400 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0" /> Post submitted for review! Once the admin approves it, it'll appear on the blog.
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-7 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider text-white/35 mb-1.5 block">Title *</label>
                    <input value={blogForm.title} onChange={(e) => setBlogForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="Your post title…"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors placeholder:text-white/20" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/35 mb-1.5 block">Category</label>
                    <input value={blogForm.category} onChange={(e) => setBlogForm((f) => ({ ...f, category: e.target.value }))}
                      placeholder="e.g. Engineering, Design, Tutorial…"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors placeholder:text-white/20" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/35 mb-1.5 block">Cover image URL</label>
                    <input value={blogForm.image_url} onChange={(e) => setBlogForm((f) => ({ ...f, image_url: e.target.value }))}
                      placeholder="https://…/cover.jpg"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors placeholder:text-white/20" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider text-white/35 mb-1.5 block">Summary (short excerpt shown in listings)</label>
                    <textarea value={blogForm.summary} onChange={(e) => setBlogForm((f) => ({ ...f, summary: e.target.value }))}
                      rows={2} placeholder="A one or two sentence summary of the post…"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors resize-none placeholder:text-white/20" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider text-white/35 mb-1.5 block">Content * (markdown supported)</label>
                    <textarea value={blogForm.content} onChange={(e) => setBlogForm((f) => ({ ...f, content: e.target.value }))}
                      rows={16} placeholder={"# Your heading\n\nWrite your post here…\n\nMarkdown is supported."}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors resize-y font-mono leading-relaxed placeholder:text-white/20" />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-white/8">
                  <button onClick={submitBlogPost} disabled={blogSaving || !blogForm.title.trim() || !blogForm.content.trim()}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-5 py-2 text-xs font-medium hover:bg-white/90 transition-colors disabled:opacity-40">
                    {blogSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    {blogSaving ? "Submitting…" : "Submit for review"}
                  </button>
                  <p className="text-[11px] text-white/30 leading-relaxed">
                    The admin will review your post and publish it to the blog. You'll see it under "My posts" once submitted.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </SiteLayout>
  );
}

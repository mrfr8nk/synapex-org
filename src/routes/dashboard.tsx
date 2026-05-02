import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github, Globe, User, MapPin, LogOut, Edit3, CheckCircle,
  Loader2, ExternalLink, Calendar, Star, Zap, Users, ArrowUpRight,
  Link2, Send, Clock, XCircle, Briefcase, ChevronRight,
  FolderOpen, MessageSquare, Code2,
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

  const [openProjects, setOpenProjects] = useState<any[]>([]);
  const [myCollabs, setMyCollabs] = useState<any[]>([]);
  const [networkCount, setNetworkCount] = useState<number>(0);
  const [applying, setApplying] = useState<string | null>(null);
  const [applyMsg, setApplyMsg] = useState<Record<string, string>>({});
  const [applyPanel, setApplyPanel] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);

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
      const [profileRes, openRes, collabRes, countRes] = await Promise.all([
        supabase.from("developer_profiles" as any).select("*").eq("user_id", user.id).single(),
        supabase.from("projects" as any).select("*").eq("is_open", true).eq("visible", true).order("sort_order", { ascending: true }),
        supabase.from("project_collaborators" as any)
          .select("*, projects(id,title,category,description,tech,live_url,github_url,image_url)")
          .eq("user_id", user.id),
        supabase.from("developer_profiles" as any).select("id", { count: "exact", head: true }),
      ]);

      if (!profileRes.data) { nav({ to: "/join" }); return; }
      setProfile(profileRes.data);
      setForm(profileRes.data);

      const myProjectIds = new Set((collabRes.data || []).map((c: any) => c.project_id));
      setOpenProjects((openRes.data || []).filter((p: any) => !myProjectIds.has(p.id)));
      setMyCollabs(collabRes.data || []);
      setNetworkCount((countRes as any).count ?? 0);
    } catch {
      nav({ to: "/join" });
    }
    setLoading(false);
  }

  async function saveProfile() {
    setSaving(true);
    try {
      await supabase.from("developer_profiles" as any)
        .update({
          name: form.name,
          bio: form.bio,
          location: form.location,
          github_url: form.github_url,
          portfolio_url: form.portfolio_url,
          skills: form.skills,
        })
        .eq("user_id", session.user.id);
      setProfile(form);
      setEditing(false);
    } catch {}
    setSaving(false);
  }

  async function applyToProject(projectId: string) {
    if (!session) return;
    setApplying(projectId);
    try {
      const { error } = await supabase.from("project_collaborators" as any).insert({
        project_id: projectId,
        user_id: session.user.id,
        developer_name: profile.name,
        developer_email: session.user.email,
        message: applyMsg[projectId] || null,
        status: "pending",
      });
      if (!error) {
        const applied = openProjects.find((p) => p.id === projectId);
        setOpenProjects((prev) => prev.filter((p) => p.id !== projectId));
        if (applied) {
          setMyCollabs((prev) => [
            ...prev,
            { project_id: projectId, status: "pending", projects: applied, message: applyMsg[projectId] },
          ]);
        }
        setApplyPanel(null);
        setApplySuccess(projectId);
        setTimeout(() => setApplySuccess(null), 3500);
      }
    } catch {}
    setApplying(null);
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

  const avatar = profile?.avatar_url || session?.user?.user_metadata?.avatar_url;
  const joined = profile?.joined_at
    ? new Date(profile.joined_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";
  const skills: string[] = Array.isArray(profile?.skills) ? profile.skills : [];
  const acceptedCollabs = myCollabs.filter((c) => c.status === "accepted");
  const pendingCollabs = myCollabs.filter((c) => c.status === "pending");
  const rejectedCollabs = myCollabs.filter((c) => c.status === "rejected");

  return (
    <SiteLayout>
      <div className="absolute inset-0 stars opacity-10 pointer-events-none" />
      <div className="relative pt-28 pb-24 px-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Page header */}
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
                <h1 className="text-xl font-semibold tracking-tight">
                  {profile?.name?.split(" ")[0] || "Developer"}'s dashboard
                </h1>
                <p className="text-xs text-white/35 mt-0.5 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                  Active member · Joined {joined}
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
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

          {/* Edit profile panel */}
          <AnimatePresence>
            {editing && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-7 space-y-4"
              >
                <h3 className="text-sm font-semibold">Edit profile</h3>
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
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider text-white/35 mb-1.5 block">Bio</label>
                    <textarea
                      value={form.bio || ""}
                      onChange={(e) => setForm((f: any) => ({ ...f, bio: e.target.value }))}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors resize-none"
                    />
                  </div>
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Profile card */}
          {!editing && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-7"
            >
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
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2.5 py-0.5">
                      Active
                    </span>
                  </div>
                  {profile.bio && (
                    <p className="mt-2 text-sm text-white/50 leading-relaxed max-w-lg">{profile.bio}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/35">
                    {profile.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {profile.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Joined {joined}
                    </span>
                    {profile.github_url && (
                      <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-white transition-colors">
                        <Github className="h-3 w-3" /> GitHub <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                    {profile.portfolio_url && (
                      <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-white transition-colors">
                        <Link2 className="h-3 w-3" /> Portfolio <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>
                  {skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {skills.map((s) => (
                        <span key={s} className="rounded-full bg-white/5 border border-white/10 text-white/50 text-[11px] px-2.5 py-1">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Active projects", value: acceptedCollabs.length || "—", Icon: Code2, color: "text-blue-400" },
              { label: "Pending requests", value: pendingCollabs.length || "—", Icon: Clock, color: "text-amber-400" },
              { label: "Skill badges", value: skills.length || "—", Icon: Star, color: "text-violet-400" },
              { label: "Network members", value: networkCount || "—", Icon: Users, color: "text-emerald-400" },
            ].map(({ label, value, Icon, color }) => (
              <div key={label} className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                <Icon className={`h-4 w-4 ${color} mb-3`} />
                <div className="text-lg font-semibold">{value}</div>
                <div className="text-[11px] text-white/30 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Apply success toast */}
          <AnimatePresence>
            {applySuccess && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-sm text-emerald-400 flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4 shrink-0" />
                Application submitted! The team will review your request shortly.
              </motion.div>
            )}
          </AnimatePresence>

          {/* My Active Projects */}
          {acceptedCollabs.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <FolderOpen className="h-4 w-4 text-emerald-400" />
                My projects
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10px] px-2 py-0.5">
                  {acceptedCollabs.length}
                </span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {acceptedCollabs.map((c, i) => {
                  const p = c.projects;
                  if (!p) return null;
                  const tech: string[] = Array.isArray(p.tech) ? p.tech : [];
                  return (
                    <motion.div
                      key={c.id ?? i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-5 flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-emerald-400/60">{p.category}</span>
                          <h3 className="text-sm font-semibold mt-0.5">{p.title}</h3>
                          {p.description && (
                            <p className="text-xs text-white/40 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                          )}
                        </div>
                        <span className="rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10px] px-2 py-0.5 whitespace-nowrap shrink-0">
                          Active
                        </span>
                      </div>
                      {tech.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {tech.slice(0, 4).map((t: string) => (
                            <span key={t} className="rounded-full bg-white/5 border border-white/8 text-[10px] text-white/40 px-2 py-0.5">
                              {t}
                            </span>
                          ))}
                          {tech.length > 4 && <span className="text-[10px] text-white/25">+{tech.length - 4}</span>}
                        </div>
                      )}
                      <div className="flex gap-3">
                        {p.github_url && (
                          <a href={p.github_url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-white/35 hover:text-white transition-colors">
                            <Github className="h-3 w-3" /> Repo
                          </a>
                        )}
                        {p.live_url && p.live_url !== "#" && (
                          <a href={p.live_url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-white/35 hover:text-white transition-colors">
                            <Globe className="h-3 w-3" /> Live
                          </a>
                        )}
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
                <Clock className="h-4 w-4 text-amber-400" />
                Pending applications
                <span className="rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 text-[10px] px-2 py-0.5">
                  {pendingCollabs.length}
                </span>
              </h2>
              <div className="space-y-2">
                {pendingCollabs.map((c, i) => {
                  const p = c.projects;
                  return (
                    <div
                      key={c.id ?? i}
                      className="rounded-2xl border border-amber-500/15 bg-amber-500/5 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
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

          {/* Open projects to apply to */}
          {openProjects.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-400" />
                Open to contributors
                <span className="rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-400 text-[10px] px-2 py-0.5">
                  {openProjects.length}
                </span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {openProjects.map((p, i) => {
                  const tech: string[] = Array.isArray(p.tech) ? p.tech : [];
                  const isApplying = applying === p.id;
                  const panelOpen = applyPanel === p.id;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col gap-3"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-white/30">{p.category}</span>
                            <h3 className="text-sm font-semibold mt-0.5">{p.title}</h3>
                          </div>
                          <span className="rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 whitespace-nowrap shrink-0">
                            Open
                          </span>
                        </div>
                        {p.description && (
                          <p className="text-xs text-white/40 mt-2 line-clamp-3 leading-relaxed">{p.description}</p>
                        )}
                      </div>
                      {tech.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {tech.slice(0, 5).map((t: string) => (
                            <span key={t} className="rounded-full bg-white/5 border border-white/8 text-[10px] text-white/40 px-2 py-0.5">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      <AnimatePresence>
                        {panelOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <textarea
                              value={applyMsg[p.id] || ""}
                              onChange={(e) => setApplyMsg((m) => ({ ...m, [p.id]: e.target.value }))}
                              rows={3}
                              placeholder="Tell us why you'd like to join and what you can contribute..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:border-white/40 outline-none transition-colors resize-none placeholder:text-white/20 leading-relaxed"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex flex-wrap gap-2 items-center">
                        {!panelOpen ? (
                          <button
                            onClick={() => setApplyPanel(p.id)}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-4 py-2 text-xs font-medium hover:bg-white/90 transition-colors"
                          >
                            <Send className="h-3 w-3" /> Apply to join
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => applyToProject(p.id)}
                              disabled={isApplying}
                              className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-4 py-2 text-xs font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
                            >
                              {isApplying
                                ? <Loader2 className="h-3 w-3 animate-spin" />
                                : <CheckCircle className="h-3 w-3" />}
                              {isApplying ? "Sending…" : "Submit application"}
                            </button>
                            <button
                              onClick={() => setApplyPanel(null)}
                              className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/40 hover:text-white transition-colors"
                            >
                              <XCircle className="h-3 w-3" /> Cancel
                            </button>
                          </>
                        )}
                        <div className="flex gap-2 ml-auto">
                          {p.github_url && (
                            <a href={p.github_url} target="_blank" rel="noopener noreferrer"
                              className="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors" title="View repo">
                              <Github className="h-3.5 w-3.5 text-white/40" />
                            </a>
                          )}
                          {p.live_url && p.live_url !== "#" && (
                            <a href={p.live_url} target="_blank" rel="noopener noreferrer"
                              className="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors" title="View live">
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

          {/* Empty state */}
          {openProjects.length === 0 && acceptedCollabs.length === 0 && pendingCollabs.length === 0 && (
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-10 text-center">
              <FolderOpen className="h-8 w-8 text-white/15 mx-auto mb-3" />
              <p className="text-sm text-white/40 font-medium">No open projects right now</p>
              <p className="text-xs text-white/25 mt-1 max-w-xs mx-auto leading-relaxed">
                The admin will post projects here when they're looking for contributors. Check back soon.
              </p>
            </div>
          )}

          {/* Declined applications */}
          {rejectedCollabs.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-xs uppercase tracking-wider text-white/25 flex items-center gap-2">
                <XCircle className="h-3.5 w-3.5" /> Not selected
              </h2>
              {rejectedCollabs.map((c, i) => (
                <div key={c.id ?? i} className="rounded-xl border border-white/5 bg-white/[0.01] px-4 py-3 flex items-center justify-between opacity-50">
                  <p className="text-xs text-white/40">{c.projects?.title || "Project"}</p>
                  <span className="text-[11px] text-white/25">Not selected</span>
                </div>
              ))}
            </div>
          )}

          {/* Quick links */}
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            {[
              {
                to: "/team",
                Icon: Users,
                title: "Developer network",
                desc: "See who else is building with Synapex.",
                cta: "Explore",
              },
              {
                to: "/projects",
                Icon: Briefcase,
                title: "Synapex portfolio",
                desc: "View all completed and shipped projects.",
                cta: "View all",
              },
              {
                to: "/contact",
                Icon: MessageSquare,
                title: "Talk to the team",
                desc: "Questions, ideas or collaboration proposals.",
                cta: "Get in touch",
              },
            ].map(({ to, Icon, title, desc, cta }) => (
              <Link
                key={to}
                to={to as any}
                className="group rounded-2xl border border-white/8 bg-white/[0.02] p-5 hover:bg-white/[0.04] hover:border-white/15 transition-all"
              >
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
      </div>
    </SiteLayout>
  );
}

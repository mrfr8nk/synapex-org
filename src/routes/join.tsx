import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FadeIn } from "@/components/FadeIn";
import {
  Github, Globe, Code2, Users, Zap, Star,
  ArrowRight, CheckCircle, User, MapPin, Link2, FileText, Loader2, Mail,
} from "lucide-react";

export const Route = createFileRoute("/join")({
  component: JoinPage,
});

const PERKS = [
  { Icon: Code2, title: "Real projects", desc: "Work on live products used by real users worldwide." },
  { Icon: Users, title: "Global network", desc: "Connect with developers across 50+ countries, all ages 13+." },
  { Icon: Zap, title: "Skill growth", desc: "Mentorship, code reviews, and engineering culture to sharpen your craft." },
  { Icon: Star, title: "Portfolio credit", desc: "Your work is attributed. Build a verified portfolio that speaks for itself." },
];

const SKILLS_OPTIONS = [
  "React", "Next.js", "TypeScript", "Node.js", "Python", "Django",
  "React Native", "Swift", "Kotlin", "Flutter", "UI/UX Design",
  "Figma", "PostgreSQL", "MongoDB", "Firebase", "Supabase",
  "Docker", "AWS", "AI/ML", "GraphQL", "Go", "Rust",
];

function JoinPage() {
  const nav = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [magicEmail, setMagicEmail] = useState("");
  const [magicSending, setMagicSending] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [magicError, setMagicError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", bio: "", location: "", github_url: "", portfolio_url: "", skills: [] as string[],
  });

  useEffect(() => {
    // Show URL flash messages from magic-link redirect
    const url = new URL(window.location.href);
    const m = url.searchParams.get("magic");
    if (m === "invalid") setMagicError("That link is invalid or already used. Request a new one.");
    if (m === "missing") setMagicError("Missing token in link.");
    if (m === "error") setMagicError("Something went wrong. Try again.");

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadProfile(data.session.user);
      else setCheckingAuth(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s) loadProfile(s.user);
      else { setProfile(null); setCheckingAuth(false); }
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function loadProfile(user: any) {
    try {
      const { data } = await supabase.from("developer_profiles" as any)
        .select("*").eq("user_id", user.id).maybeSingle();
      if (data) {
        const meta = user.user_metadata || {};
        const freshAvatar = meta.avatar_url || meta.picture ||
          (meta.user_name ? `https://avatars.githubusercontent.com/${meta.user_name}` : "");
        if (freshAvatar && !data.avatar_url) {
          await supabase.from("developer_profiles" as any)
            .update({ avatar_url: freshAvatar })
            .eq("user_id", user.id);
          data.avatar_url = freshAvatar;
        }
        setProfile(data);
        nav({ to: "/dashboard" });
      } else {
        const meta = user.user_metadata || {};
        setForm((f) => ({
          ...f,
          name: meta.full_name || meta.name || meta.login || user.email?.split("@")[0] || "",
          github_url: meta.user_name ? `https://github.com/${meta.user_name}` : "",
        }));
      }
    } catch {}
    setCheckingAuth(false);
  }

  async function signInGoogle() {
    setOauthLoading("google");
    setMagicError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/join`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (error) {
      setMagicError("Google sign-in failed: " + error.message);
      setOauthLoading(null);
    }
  }

  async function signInGitHub() {
    setOauthLoading("github");
    setMagicError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/join`,
        scopes: "read:user user:email",
      },
    });
    if (error) {
      setMagicError("GitHub sign-in failed: " + error.message);
      setOauthLoading(null);
    }
  }

  async function sendMagic(e: React.FormEvent) {
    e.preventDefault();
    setMagicSending(true);
    setMagicError(null);
    try {
      const { error } = await supabase.functions.invoke("send-magic-link", {
        body: { email: magicEmail, origin: window.location.origin },
      });
      if (error) throw new Error(error.message || "Could not send email");
      setMagicSent(true);
    } catch (e: any) {
      setMagicError(e?.message || "Could not send email. Please try GitHub or Google instead.");
    }
    setMagicSending(false);
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!session) return;
    setSaving(true);
    try {
      const meta = session.user.user_metadata || {};
      const avatarUrl =
        meta.avatar_url ||
        meta.picture ||
        (meta.user_name ? `https://avatars.githubusercontent.com/${meta.user_name}` : "");
      const { error } = await supabase.from("developer_profiles" as any).upsert({
        user_id: session.user.id,
        name: form.name,
        bio: form.bio,
        location: form.location,
        github_url: form.github_url,
        portfolio_url: form.portfolio_url,
        skills: form.skills,
        avatar_url: avatarUrl,
        status: "active",
      }, { onConflict: "user_id" });
      if (!error) {
        setSaved(true);
        setTimeout(() => nav({ to: "/dashboard" }), 1000);
      }
    } catch {}
    setSaving(false);
  }

  function toggleSkill(skill: string) {
    setForm((f) => ({
      ...f,
      skills: f.skills.includes(skill) ? f.skills.filter((s) => s !== skill) : [...f.skills, skill],
    }));
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/30" />
      </div>
    );
  }

  return (
    <SiteLayout>
      <div className="absolute inset-0 stars opacity-20 pointer-events-none" />
      <div className="relative pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {!session && (
            <>
              <FadeIn direction="up">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-2 rounded-full glass border border-white/15 px-4 py-1.5 text-xs text-white/50 mb-6">
                    <Globe className="h-3 w-3" /> Open to developers 13+ worldwide
                  </div>
                  <h1 className="text-5xl md:text-6xl font-semibold tracking-[-0.04em] text-fade">
                    Join the Synapex<br />Developer Network.
                  </h1>
                  <p className="mt-5 text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
                    A global crew of engineers, designers and builders shipping real software. Any age, any country — your code is what matters.
                  </p>
                </div>
              </FadeIn>

              <div className="grid lg:grid-cols-2 gap-10 items-start">
                <FadeIn direction="left">
                  <div className="space-y-5">
                    {PERKS.map(({ Icon, title, desc }) => (
                      <div key={title} className="flex gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <Icon className="h-4 w-4 text-white/60" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{title}</h3>
                          <p className="text-sm text-white/45 mt-0.5 leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    ))}
                    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 mt-6">
                      <p className="text-xs text-white/40 leading-relaxed">
                        Already a member? <Link to="/dashboard" className="text-white/70 hover:text-white underline underline-offset-2">Go to your dashboard</Link>
                      </p>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn direction="right">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 space-y-4">
                    <h2 className="text-lg font-semibold tracking-tight">Create your account</h2>

                    {/* Google */}
                    <button
                      onClick={signInGoogle}
                      disabled={!!oauthLoading}
                      className="w-full flex items-center justify-center gap-3 rounded-2xl bg-white text-black py-3.5 text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
                    >
                      {oauthLoading === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      )}
                      Continue with Google
                    </button>

                    {/* GitHub */}
                    <button
                      onClick={signInGitHub}
                      disabled={!!oauthLoading}
                      className="w-full flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/5 py-3.5 text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                      {oauthLoading === "github" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
                      Continue with GitHub
                    </button>

                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                      <div className="relative flex justify-center"><span className="bg-black px-3 text-[10px] uppercase tracking-[0.2em] text-white/30">or email magic link</span></div>
                    </div>

                    {magicSent ? (
                      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
                        <CheckCircle className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                        <p className="text-sm font-medium">Check your inbox</p>
                        <p className="text-xs text-white/50 mt-1">We sent a sign-in link to {magicEmail}.</p>
                        <button onClick={() => { setMagicSent(false); setMagicEmail(""); }} className="mt-3 text-xs text-white/50 hover:text-white underline">Use a different email</button>
                      </div>
                    ) : (
                      <form onSubmit={sendMagic} className="space-y-3">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                          <input
                            type="email" required value={magicEmail}
                            onChange={(e) => setMagicEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-9 pr-3 py-3.5 text-sm focus:border-white/40 outline-none transition-colors placeholder:text-white/20"
                          />
                        </div>
                        <button
                          type="submit" disabled={magicSending || !magicEmail}
                          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 py-3.5 text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
                        >
                          {magicSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                          Send sign-in link
                        </button>
                      </form>
                    )}

                    {magicError && <p className="text-xs text-red-400 text-center">{magicError}</p>}

                    <p className="text-center text-[11px] text-white/30 leading-relaxed pt-2">
                      By joining you agree to our community guidelines.<br />
                      Open to anyone aged 13 and above, from any country.
                    </p>
                  </div>
                </FadeIn>
              </div>
            </>
          )}

          {session && !profile && (
            <div className="max-w-xl mx-auto">
              <FadeIn direction="up">
                <div className="text-center mb-10">
                  {session.user.user_metadata?.avatar_url && (
                    <img src={session.user.user_metadata.avatar_url} alt="" className="h-16 w-16 rounded-full border border-white/15 mx-auto mb-4 object-cover" />
                  )}
                  <h1 className="text-3xl font-semibold tracking-tight">Complete your profile</h1>
                  <p className="mt-2 text-white/45 text-sm">Tell the Synapex community about yourself.</p>
                </div>
              </FadeIn>

              <FadeIn direction="up" delay={0.05}>
                <form onSubmit={saveProfile} className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-white/40 flex items-center gap-1.5"><User className="h-3 w-3" /> Full name *</label>
                    <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:border-white/40 outline-none transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-white/40 flex items-center gap-1.5"><FileText className="h-3 w-3" /> Bio</label>
                    <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={3} placeholder="Tell us about yourself..." className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:border-white/40 outline-none transition-colors resize-none placeholder:text-white/20" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-[0.2em] text-white/40 flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Location</label>
                      <input value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder="City, Country" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:border-white/40 outline-none transition-colors placeholder:text-white/20" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-[0.2em] text-white/40 flex items-center gap-1.5"><Github className="h-3 w-3" /> GitHub URL</label>
                      <input value={form.github_url} onChange={(e) => setForm((f) => ({ ...f, github_url: e.target.value }))} placeholder="https://github.com/you" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:border-white/40 outline-none transition-colors placeholder:text-white/20" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-white/40 flex items-center gap-1.5"><Link2 className="h-3 w-3" /> Portfolio URL</label>
                    <input value={form.portfolio_url} onChange={(e) => setForm((f) => ({ ...f, portfolio_url: e.target.value }))} placeholder="https://your-portfolio.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm focus:border-white/40 outline-none transition-colors placeholder:text-white/20" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-white/40">Skills</label>
                    <div className="flex flex-wrap gap-2">
                      {SKILLS_OPTIONS.map((skill) => (
                        <button key={skill} type="button" onClick={() => toggleSkill(skill)} className={`rounded-full px-3 py-1.5 text-xs border transition-all ${form.skills.includes(skill) ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-white/50 hover:border-white/25 hover:text-white/75"}`}>{skill}</button>
                      ))}
                    </div>
                  </div>
                  <button type="submit" disabled={saving || saved || !form.name} className="w-full flex items-center justify-center gap-2 rounded-full bg-white text-black py-3 text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-60">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle className="h-4 w-4 text-emerald-600" /> : <ArrowRight className="h-4 w-4" />}
                    {saving ? "Saving..." : saved ? "Profile saved!" : "Join the network"}
                  </button>
                </form>
              </FadeIn>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

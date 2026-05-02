import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { Twitter, Linkedin, Github, MapPin, ExternalLink, Users } from "lucide-react";
import { SectionHeader } from "@/components/sections/Services";
import { useTeam } from "@/lib/useContent";
import { CTA } from "@/components/sections/CTA";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FadeIn } from "@/components/FadeIn";

export const Route = createFileRoute("/team")({
  component: TeamPage,
});

function TeamPage() {
  const team = useTeam();
  const [devs, setDevs] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("developer_profiles" as any)
      .select("*")
      .eq("status", "active")
      .order("joined_at", { ascending: false })
      .limit(24)
      .then(({ data }) => setDevs(data || []));
  }, []);

  return (
    <SiteLayout>
      <section className="pt-32 pb-12 px-6">
        <SectionHeader
          eyebrow="The team"
          title="People behind the pixels."
          subtitle="Engineers, designers and PMs obsessed with craft."
        />
      </section>

      {/* Core team */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m: any, i: number) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
              className="group rounded-2xl glass overflow-hidden hairline-hover transition-all"
            >
              <div className="aspect-[4/5] bg-black relative overflow-hidden">
                {m.image_url ? (
                  <img src={m.image_url} alt={m.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                ) : (
                  <div className="absolute inset-0 stars opacity-60 flex items-center justify-center">
                    <span className="text-7xl font-semibold text-white/10">{m.name[0]}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-lg font-semibold tracking-tight">{m.name}</h3>
                  <p className="text-xs text-white/60 mt-0.5">{m.role}</p>
                </div>
              </div>
              {(m.bio || m.twitter_url || m.linkedin_url || m.github_url) && (
                <div className="p-5">
                  {m.bio && <p className="text-xs text-white/50 leading-relaxed">{m.bio}</p>}
                  <div className="mt-4 flex gap-2">
                    {m.twitter_url && <a href={m.twitter_url} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full glass flex items-center justify-center hover:bg-white hover:text-black transition-colors"><Twitter className="h-3.5 w-3.5" /></a>}
                    {m.linkedin_url && <a href={m.linkedin_url} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full glass flex items-center justify-center hover:bg-white hover:text-black transition-colors"><Linkedin className="h-3.5 w-3.5" /></a>}
                    {m.github_url && <a href={m.github_url} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full glass flex items-center justify-center hover:bg-white hover:text-black transition-colors"><Github className="h-3.5 w-3.5" /></a>}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Developer network */}
      {devs.length > 0 && (
        <section className="px-6 pb-32">
          <div className="max-w-7xl mx-auto">
            <FadeIn direction="up">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-white/40 mb-3">
                    <span className="h-px w-6 bg-white/30" />
                    Developer network
                  </div>
                  <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-fade">
                    Our global community.
                  </h2>
                  <p className="mt-3 text-sm text-white/50 max-w-xl">
                    Developers who've joined the Synapex network — building, learning, and shipping together.
                  </p>
                </div>
                <Link to="/join"
                  className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                  <Users className="h-4 w-4" /> Join network
                </Link>
              </div>
            </FadeIn>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {devs.map((dev, i) => (
                <motion.div
                  key={dev.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 8) * 0.04 }}
                  className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 hover:border-white/15 hover:bg-white/[0.04] transition-all group"
                >
                  <div className="flex items-start gap-3">
                    {dev.avatar_url ? (
                      <img src={dev.avatar_url} alt={dev.name} className="h-11 w-11 rounded-xl object-cover border border-white/10 shrink-0" />
                    ) : (
                      <div className="h-11 w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-white/30">{(dev.name || "?")[0].toUpperCase()}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{dev.name || "Anonymous"}</div>
                      {dev.location && (
                        <div className="flex items-center gap-1 mt-0.5 text-[11px] text-white/35">
                          <MapPin className="h-2.5 w-2.5 shrink-0" />
                          <span className="truncate">{dev.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {dev.bio && (
                    <p className="mt-3 text-xs text-white/45 leading-relaxed line-clamp-2">{dev.bio}</p>
                  )}

                  {dev.skills && dev.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {dev.skills.slice(0, 3).map((s: string) => (
                        <span key={s} className="rounded-full bg-white/5 border border-white/8 text-[10px] text-white/40 px-2 py-0.5">{s}</span>
                      ))}
                      {dev.skills.length > 3 && (
                        <span className="text-[10px] text-white/25 self-center">+{dev.skills.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2 pt-3 border-t border-white/6">
                    {dev.github_url && (
                      <a href={dev.github_url} target="_blank" rel="noopener noreferrer"
                        className="h-7 w-7 rounded-full border border-white/8 flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 transition-colors">
                        <Github className="h-3 w-3" />
                      </a>
                    )}
                    {dev.portfolio_url && (
                      <a href={dev.portfolio_url} target="_blank" rel="noopener noreferrer"
                        className="h-7 w-7 rounded-full border border-white/8 flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 transition-colors">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {dev.joined_at && (
                      <span className="ml-auto text-[10px] text-white/20">
                        {new Date(dev.joined_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 text-center sm:hidden">
              <Link to="/join"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors">
                <Users className="h-4 w-4" /> Join the network
              </Link>
            </div>
          </div>
        </section>
      )}

      <CTA />
    </SiteLayout>
  );
}

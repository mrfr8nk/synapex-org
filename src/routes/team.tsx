import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { Twitter, Linkedin, Github } from "lucide-react";
import { SectionHeader } from "@/components/sections/Services";
import { useTeam } from "@/lib/useContent";
import { CTA } from "@/components/sections/CTA";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — Synapex Developers" },
      { name: "description", content: "Meet the engineers, designers and PMs at Synapex." },
      { property: "og:title", content: "Synapex Team" },
      { property: "og:description", content: "The people behind the products." },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  const team = useTeam();
  return (
    <SiteLayout>
      <section className="pt-32 pb-12 px-6">
        <SectionHeader eyebrow="The team" title="People behind the pixels." subtitle="Engineers, designers and PMs obsessed with craft." />
      </section>
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
      <CTA />
    </SiteLayout>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { MapPin, Briefcase, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/sections/Services";
import { FadeIn } from "@/components/FadeIn";
import { CTA } from "@/components/sections/CTA";
import { fallbackCareers } from "@/lib/content";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Synapex Developers" },
      { name: "description", content: "Join the Synapex team. We're hiring engineers, designers and product people who want to build things that matter." },
    ],
  }),
  component: CareersPage,
});

const typeColors: Record<string, string> = {
  "Full-time": "from-emerald-500/20 to-teal-600/20",
  "Contract": "from-blue-500/20 to-indigo-600/20",
  "Part-time": "from-violet-500/20 to-purple-600/20",
  "Internship": "from-orange-500/20 to-amber-600/20",
};

function CareersPage() {
  const openJobs = fallbackCareers.filter((j: any) => j.open);

  return (
    <SiteLayout>
      <section className="relative pt-32 pb-12 px-6 overflow-hidden">
        <div className="absolute inset-0 stars opacity-40" />
        <div className="absolute inset-0 spotlight" />
        <div className="relative max-w-7xl mx-auto">
          <FadeIn direction="up">
            <SectionHeader
              eyebrow="We're hiring"
              title="Join the team."
              subtitle="We're a small, ambitious team building software that powers businesses across the continent and beyond."
            />
          </FadeIn>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-5 mb-16 md:grid-cols-3">
            {[
              { label: "Remote first", sub: "Work from anywhere" },
              { label: "Equity available", sub: "For senior roles" },
              { label: "Global team", sub: "Across 4 continents" },
            ].map((item, i) => (
              <FadeIn key={item.label} direction="up" delay={i * 0.06}>
                <div className="rounded-2xl glass p-6 text-center">
                  <div className="text-base font-semibold">{item.label}</div>
                  <div className="text-sm text-white/50 mt-1">{item.sub}</div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn direction="up" className="mb-8">
            <h3 className="text-xl font-semibold tracking-tight">
              Open positions
              <span className="ml-3 text-sm font-normal text-white/40">({openJobs.length} roles)</span>
            </h3>
          </FadeIn>

          {openJobs.length === 0 ? (
            <FadeIn direction="up">
              <div className="text-center py-16 rounded-3xl glass text-white/40">
                <p>No open positions right now.</p>
                <p className="text-sm mt-1">Send a speculative application to <span className="text-white/70">careers@synapex.dev</span></p>
              </div>
            </FadeIn>
          ) : (
            <div className="space-y-4">
              {openJobs.map((job: any, i: number) => {
                const gradient = typeColors[job.type] || "from-white/10 to-white/5";
                return (
                  <FadeIn key={job.id} direction={i % 2 === 0 ? "left" : "right"} delay={i * 0.06}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.25 }}
                      className="group rounded-2xl glass p-6 md:p-8 hover:bg-white/[0.04] transition-all duration-500"
                    >
                      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
                      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span className="text-[10px] uppercase tracking-[0.2em] rounded-full glass px-3 py-1 text-white/60">
                              {job.type}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-white/40">
                              <MapPin className="h-3 w-3" /> {job.location}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-white/40">
                              <Briefcase className="h-3 w-3" /> {job.department}
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold tracking-tight">{job.title}</h4>
                          <p className="mt-1.5 text-sm text-white/50 max-w-xl leading-relaxed">{job.description}</p>
                          {job.salary_range && (
                            <p className="mt-2 text-xs text-white/40">{job.salary_range}</p>
                          )}
                        </div>
                        <a
                          href={`mailto:careers@synapex.dev?subject=Application: ${job.title}`}
                          className="inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm whitespace-nowrap hover:bg-white hover:text-black transition-all duration-300 shrink-0"
                        >
                          Apply now <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </motion.div>
                  </FadeIn>
                );
              })}
            </div>
          )}

          <FadeIn direction="up" delay={0.3} className="mt-14 text-center rounded-3xl glass p-10">
            <p className="text-lg font-medium tracking-tight">Don't see your role?</p>
            <p className="mt-2 text-sm text-white/50">Send us a speculative application. We're always looking for exceptional people.</p>
            <a
              href="mailto:careers@synapex.dev"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors"
            >
              careers@synapex.dev →
            </a>
          </FadeIn>
        </div>
      </section>
      <CTA />
    </SiteLayout>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/sections/Services";
import { Target, Eye, Heart, Zap } from "lucide-react";
import { CTA } from "@/components/sections/CTA";
import { useSiteContent } from "@/lib/useContent";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Synapex Developers" },
      { name: "description", content: "Young developers from Africa building world-class software with global craftsmanship." },
      { property: "og:title", content: "About Synapex Developers" },
      { property: "og:description", content: "Our story, mission and values." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Target, title: "Mission", desc: "Empower businesses with intelligent, beautiful software." },
  { icon: Eye, title: "Vision", desc: "Become Africa's leading export of world-class digital products." },
  { icon: Heart, title: "Values", desc: "Craft, honesty, curiosity, and customer obsession." },
  { icon: Zap, title: "Energy", desc: "Young, fast, ambitious — every project treated like our own." },
];

const timeline = [
  { year: "2022", title: "The spark", desc: "Two friends started building bots and websites for local businesses." },
  { year: "2023", title: "Going pro", desc: "Synapex was born. First SaaS shipped. First international client." },
  { year: "2024", title: "AI era", desc: "Pivoted into AI integration. Launched ChatPilot and NeuroDash." },
  { year: "2025", title: "Global team", desc: "12 engineers, designers and PMs across 3 countries." },
];

function AboutPage() {
  const c = useSiteContent();
  return (
    <SiteLayout>
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 stars" />
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 spotlight" />
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1 text-[11px] uppercase tracking-[0.2em] text-white/60 mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-glow-pulse" /> About us
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-semibold tracking-[-0.04em] leading-[0.95] text-fade"
          >
            {c.about_title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 text-lg text-white/60 max-w-2xl mx-auto leading-relaxed"
          >
            {c.about_body}
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid gap-px overflow-hidden rounded-3xl glass sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="bg-black/40 backdrop-blur-xl p-8 hover:bg-white/[0.04] transition-colors"
            >
              <v.icon className="h-6 w-6" />
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{v.title}</h3>
              <p className="mt-2 text-sm text-white/50 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6">
        <SectionHeader
          eyebrow="Our journey"
          title="From garage to global."
          subtitle="A short story of how we got here."
        />
        <div className="mt-20 max-w-3xl mx-auto relative">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-white/40 via-white/10 to-transparent" />
          {timeline.map((t, i) => (
            <motion.div
              key={t.year}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative pl-14 pb-12"
            >
              <div className="absolute left-0 h-9 w-9 rounded-full glass-strong flex items-center justify-center text-xs font-semibold">
                0{i + 1}
              </div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-white/40 font-mono">{t.year}</div>
              <h3 className="mt-1 text-xl font-semibold tracking-tight">{t.title}</h3>
              <p className="mt-2 text-white/50">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <CTA />
    </SiteLayout>
  );
}

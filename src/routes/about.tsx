import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { SectionHeader } from "@/components/sections/Services";
import { Target, Eye, Heart, Zap } from "lucide-react";
import { CTA } from "@/components/sections/CTA";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Synapex Developers" },
      { name: "description", content: "Young developers from Africa building world-class software with global mindset and craftsmanship." },
      { property: "og:title", content: "About Synapex Developers" },
      { property: "og:description", content: "Our story, mission and values." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Target, title: "Mission", desc: "Empower businesses and creators with intelligent, beautiful software." },
  { icon: Eye, title: "Vision", desc: "Become Africa's leading export of world-class digital products." },
  { icon: Heart, title: "Values", desc: "Craft, honesty, curiosity, and relentless customer obsession." },
  { icon: Zap, title: "Energy", desc: "Young, fast, ambitious — we treat every project like our own startup." },
];

const timeline = [
  { year: "2022", title: "The spark", desc: "Two friends started building bots and websites for local businesses." },
  { year: "2023", title: "Going pro", desc: "Synapex was born. First SaaS shipped. First international client." },
  { year: "2024", title: "AI era", desc: "Pivoted into AI integration. Launched ChatPilot and NeuroDash." },
  { year: "2025", title: "Global team", desc: "12 engineers, designers and PMs across 3 countries." },
];

function AboutPage() {
  return (
    <SiteLayout>
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="absolute inset-0 bg-grid" />
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter"
          >
            Young developers. <br />
            <span className="text-gradient">World-class craft.</span>
          </motion.h1>
          <p className="mt-8 text-lg text-muted-foreground max-w-2xl mx-auto">
            Synapex Developers is a software studio born in Africa with a global mindset. We build
            premium digital products for ambitious teams who refuse to settle for mediocre software.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl glass p-6 hover:shadow-glow transition-shadow">
              <v.icon className="h-7 w-7 text-cyan" />
              <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6">
        <SectionHeader
          tag="Our journey"
          title={<>From garage to <span className="text-gradient">global</span></>}
          subtitle="A short story of how we got here — and where we're heading."
        />
        <div className="mt-16 max-w-3xl mx-auto relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-purple" />
          {timeline.map((t, i) => (
            <motion.div
              key={t.year}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative pl-14 pb-10"
            >
              <div className="absolute left-0 h-9 w-9 rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center text-xs font-bold shadow-glow">
                {i + 1}
              </div>
              <div className="text-xs text-cyan font-mono">{t.year}</div>
              <h3 className="mt-1 text-xl font-semibold">{t.title}</h3>
              <p className="mt-2 text-muted-foreground">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <CTA />
    </SiteLayout>
  );
}

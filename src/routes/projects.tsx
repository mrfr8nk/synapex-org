import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Projects } from "@/components/sections/Projects";
import { Clients } from "@/components/sections/Clients";
import { CTA } from "@/components/sections/CTA";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects & Portfolio | Synapex Technologies" },
      { name: "description", content: "Explore projects built by Synapex Developers — websites, mobile apps, AI systems and SaaS platforms." },
      { property: "og:title", content: "Projects & Portfolio | Synapex Technologies" },
      { property: "og:description", content: "Explore projects built by Synapex Developers — websites, mobile apps, AI systems and SaaS platforms." },
      { property: "og:url", content: "https://synapex.co.zw/projects" },
      { name: "twitter:title", content: "Projects & Portfolio | Synapex Technologies" },
      { name: "twitter:description", content: "Explore projects built by Synapex Developers — websites, mobile apps, AI systems and SaaS platforms." },
    ],
    links: [{ rel: "canonical", href: "https://synapex.co.zw/projects" }],
  }),
  component: () => (
    <SiteLayout>
      <section className="pt-32 pb-8 px-6 text-center max-w-4xl mx-auto relative">
        <div className="absolute inset-0 stars opacity-50" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1 text-[11px] uppercase tracking-[0.2em] text-white/60 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-glow-pulse" /> Selected work
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-[-0.04em] leading-[0.95] text-fade">
            Work we're proud of.
          </h1>
        </div>
      </section>
      <Projects />
      <Clients />
      <CTA />
    </SiteLayout>
  ),
});

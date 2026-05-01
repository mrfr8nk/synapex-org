import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Projects } from "@/components/sections/Projects";
import { CTA } from "@/components/sections/CTA";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Synapex Developers" },
      { name: "description", content: "Selected work from Synapex Developers — SaaS, AI, mobile and web." },
      { property: "og:title", content: "Synapex Projects" },
      { property: "og:description", content: "Real products we've designed and shipped." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <section className="pt-16 pb-4 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
          Work we're <span className="text-gradient">proud to ship</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          A snapshot of recent projects, products and platforms.
        </p>
      </section>
      <Projects />
      <CTA />
    </SiteLayout>
  ),
});

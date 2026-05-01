import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Services } from "@/components/sections/Services";
import { Technologies } from "@/components/sections/Technologies";
import { CTA } from "@/components/sections/CTA";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Synapex Developers" },
      { name: "description", content: "Web, mobile, AI, SaaS, automation, design and cloud — full-stack software services." },
      { property: "og:title", content: "Synapex Services" },
      { property: "og:description", content: "End-to-end software solutions for ambitious teams." },
    ],
  }),
  component: () => (
    <SiteLayout>
      <section className="pt-16 pb-4 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
          Everything you need to <span className="text-gradient">ship great software</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Pick a service or combine a few — we deliver as one team.
        </p>
      </section>
      <Services />
      <Technologies />
      <CTA />
    </SiteLayout>
  ),
});

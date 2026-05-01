import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Services } from "@/components/sections/Services";
import { Technologies } from "@/components/sections/Technologies";
import { CTA } from "@/components/sections/CTA";

export const Route = createFileRoute("/services")({
  component: () => (
    <SiteLayout>
      <section className="pt-32 pb-8 px-6 text-center max-w-4xl mx-auto relative">
        <div className="absolute inset-0 stars opacity-50" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1 text-[11px] uppercase tracking-[0.2em] text-white/60 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-glow-pulse" /> Services
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-[-0.04em] leading-[0.95] text-fade">
            Everything you need to ship.
          </h1>
          <p className="mt-6 text-lg text-white/60">
            Pick a service or combine a few — we deliver as one team.
          </p>
        </div>
      </section>
      <Services />
      <Technologies />
      <CTA />
    </SiteLayout>
  ),
});

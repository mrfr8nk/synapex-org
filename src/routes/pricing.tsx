import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SectionHeader } from "@/components/sections/Services";
import { usePricing } from "@/lib/useContent";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Synapex Developers" },
      { name: "description", content: "Transparent pricing for websites, apps, AI and custom software." },
      { property: "og:title", content: "Synapex Pricing" },
      { property: "og:description", content: "Plans that fit startups, businesses and enterprises." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  const plans = usePricing();
  return (
    <SiteLayout>
      <section className="pt-32 pb-12 px-6">
        <SectionHeader
          eyebrow="Pricing"
          title="Simple plans, serious value."
          subtitle="Project-based pricing with no hidden fees."
        />
      </section>

      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto grid gap-5 md:grid-cols-3">
          {plans.map((p: any, i: number) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`relative rounded-3xl p-8 transition-all hover:-translate-y-1 ${
                p.is_popular
                  ? "glass-strong shadow-[0_0_60px_rgba(255,255,255,0.05)]"
                  : "glass"
              }`}
            >
              {p.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white text-black px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em]">
                  Most popular
                </div>
              )}
              <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-white/60">{p.name}</h3>
              <div className="mt-5 text-5xl font-semibold tracking-[-0.03em] text-fade">
                {p.price}
              </div>
              <p className="mt-3 text-sm text-white/50">{p.description}</p>
              <ul className="mt-8 space-y-3">
                {(p.features || []).map((f: string) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-white mt-0.5 shrink-0" />
                    <span className="text-white/80">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={`mt-8 block text-center rounded-full py-3 text-sm font-medium transition-all ${
                  p.is_popular
                    ? "bg-white text-black hover:bg-white/90"
                    : "glass hover:bg-white/10"
                }`}
              >
                Get started
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

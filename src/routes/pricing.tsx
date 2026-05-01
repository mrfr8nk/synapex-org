import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SectionHeader } from "@/components/sections/Services";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Synapex Developers" },
      { name: "description", content: "Transparent pricing for websites, apps, AI and custom software projects." },
      { property: "og:title", content: "Synapex Pricing" },
      { property: "og:description", content: "Plans that fit startups, businesses and enterprises." },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Starter",
    price: "$499",
    desc: "For founders launching their first MVP.",
    features: ["Landing page or 1-page app", "Mobile responsive", "Basic SEO", "1 round of revisions", "2-week delivery"],
    popular: false,
  },
  {
    name: "Professional",
    price: "$2,499",
    desc: "For growing businesses ready to scale.",
    features: ["Multi-page web or mobile app", "Custom design system", "Auth + Database", "AI integration ready", "3 rounds of revisions", "60 days support"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Let's talk",
    desc: "For ambitious platforms & SaaS products.",
    features: ["Full SaaS / platform build", "Custom AI models", "Dedicated team", "DevOps & infra", "SLA & priority support", "Long-term partnership"],
    popular: false,
  },
];

function PricingPage() {
  return (
    <SiteLayout>
      <section className="pt-16 pb-8 px-6">
        <SectionHeader
          tag="Pricing"
          title={<>Simple plans, <span className="text-gradient">serious value</span></>}
          subtitle="Project-based pricing with no hidden fees. Custom quotes available."
        />
      </section>

      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
          {plans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 ${
                p.popular
                  ? "glass glow-border shadow-glow-strong scale-[1.02]"
                  : "glass"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-medium text-white bg-gradient-to-r from-primary via-accent to-purple animate-gradient">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-semibold">{p.name}</h3>
              <div className="mt-4 text-5xl font-bold tracking-tight">
                {p.price.startsWith("$") ? (
                  <span className="text-gradient">{p.price}</span>
                ) : p.price}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{p.desc}</p>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-cyan mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={`mt-8 block text-center rounded-xl py-3 text-sm font-medium transition-all ${
                  p.popular
                    ? "bg-gradient-to-r from-primary via-accent to-purple text-white animate-gradient shadow-glow"
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

import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FadeIn } from "@/components/FadeIn";
import { Star, Zap, Crown, Heart, ArrowUpRight, Building2, Globe } from "lucide-react";

const tiers = [
  {
    name: "Community",
    price: "$50",
    period: "/month",
    Icon: Heart,
    color: "from-emerald-500/20 to-teal-600/15",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
    perks: [
      "Logo in footer (website)",
      "Shoutout on social media",
      "Community sponsor badge",
      "Access to dev network events",
    ],
  },
  {
    name: "Growth",
    price: "$200",
    period: "/month",
    Icon: Zap,
    color: "from-blue-500/25 to-indigo-600/20",
    border: "border-blue-500/25",
    iconColor: "text-blue-400",
    popular: true,
    perks: [
      "Everything in Community",
      "Logo on homepage & footer",
      "Featured blog post about your brand",
      "Early access to developer talent",
      "Quarterly impact report",
    ],
  },
  {
    name: "Enterprise",
    price: "$1,000",
    period: "/month",
    Icon: Crown,
    color: "from-amber-500/20 to-orange-600/15",
    border: "border-amber-500/20",
    iconColor: "text-amber-400",
    perks: [
      "Everything in Growth",
      "Dedicated sponsor page on site",
      "Co-branded project opportunity",
      "Priority access to Synapex engineers",
      "Speaking slot at developer events",
      "Custom integration partnership",
    ],
  },
];

const currentSponsors = [
  { name: "Your Company", tier: "Gold", placeholder: true },
  { name: "Your Brand", tier: "Silver", placeholder: true },
  { name: "Your Logo", tier: "Bronze", placeholder: true },
];

export function Sponsors() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 stars opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <FadeIn direction="up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full glass border border-amber-500/25 px-4 py-1.5 text-xs text-amber-400/80 mb-6">
              <Star className="h-3 w-3 fill-amber-400/60" />
              Become a sponsor
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-fade">
              Power the next generation<br />of engineers.
            </h2>
            <p className="mt-5 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              Synapex is an open network of developers from 13 to above, building world-class software across the globe.
              Your sponsorship directly funds talented young engineers, open-source projects, and community events.
            </p>
          </div>
        </FadeIn>

        {/* Current sponsors placeholder */}
        <FadeIn direction="up" delay={0.05}>
          <div className="mb-14 text-center">
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/25 mb-5">Our sponsors</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {currentSponsors.map((s, i) => (
                <div
                  key={i}
                  className="h-12 px-6 rounded-2xl border border-white/8 bg-white/[0.03] flex items-center justify-center"
                >
                  <span className="text-sm text-white/25 font-medium">{s.name}</span>
                </div>
              ))}
              <Link
                to="/contact"
                className="h-12 px-6 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] flex items-center justify-center gap-2 text-sm text-white/30 hover:text-white/60 hover:border-white/25 transition-all"
              >
                <span>+ Your brand here</span>
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* Tiers */}
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier, i) => (
            <FadeIn key={tier.name} direction="up" delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                className={`relative rounded-3xl border bg-gradient-to-br ${tier.color} ${tier.border} p-7 flex flex-col h-full`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-blue-500 text-white text-[10px] font-semibold px-3 py-1 whitespace-nowrap">
                      Most popular
                    </span>
                  </div>
                )}

                <div className={`h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 ${tier.iconColor}`}>
                  <tier.Icon className="h-5 w-5" />
                </div>

                <h3 className="text-lg font-semibold tracking-tight">{tier.name}</h3>
                <div className="mt-1 flex items-end gap-1">
                  <span className="text-3xl font-bold tracking-tight">{tier.price}</span>
                  <span className="text-sm text-white/40 mb-1">{tier.period}</span>
                </div>

                <ul className="mt-6 space-y-3 flex-1">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5 text-sm text-white/65">
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${tier.iconColor} border-current`}>
                        <div className="h-1.5 w-1.5 rounded-full bg-current" />
                      </div>
                      {perk}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className="mt-7 inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium hover:bg-white/10 hover:border-white/30 transition-all"
                >
                  Become a sponsor <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        {/* Why sponsor */}
        <FadeIn direction="up" delay={0.2}>
          <div className="mt-16 rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-10 grid md:grid-cols-3 gap-8">
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Globe className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Global reach</h4>
                <p className="text-sm text-white/45 mt-1 leading-relaxed">Your brand reaches developers and tech decision-makers across 50+ countries.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Building2 className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Real impact</h4>
                <p className="text-sm text-white/45 mt-1 leading-relaxed">Sponsorships directly fund developer stipends, infrastructure, and open-source tools.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                <Star className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Talent pipeline</h4>
                <p className="text-sm text-white/45 mt-1 leading-relaxed">Get first access to hire from our network of vetted engineers before anyone else.</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

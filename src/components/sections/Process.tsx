import { motion } from "framer-motion";
import { SectionHeader } from "./Services";
import { FadeIn } from "@/components/FadeIn";
import { Search, Pencil, Code2, Rocket, Headphones } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discovery",
    description: "We spend the first week understanding your product, users and goals. No assumptions — just listening.",
    details: ["Stakeholder interviews", "Competitive analysis", "Technical audit", "Requirements mapping"],
    color: "from-blue-500/20 to-indigo-600/20",
  },
  {
    number: "02",
    icon: Pencil,
    title: "Design & Architecture",
    description: "Before writing code, we map the system. Data models, API contracts, deployment strategy — all defined upfront.",
    details: ["System architecture", "Database design", "UI wireframes", "Tech stack selection"],
    color: "from-violet-500/20 to-purple-600/20",
  },
  {
    number: "03",
    icon: Code2,
    title: "Build",
    description: "We ship in weekly sprints with live previews. You see real progress every week — never a black box.",
    details: ["Weekly deployments", "Daily standups", "Code reviews", "Automated testing"],
    color: "from-emerald-500/20 to-teal-600/20",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Launch",
    description: "We handle deployment, monitoring and performance — making sure your launch day is boring (in a good way).",
    details: ["Production deploy", "Performance audit", "SEO setup", "Analytics integration"],
    color: "from-orange-500/20 to-amber-600/20",
  },
  {
    number: "05",
    icon: Headphones,
    title: "Support",
    description: "Post-launch, we stay available. Bug fixes, feature additions and infrastructure questions — we're in your corner.",
    details: ["Bug fixes", "Feature additions", "Infrastructure support", "Monthly reporting"],
    color: "from-rose-500/20 to-pink-600/20",
  },
];

export function Process() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative max-w-7xl mx-auto">
        <FadeIn direction="up">
          <SectionHeader
            eyebrow="How we work"
            title="Our process."
            subtitle="Predictable, transparent and built around shipping great software — not just more features."
          />
        </FadeIn>

        <div className="mt-20 space-y-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isEven = i % 2 === 1;
            return (
              <FadeIn
                key={step.number}
                direction={isEven ? "right" : "left"}
                delay={i * 0.05}
              >
                <motion.div
                  whileHover={{ x: isEven ? -4 : 4 }}
                  transition={{ duration: 0.3 }}
                  className="group relative rounded-2xl glass overflow-hidden hover:bg-white/[0.04] transition-all duration-500"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                  <div className="relative grid md:grid-cols-[200px_1fr_auto] gap-6 p-8 items-center">
                    <div className="flex items-center gap-5">
                      <div className="text-5xl font-black tracking-tighter text-white/10 group-hover:text-white/20 transition-colors tabular-nums">
                        {step.number}
                      </div>
                      <div className="h-11 w-11 rounded-xl glass flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300 shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
                      <p className="mt-2 text-sm text-white/50 leading-relaxed max-w-lg">{step.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
                      {step.details.map((d) => (
                        <span key={d} className="text-[11px] px-2.5 py-1 rounded-full glass text-white/40 whitespace-nowrap">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { FadeIn } from "@/components/FadeIn";
import { CheckCircle, Zap, Shield, Globe, HeartHandshake, TrendingUp } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "Ship-speed engineering",
    description: "We move fast without cutting corners. Our sprint model delivers working software every week — not monthly demos.",
  },
  {
    icon: Shield,
    title: "Production-grade quality",
    description: "Code reviews, automated testing, security audits and performance profiling on every project — not optional extras.",
  },
  {
    icon: Globe,
    title: "African innovation, global standards",
    description: "We're headquartered in Zimbabwe but operate at international standards. We understand both local context and global markets.",
  },
  {
    icon: HeartHandshake,
    title: "Radical transparency",
    description: "No black boxes. You have GitHub access, weekly reports and a direct line to the engineer on your project.",
  },
  {
    icon: TrendingUp,
    title: "Built to scale",
    description: "We don't just build for today. Architecture decisions account for 10x growth so you never need a painful rewrite.",
  },
  {
    icon: CheckCircle,
    title: "You own everything",
    description: "Source code, designs, credentials — everything is transferred to you on completion. No vendor lock-in, ever.",
  },
];

export function WhyUs() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-white/[0.015] blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn direction="left">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-white/40 mb-5">
              <span className="h-px w-6 bg-white/30" />
              Why Synapex
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.05] text-fade">
              Why teams choose<br />Synapex.
            </h2>
            <p className="mt-6 text-base text-white/50 leading-relaxed max-w-lg">
              We've been on both sides — as engineers who shipped products, and as clients who hired agencies. We built Synapex to be the studio we always wished existed.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {["No hidden fees", "Weekly demos", "Full IP transfer", "On-time guarantee"].map((tag) => (
                <span key={tag} className="flex items-center gap-1.5 text-sm rounded-full glass px-4 py-2 text-white/70">
                  <CheckCircle className="h-3.5 w-3.5 text-white/50" /> {tag}
                </span>
              ))}
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reasons.map((r, i) => {
              const Icon = r.icon;
              return (
                <FadeIn key={r.title} direction={i % 2 === 0 ? "right" : "left"} delay={i * 0.06}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.25 }}
                    className="group rounded-2xl glass p-5 hover:bg-white/[0.05] transition-all duration-500"
                  >
                    <div className="h-9 w-9 rounded-xl glass flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300 mb-4">
                      <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
                    </div>
                    <h4 className="text-sm font-semibold tracking-tight">{r.title}</h4>
                    <p className="mt-1.5 text-xs text-white/50 leading-relaxed">{r.description}</p>
                  </motion.div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

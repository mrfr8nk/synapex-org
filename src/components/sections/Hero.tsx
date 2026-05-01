import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSiteContent } from "@/lib/useContent";
import { useEffect, useRef } from "react";

function AnimatedNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const numericMatch = value.match(/(\d+)/);
  const numeric = numericMatch ? parseInt(numericMatch[1]) : null;
  const prefix = numeric !== null ? value.slice(0, numericMatch!.index) : "";
  const suffix = numeric !== null ? value.slice((numericMatch!.index ?? 0) + numericMatch![1].length) : "";

  useEffect(() => {
    if (!inView || numeric === null || !ref.current) return;
    const node = ref.current;
    const ctrl = animate(0, numeric, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = prefix + Math.round(v).toString() + suffix;
      },
    });
    return () => ctrl.stop();
  }, [inView, numeric, prefix, suffix]);

  return (
    <span ref={ref}>
      {numeric !== null ? prefix + "0" + suffix : value}
    </span>
  );
}

export function Hero() {
  const c = useSiteContent();
  const stats = c.stats || [];

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 stars" />
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0 spotlight" />

      <div className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full bg-white/[0.03] blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-white/[0.02] blur-3xl animate-float [animation-delay:2s]" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 w-full">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1 text-[11px] uppercase tracking-[0.2em] text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-glow-pulse" />
            {c.hero_eyebrow}
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-center mx-auto max-w-5xl text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-semibold tracking-[-0.04em] leading-[0.95] text-fade"
        >
          {c.hero_title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 text-center text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed"
        >
          {c.hero_subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition-all hover:scale-[1.02]"
          >
            {c.hero_cta_primary}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 rounded-full glass hairline-hover px-6 py-3 text-sm font-medium hover:bg-white/10 transition-all"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            {c.hero_cta_secondary}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl glass max-w-4xl mx-auto"
        >
          {stats.map((s: any, i: number) => (
            <div key={i} className="bg-black/40 backdrop-blur-xl p-6 text-center">
              <div className="text-3xl md:text-4xl font-semibold tracking-tight text-fade">
                <AnimatedNumber value={s.value} />
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.15em] text-white/40">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/30"
      >
        <span>Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-6 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}

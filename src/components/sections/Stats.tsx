import { useRef, useEffect } from "react";
import { motion, useInView, animate } from "framer-motion";
import { FadeIn } from "@/components/FadeIn";

const metrics = [
  { value: 120, suffix: "+", label: "Projects shipped", detail: "Across web, mobile and AI" },
  { value: 80, suffix: "+", label: "Happy clients", detail: "Net promoter score 9.4/10" },
  { value: 4, suffix: " countries", label: "Active markets", detail: "Zimbabwe · SA · UK · USA" },
  { value: 99, suffix: "%", label: "On-time delivery", detail: "Since 2022" },
  { value: 12, suffix: "", label: "Engineers on staff", detail: "All senior level" },
  { value: 24, suffix: "/7", label: "Support hours", detail: "Enterprise clients" },
];

function MetricCard({ value, suffix, label, detail, delay }: typeof metrics[0] & { delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const ctrl = animate(0, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => { node.textContent = Math.round(v).toString(); },
    });
    return () => ctrl.stop();
  }, [inView, value]);

  return (
    <FadeIn direction="up" delay={delay}>
      <div className="group rounded-2xl glass p-8 text-center hover:bg-white/[0.06] transition-all duration-500 hairline-hover">
        <div className="text-4xl md:text-5xl font-black tracking-tight text-fade tabular-nums">
          <span ref={ref}>0</span>{suffix}
        </div>
        <div className="mt-2 text-base font-semibold tracking-tight">{label}</div>
        <div className="mt-1 text-xs text-white/40">{detail}</div>
      </div>
    </FadeIn>
  );
}

export function Stats() {
  return (
    <section className="relative py-24 px-6">
      <div className="absolute inset-0 spotlight opacity-50" />
      <div className="relative max-w-7xl mx-auto">
        <FadeIn direction="up" className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-white/40 mb-4">
            <span className="h-px w-6 bg-white/30" />
            By the numbers
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-[-0.03em] text-fade">
            Results, not rhetoric.
          </h2>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {metrics.map((m, i) => (
            <MetricCard key={m.label} {...m} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}

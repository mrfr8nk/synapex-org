import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { iconMap } from "@/lib/content";
import { useServices } from "@/lib/useContent";

export function SectionHeader({
  eyebrow, title, subtitle, align = "center",
}: { eyebrow: string; title: React.ReactNode; subtitle?: string; align?: "center" | "left" }) {
  const cls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`max-w-3xl ${cls}`}
    >
      <div className={`inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-white/40`}>
        <span className="h-px w-6 bg-white/30" />
        {eyebrow}
      </div>
      <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1] text-fade">
        {title}
      </h2>
      {subtitle && <p className="mt-5 text-base md:text-lg text-white/50 leading-relaxed">{subtitle}</p>}
    </motion.div>
  );
}

export function Services() {
  const services = useServices();
  const router = useRouterState();
  const onServicesPage = router.location.pathname === "/services";

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="What we do"
          title="Software, end to end."
          subtitle="From a vague idea to a polished system in production."
        />

        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s: any, i: number) => {
            const Icon = iconMap[s.icon] ?? iconMap.Code2;
            const card = (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.07 }}
                className="group relative rounded-2xl glass p-8 hover:bg-white/[0.06] transition-all duration-500 border-b-2 border-white/5 hover:border-white/20 flex flex-col h-full"
              >
                <div className="flex items-start justify-between">
                  <div className="h-11 w-11 rounded-xl glass flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-white/30 group-hover:text-white group-hover:rotate-45 transition-all duration-300" />
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm text-white/50 leading-relaxed flex-1">{s.description}</p>
                <div className="mt-6 pt-5 border-t border-white/8">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-white/30 group-hover:text-white/60 transition-colors flex items-center gap-1">
                    Learn more <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </motion.div>
            );

            return onServicesPage ? (
              <div key={s.id}>{card}</div>
            ) : (
              <Link key={s.id} to="/services" className="block">
                {card}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

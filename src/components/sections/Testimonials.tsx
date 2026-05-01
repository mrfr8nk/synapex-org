import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SectionHeader } from "./Services";
import { useTestimonials } from "@/lib/useContent";

export function Testimonials() {
  const items = useTestimonials();

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Loved by founders"
          title="What clients say."
          subtitle="Words from real teams we've shipped real products with."
        />
        <div className="mt-20 grid gap-5 md:grid-cols-2">
          {items.map((t: any, i: number) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-2xl glass p-8 relative hairline-hover transition-all hover:-translate-y-0.5"
            >
              <Quote className="h-7 w-7 text-white/15 mb-4" />
              <p className="text-lg leading-relaxed font-light">"{t.quote}"</p>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {t.avatar_url ? (
                    <img src={t.avatar_url} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-full glass-strong flex items-center justify-center text-sm font-semibold">
                      {t.name[0]}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-white/40">{t.role}</div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-white text-white" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

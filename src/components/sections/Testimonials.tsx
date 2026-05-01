import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionHeader } from "./Services";

const items = [
  { name: "Tariro M.", role: "Founder, EduFlow", text: "Synapex shipped our school platform in weeks, not months. The quality is unreal.", rating: 5 },
  { name: "Daniel K.", role: "CTO, Pulse Commerce", text: "Cleanest codebase we've ever inherited. The team is sharp, fast and obsessed with details.", rating: 5 },
  { name: "Aisha R.", role: "PM, NeuroDash", text: "They turned a vague AI idea into a product our users love. Worth every cent.", rating: 5 },
  { name: "Brian T.", role: "Owner, Vaultify", text: "Beautiful design, smooth animations, and a mobile app that actually feels native.", rating: 5 },
];

export function Testimonials() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          tag="Loved by founders"
          title={<>What clients <span className="text-gradient">say about us</span></>}
          subtitle="Real words from real teams we've shipped real products with."
        />
        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {items.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="rounded-2xl glass p-7 relative overflow-hidden"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-cyan text-cyan" />
                ))}
              </div>
              <p className="text-base md:text-lg leading-relaxed">"{t.text}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center font-semibold">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

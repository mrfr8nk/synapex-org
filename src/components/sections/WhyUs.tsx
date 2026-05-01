import { motion } from "framer-motion";
import { Rocket, Code, Users, Sparkles, Shield, HeartHandshake } from "lucide-react";
import { SectionHeader } from "./Services";

const reasons = [
  { icon: Rocket, title: "Fast Delivery", desc: "Sprints, daily updates and live previews. No waiting in the dark." },
  { icon: Code, title: "Clean, Scalable Code", desc: "TypeScript, tests and architecture that grows with your business." },
  { icon: Sparkles, title: "AI-Powered", desc: "We bring intelligence into every product we ship." },
  { icon: Shield, title: "Secure by Default", desc: "Best-practice auth, encryption and compliance baked in." },
  { icon: Users, title: "Cross-Platform", desc: "Web, mobile and backend — one team, one vision." },
  { icon: HeartHandshake, title: "Real Support", desc: "We stay long after launch. Your success is our portfolio." },
];

export function WhyUs() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          tag="Why Synapex"
          title={<>Built for <span className="text-gradient">ambitious teams</span></>}
          subtitle="Six reasons founders, schools and agencies choose us over the rest."
        />
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="rounded-2xl glass p-6 hover:shadow-glow transition-shadow"
            >
              <r.icon className="h-7 w-7 text-cyan" />
              <h3 className="mt-4 text-lg font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

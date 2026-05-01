import { motion } from "framer-motion";
import {
  Code2, Smartphone, Brain, Palette, Cloud, Bot,
  GraduationCap, Plug, Layers, Zap,
} from "lucide-react";

const services = [
  { icon: Code2, title: "Web Development", desc: "Blazing-fast, SEO-ready sites built with Next.js, React & TypeScript." },
  { icon: Smartphone, title: "Mobile Apps", desc: "Native-feel iOS & Android apps with React Native and Flutter." },
  { icon: Brain, title: "AI Integration", desc: "GPT-4, Claude & custom models embedded into your product." },
  { icon: Palette, title: "UI / UX Design", desc: "Premium interfaces, design systems and motion that convert." },
  { icon: Layers, title: "SaaS Platforms", desc: "Multi-tenant, scalable platforms with auth, billing & analytics." },
  { icon: Bot, title: "WhatsApp Bots", desc: "Automated customer flows on the world's biggest messenger." },
  { icon: Cloud, title: "Cloud Solutions", desc: "Cloudflare, AWS & Vercel deployments engineered for scale." },
  { icon: Zap, title: "Automation", desc: "Workflows, integrations & internal tools that save hours weekly." },
  { icon: GraduationCap, title: "School Systems", desc: "Modern management platforms for schools and institutions." },
  { icon: Plug, title: "API Development", desc: "Robust REST & GraphQL APIs with documentation & SDKs." },
];

export function Services() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          tag="What we do"
          title={<>Software solutions, <span className="text-gradient">end to end</span></>}
          subtitle="From idea to intelligent system — we ship products people love to use."
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="group relative rounded-2xl glass p-6 overflow-hidden hover:-translate-y-1 transition-transform"
            >
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/0 group-hover:bg-primary/30 blur-3xl transition-colors duration-500" />
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple/20 border border-white/10 flex items-center justify-center group-hover:shadow-glow transition-shadow">
                  <s.icon className="h-6 w-6 text-cyan" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  tag, title, subtitle,
}: { tag: string; title: React.ReactNode; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-3xl mx-auto"
    >
      <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
        {tag}
      </div>
      <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
        {title}
      </h2>
      <p className="mt-5 text-base md:text-lg text-muted-foreground">{subtitle}</p>
    </motion.div>
  );
}

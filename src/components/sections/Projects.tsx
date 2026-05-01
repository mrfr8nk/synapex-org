import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "./Services";

const projects = [
  { title: "NeuroDash", cat: "SaaS", desc: "AI-powered analytics dashboard with realtime insights.", tags: ["Next.js", "OpenAI", "PostgreSQL"], grad: "from-primary to-purple" },
  { title: "EduFlow", cat: "School System", desc: "Complete school management platform for 50+ institutions.", tags: ["React", "Node", "MongoDB"], grad: "from-cyan to-primary" },
  { title: "ChatPilot", cat: "AI Bot", desc: "WhatsApp + Web AI assistant handling thousands of chats daily.", tags: ["Python", "Twilio", "GPT-4"], grad: "from-purple to-accent" },
  { title: "Vaultify", cat: "Mobile App", desc: "Personal finance tracker with bank-grade security.", tags: ["React Native", "Firebase"], grad: "from-accent to-cyan" },
  { title: "Pulse Commerce", cat: "Web", desc: "Headless e-commerce storefront with 99 Lighthouse score.", tags: ["Next.js", "Stripe"], grad: "from-cyan to-purple" },
  { title: "Lumen API", cat: "API", desc: "Image generation API serving 1M+ requests per month.", tags: ["FastAPI", "Docker"], grad: "from-primary to-cyan" },
];

export function Projects() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          tag="Selected work"
          title={<>Projects we're <span className="text-gradient">proud of</span></>}
          subtitle="A glimpse of products we've designed, engineered and shipped."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <motion.a
              key={p.title}
              href="#"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative rounded-2xl overflow-hidden glass hover:-translate-y-1 transition-transform"
            >
              <div className={`relative h-48 bg-gradient-to-br ${p.grad} overflow-hidden`}>
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold text-white/20 tracking-tighter">
                    {p.title}
                  </span>
                </div>
                <div className="absolute top-4 left-4 rounded-full glass px-3 py-1 text-xs">
                  {p.cat}
                </div>
                <div className="absolute top-4 right-4 h-9 w-9 rounded-full glass flex items-center justify-center group-hover:rotate-45 transition-transform">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="text-xs px-2 py-1 rounded-md bg-white/5 text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

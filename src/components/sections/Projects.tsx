import { motion } from "framer-motion";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import { SectionHeader } from "./Services";
import { useProjects } from "@/lib/useContent";

const categoryGradients: Record<string, string> = {
  "SaaS": "from-blue-600/40 via-purple-600/30 to-indigo-900/50",
  "School System": "from-emerald-600/40 via-teal-600/30 to-cyan-900/50",
  "AI Bot": "from-cyan-600/40 via-blue-500/30 to-violet-900/50",
  "Mobile": "from-orange-500/40 via-pink-600/30 to-rose-900/50",
  "Web": "from-green-500/40 via-lime-600/30 to-emerald-900/50",
  "API": "from-violet-600/40 via-purple-500/30 to-pink-900/50",
};

const techIconSlugs: Record<string, string> = {
  "React": "react", "Next.js": "nextdotjs", "TypeScript": "typescript",
  "Node": "nodedotjs", "Node.js": "nodedotjs", "Python": "python",
  "Firebase": "firebase", "MongoDB": "mongodb", "PostgreSQL": "postgresql",
  "Postgres": "postgresql", "Docker": "docker", "FastAPI": "fastapi",
  "OpenAI": "openai", "GPT-4": "openai", "Stripe": "stripe",
  "Twilio": "twilio", "TensorFlow": "tensorflow", "React Native": "react",
};

function ProjectTechBadge({ tech }: { tech: string }) {
  const slug = techIconSlugs[tech] || tech.toLowerCase().replace(/[^a-z0-9]/g, "");
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full glass text-white/70 hover:text-white hover:bg-white/10 transition-colors">
      <img
        src={`https://cdn.simpleicons.org/${slug}/ffffff`}
        alt=""
        className="h-3 w-3 object-contain opacity-70"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
      {tech}
    </span>
  );
}

export function Projects() {
  const projects = useProjects();

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Selected work"
          title="Things we've built."
          subtitle="A glimpse of recent products, platforms and experiments."
        />

        <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p: any, i: number) => {
            const gradient = categoryGradients[p.category] || "from-white/10 via-white/5 to-black/50";
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl glass overflow-hidden hairline-hover transition-all"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                  ) : (
                    <>
                      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-opacity duration-500`} />
                      <div className="absolute inset-0 stars opacity-30" />
                      <div className="absolute inset-0 grid-bg opacity-30" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl font-black tracking-tighter text-white/10 select-none">
                          {p.title?.charAt(0)}
                        </div>
                      </div>
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute top-4 left-4 rounded-full glass px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-white/80">
                    {p.category}
                  </div>
                  {(p.live_url || p.github_url) && (
                    <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {p.live_url && (
                        <a href={p.live_url} target="_blank" rel="noopener noreferrer"
                          className="h-8 w-8 rounded-full glass flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {p.github_url && (
                        <a href={p.github_url} target="_blank" rel="noopener noreferrer"
                          className="h-8 w-8 rounded-full glass flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                          <Github className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-semibold tracking-tight">{p.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-white/60 leading-relaxed">{p.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {(p.tech || []).map((t: string) => (
                      <ProjectTechBadge key={t} tech={t} />
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

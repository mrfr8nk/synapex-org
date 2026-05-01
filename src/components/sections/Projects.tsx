import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { SectionHeader } from "./Services";
import { useProjects } from "@/lib/useContent";

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

        <div className="mt-20 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p: any, i: number) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
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
                  <div className="absolute inset-0 stars opacity-50" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute top-4 left-4 rounded-full glass px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-white/80">
                  {p.category}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-semibold tracking-tight">{p.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-white/60 leading-relaxed">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(p.tech || []).map((t: string) => (
                    <span key={t} className="text-[11px] px-2 py-0.5 rounded-md glass text-white/60">
                      {t}
                    </span>
                  ))}
                </div>
                {(p.live_url || p.github_url) && (
                  <div className="mt-5 flex gap-2">
                    {p.live_url && (
                      <a href={p.live_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs glass px-3 py-1.5 rounded-full hover:bg-white hover:text-black transition-colors">
                        Live <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )}
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs glass px-3 py-1.5 rounded-full hover:bg-white hover:text-black transition-colors">
                        <Github className="h-3 w-3" /> Code
                      </a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

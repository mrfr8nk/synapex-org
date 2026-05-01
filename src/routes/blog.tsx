import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, User, Tag } from "lucide-react";
import { SectionHeader } from "@/components/sections/Services";
import { FadeIn } from "@/components/FadeIn";
import { useBlogPosts } from "@/lib/useContent";
import { useState } from "react";
import { CTA } from "@/components/sections/CTA";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Synapex Developers" },
      { name: "description", content: "Engineering insights, product stories and lessons from building software at Synapex." },
    ],
  }),
  component: BlogPage,
});

const categoryColors: Record<string, string> = {
  "Engineering": "from-blue-500/30 to-indigo-600/20",
  "AI": "from-cyan-500/30 to-blue-600/20",
  "Design": "from-violet-500/30 to-purple-600/20",
  "Business": "from-emerald-500/30 to-teal-600/20",
  "Mobile": "from-orange-500/30 to-amber-600/20",
};

function BlogPage() {
  const posts = useBlogPosts(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...Array.from(new Set(posts.map((p: any) => p.category).filter(Boolean)))];
  const filtered = activeCategory === "All" ? posts : posts.filter((p: any) => p.category === activeCategory);

  return (
    <SiteLayout>
      <section className="relative pt-32 pb-12 px-6 overflow-hidden">
        <div className="absolute inset-0 stars opacity-40" />
        <div className="absolute inset-0 spotlight" />
        <div className="relative max-w-7xl mx-auto">
          <FadeIn direction="up">
            <SectionHeader
              eyebrow="From the studio"
              title="Our writing."
              subtitle="Thoughts on software, design and building things people love."
            />
          </FadeIn>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <FadeIn direction="up" className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all duration-200 ${activeCategory === cat ? "bg-white text-black scale-105" : "glass hover:bg-white/10"}`}
              >
                {cat}
              </button>
            ))}
          </FadeIn>

          {filtered.length === 0 && (
            <div className="text-center py-24 text-white/40">No articles yet. Check back soon.</div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post: any, i: number) => {
              const gradient = categoryColors[post.category] || "from-white/10 to-white/5";
              return (
                <FadeIn key={post.id} direction="up" delay={i * 0.06}>
                  <Link to="/blog/$slug" params={{ slug: post.slug }}>
                    <motion.article
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="group relative rounded-2xl glass overflow-hidden hairline-hover h-full flex flex-col"
                    >
                      <div className={`relative aspect-[16/9] bg-gradient-to-br ${gradient} overflow-hidden`}>
                        {post.image_url ? (
                          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                        ) : (
                          <>
                            <div className="absolute inset-0 stars opacity-30" />
                            <div className="absolute inset-0 grid-bg opacity-20" />
                          </>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <Tag className="h-3 w-3 text-white/60" />
                          <span className="text-[11px] uppercase tracking-[0.15em] text-white/70">{post.category}</span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="text-lg font-semibold tracking-tight group-hover:text-white transition-colors leading-snug">{post.title}</h3>
                        <p className="mt-2 text-sm text-white/50 leading-relaxed flex-1">{post.summary}</p>
                        <div className="mt-5 pt-4 border-t border-white/8 flex items-center justify-between text-[11px] text-white/40">
                          <div className="flex items-center gap-3">
                            {post.author && <span className="flex items-center gap-1"><User className="h-3 w-3" />{post.author}</span>}
                            {post.created_at && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </span>
                            )}
                          </div>
                          <ArrowUpRight className="h-3.5 w-3.5 text-white/30 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>
      <CTA />
    </SiteLayout>
  );
}

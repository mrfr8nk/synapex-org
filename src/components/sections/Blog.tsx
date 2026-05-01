import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Calendar, User } from "lucide-react";
import { SectionHeader } from "./Services";
import { FadeIn } from "@/components/FadeIn";
import { useBlogPosts } from "@/lib/useContent";

const categoryColors: Record<string, string> = {
  "Engineering": "from-blue-500/30 to-indigo-600/20",
  "AI": "from-cyan-500/30 to-blue-600/20",
  "Design": "from-violet-500/30 to-purple-600/20",
  "Business": "from-emerald-500/30 to-teal-600/20",
  "Mobile": "from-orange-500/30 to-amber-600/20",
};

export function Blog() {
  const posts = useBlogPosts(true).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <FadeIn direction="left">
            <SectionHeader
              eyebrow="Latest writing"
              title="From the studio."
              subtitle="Thoughts on engineering, design and building products people love."
              align="left"
            />
          </FadeIn>
          <FadeIn direction="right">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 rounded-full glass hairline-hover px-5 py-2.5 text-sm hover:bg-white/10 transition-all mb-6 whitespace-nowrap"
            >
              All articles <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </FadeIn>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {posts.map((post: any, i: number) => {
            const gradient = categoryColors[post.category] || "from-white/10 to-white/5";
            return (
              <FadeIn key={post.id} direction="up" delay={i * 0.08}>
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
                      <div className="absolute top-4 left-4">
                        <span className="text-[11px] uppercase tracking-[0.2em] rounded-full glass px-3 py-1 text-white/80">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold tracking-tight group-hover:text-white transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/50 leading-relaxed flex-1">{post.summary}</p>
                      <div className="mt-5 pt-4 border-t border-white/8 flex items-center justify-between text-[11px] text-white/40">
                        <div className="flex items-center gap-3">
                          {post.author && (
                            <span className="flex items-center gap-1"><User className="h-3 w-3" />{post.author}</span>
                          )}
                          {post.created_at && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          )}
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 text-white/30 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
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
  );
}

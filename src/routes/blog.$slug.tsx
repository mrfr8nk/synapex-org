import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Tag, Twitter, Linkedin, Link2, Check } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { useBlogPost } from "@/lib/useContent";
import { useState } from "react";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
});

function renderContent(content: string) {
  const lines = content.split("\n");
  return lines.map((line, i) => {
    if (line.startsWith("## ")) return <h2 key={i} className="text-2xl font-semibold tracking-tight mt-10 mb-4">{line.slice(3)}</h2>;
    if (line.startsWith("# ")) return <h1 key={i} className="text-3xl font-semibold tracking-tight mt-10 mb-4">{line.slice(2)}</h1>;
    if (line.startsWith("### ")) return <h3 key={i} className="text-xl font-semibold tracking-tight mt-8 mb-3">{line.slice(4)}</h3>;
    if (line.startsWith("- ")) return <li key={i} className="ml-4 text-white/70 leading-relaxed">{line.slice(2)}</li>;
    if (line.startsWith("**") && line.endsWith("**")) return <strong key={i} className="font-semibold text-white">{line.slice(2, -2)}</strong>;
    if (line === "") return <div key={i} className="h-4" />;
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    if (parts.length > 1) {
      return (
        <p key={i} className="text-white/70 leading-relaxed">
          {parts.map((p, j) =>
            p.startsWith("**") && p.endsWith("**")
              ? <strong key={j} className="font-semibold text-white">{p.slice(2, -2)}</strong>
              : p
          )}
        </p>
      );
    }
    return <p key={i} className="text-white/70 leading-relaxed">{line}</p>;
  });
}

function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = window.location.href;
  const text = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const copy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[11px] uppercase tracking-[0.15em] text-white/30 mr-1">Share</span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full glass border border-white/10 px-3.5 py-2 text-xs text-white/60 hover:text-white hover:border-white/25 transition-all"
      >
        <Twitter className="h-3.5 w-3.5" /> Twitter
      </a>
      <a
        href={`https://linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full glass border border-white/10 px-3.5 py-2 text-xs text-white/60 hover:text-white hover:border-white/25 transition-all"
      >
        <Linkedin className="h-3.5 w-3.5" /> LinkedIn
      </a>
      <button
        onClick={copy}
        className="inline-flex items-center gap-1.5 rounded-full glass border border-white/10 px-3.5 py-2 text-xs text-white/60 hover:text-white hover:border-white/25 transition-all"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Link2 className="h-3.5 w-3.5" />}
        {copied ? "Copied!" : "Copy link"}
      </button>
    </div>
  );
}

function BlogPostPage() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const { post, loading } = useBlogPost(slug);

  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-white/40">Loading...</div>
        </div>
      </SiteLayout>
    );
  }

  if (!post) {
    return (
      <SiteLayout>
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
          <div className="text-7xl font-black text-fade mb-4">404</div>
          <h2 className="text-2xl font-semibold">Post not found</h2>
          <p className="mt-2 text-white/50">This article doesn't exist or was removed.</p>
          <Link to="/blog" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors">
            ← Back to blog
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="absolute inset-0 stars opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative pt-32 pb-24 px-6"
      >
        <div className="max-w-3xl mx-auto">
          <FadeIn direction="left">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8">
              <ArrowLeft className="h-4 w-4" /> Back to blog
            </Link>
          </FadeIn>

          <FadeIn direction="up">
            <div className="flex flex-wrap items-center gap-4 mb-6 text-[11px] text-white/40 uppercase tracking-wider">
              {post.category && (
                <span className="flex items-center gap-1.5 rounded-full glass px-3 py-1">
                  <Tag className="h-3 w-3" /> {post.category}
                </span>
              )}
              {post.author && (
                <span className="flex items-center gap-1.5">
                  <User className="h-3 w-3" /> {post.author}
                </span>
              )}
              {post.created_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold tracking-[-0.03em] leading-[1.1] text-fade mb-6">
              {post.title}
            </h1>

            {post.summary && (
              <p className="text-lg text-white/60 leading-relaxed border-l-2 border-white/20 pl-5 mb-10">
                {post.summary}
              </p>
            )}
          </FadeIn>

          {post.image_url && (
            <FadeIn direction="up" delay={0.1}>
              <div className="aspect-[16/9] rounded-2xl overflow-hidden glass mb-10">
                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
              </div>
            </FadeIn>
          )}

          <FadeIn direction="up" delay={0.15}>
            <div className="prose-custom space-y-4">
              {renderContent(post.content || "")}
            </div>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <div className="mt-16 pt-8 border-t border-white/10 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white/50">Written by</p>
                  <p className="font-semibold">{post.author || "Synapex Team"}</p>
                </div>
                <Link to="/blog" className="inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm hover:bg-white/10 transition-colors">
                  <ArrowLeft className="h-4 w-4" /> More articles
                </Link>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
                <ShareButtons title={post.title} />
              </div>
            </div>
          </FadeIn>
        </div>
      </motion.div>
    </SiteLayout>
  );
}

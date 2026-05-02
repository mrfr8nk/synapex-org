import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FadeIn } from "@/components/FadeIn";
import { useEvents } from "@/lib/useContent";
import { Calendar, Zap, Megaphone, Trophy, ArrowUpRight, Newspaper } from "lucide-react";

const TYPE_CONFIG: Record<string, { label: string; Icon: any; color: string; dot: string }> = {
  update: { label: "Update", Icon: Zap, color: "text-blue-400 bg-blue-500/10 border-blue-500/20", dot: "bg-blue-400" },
  event: { label: "Event", Icon: Calendar, color: "text-violet-400 bg-violet-500/10 border-violet-500/20", dot: "bg-violet-400" },
  news: { label: "News", Icon: Newspaper, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-400" },
  announcement: { label: "Announcement", Icon: Megaphone, color: "text-amber-400 bg-amber-500/10 border-amber-500/20", dot: "bg-amber-400" },
  achievement: { label: "Achievement", Icon: Trophy, color: "text-orange-400 bg-orange-500/10 border-orange-500/20", dot: "bg-orange-400" },
};

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 2) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function Events() {
  const events = useEvents();

  if (events.length === 0) return null;

  return (
    <section className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-12">
          <FadeIn direction="left">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full glass border border-white/15 px-3.5 py-1 text-[11px] uppercase tracking-[0.15em] text-white/50 mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live updates
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-fade">
                What's happening.
              </h2>
              <p className="mt-2 text-white/45 text-sm max-w-md leading-relaxed">
                Real-time updates, events, and news from the Synapex network.
              </p>
            </div>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.slice(0, 6).map((ev: any, i: number) => {
            const cfg = TYPE_CONFIG[ev.type] || TYPE_CONFIG.update;
            const { Icon } = cfg;
            return (
              <FadeIn key={ev.id} direction="up" delay={i * 0.06}>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.25 }}
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-5 flex flex-col gap-3 h-full relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  {ev.image_url && (
                    <div className="aspect-[16/7] rounded-xl overflow-hidden">
                      <img
                        src={ev.image_url}
                        alt={ev.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${cfg.color}`}>
                      <Icon className="h-3 w-3" />
                      {cfg.label}
                    </span>
                    <span className="text-[11px] text-white/30">{timeAgo(ev.event_date || ev.created_at)}</span>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-sm leading-snug group-hover:text-white transition-colors">
                      {ev.title}
                    </h3>
                    {ev.summary && (
                      <p className="mt-1.5 text-xs text-white/50 leading-relaxed line-clamp-3">
                        {ev.summary}
                      </p>
                    )}
                  </div>

                  {ev.link_url && (
                    <a
                      href={ev.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors mt-1"
                    >
                      Read more <ArrowUpRight className="h-3 w-3" />
                    </a>
                  )}
                </motion.div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

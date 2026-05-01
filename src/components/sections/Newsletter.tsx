import { useState } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/FadeIn";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
    setEmail("");
  }

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute inset-0 spotlight opacity-40" />
      <div className="relative max-w-2xl mx-auto text-center">
        <FadeIn direction="up">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-white/40 mb-4">
            <span className="h-px w-6 bg-white/30" />
            Newsletter
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-fade">
            Stay in the loop.
          </h2>
          <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-md mx-auto">
            Monthly drops: engineering deep-dives, product case studies and our honest takes on what's happening in tech.
          </p>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 inline-flex items-center gap-3 rounded-full glass px-6 py-3 text-sm"
            >
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              You're subscribed! Watch your inbox.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 rounded-full bg-white/5 border border-white/10 px-5 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
                required
              />
              <motion.button
                type="submit"
                disabled={status === "loading"}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-60"
              >
                {status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>Subscribe <ArrowRight className="h-4 w-4" /></>
                )}
              </motion.button>
            </form>
          )}
          <p className="mt-4 text-[11px] text-white/30">No spam, ever. Unsubscribe anytime.</p>
        </FadeIn>
      </div>
    </section>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Sponsors } from "@/components/sections/Sponsors";
import { CTA } from "@/components/sections/CTA";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/FadeIn";
import { ArrowRight, CheckCircle, Loader2, Heart } from "lucide-react";

export const Route = createFileRoute("/sponsors")({
  component: SponsorsPage,
});

function SponsorsPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", amount: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  function update(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStatus("loading");
    setErrMsg("");
    try {
      const { error } = await supabase.from("sponsor_applications" as any).insert({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        company: form.company.trim() || null,
        amount: form.amount.trim() || null,
        message: form.message.trim() || null,
        read: false,
      });
      if (error) throw error;
      setStatus("success");
      setForm({ name: "", email: "", company: "", amount: "", message: "" });
    } catch (e: any) {
      setErrMsg(e?.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <SiteLayout>
      <div className="pt-20">
        <Sponsors />

        {/* Sponsor Application Form */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
          <div className="relative max-w-2xl mx-auto">
            <FadeIn direction="up">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-4 py-1.5 text-xs text-amber-400/80 mb-6">
                  <Heart className="h-3 w-3 fill-amber-400/60" />
                  Become a sponsor
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-fade">
                  Ready to partner with us?
                </h2>
                <p className="mt-4 text-sm text-white/50 leading-relaxed max-w-lg mx-auto">
                  Fill in your details below and we'll get back to you within 24 hours with a custom partnership proposal.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-12 text-center"
                  >
                    <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Application received!</h3>
                    <p className="mt-2 text-sm text-white/50">
                      Thanks for reaching out. We'll review your application and get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      Submit another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 space-y-5"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] uppercase tracking-wider text-white/40">Full name *</label>
                        <input
                          value={form.name}
                          onChange={update("name")}
                          required
                          placeholder="Your name"
                          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm focus:border-white/30 outline-none transition-colors placeholder:text-white/20"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] uppercase tracking-wider text-white/40">Email address *</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={update("email")}
                          required
                          placeholder="you@company.com"
                          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm focus:border-white/30 outline-none transition-colors placeholder:text-white/20"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] uppercase tracking-wider text-white/40">Company / Organisation</label>
                        <input
                          value={form.company}
                          onChange={update("company")}
                          placeholder="Acme Corp"
                          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm focus:border-white/30 outline-none transition-colors placeholder:text-white/20"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] uppercase tracking-wider text-white/40">Sponsorship budget</label>
                        <select
                          value={form.amount}
                          onChange={update("amount")}
                          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm focus:border-white/30 outline-none transition-colors text-white/70"
                        >
                          <option value="">Select a tier</option>
                          <option value="$50/month (Community)">$50/month — Community</option>
                          <option value="$200/month (Growth)">$200/month — Growth</option>
                          <option value="$1,000/month (Enterprise)">$1,000/month — Enterprise</option>
                          <option value="Custom">Custom amount</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] uppercase tracking-wider text-white/40">Tell us about your goals</label>
                      <textarea
                        value={form.message}
                        onChange={update("message")}
                        rows={4}
                        placeholder="What are you hoping to achieve through this sponsorship? Any specific asks or requirements?"
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm focus:border-white/30 outline-none transition-colors resize-none placeholder:text-white/20 leading-relaxed"
                      />
                    </div>

                    {status === "error" && (
                      <p className="text-xs text-red-400">{errMsg}</p>
                    )}

                    <div className="pt-2">
                      <motion.button
                        type="submit"
                        disabled={status === "loading"}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-black py-3.5 text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-60"
                      >
                        {status === "loading" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>Send application <ArrowRight className="h-4 w-4" /></>
                        )}
                      </motion.button>
                      <p className="mt-3 text-center text-[11px] text-white/25">We respond to all applications within 24 hours.</p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </FadeIn>
          </div>
        </section>

        <CTA />
      </div>
    </SiteLayout>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, MapPin, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { useSiteContent } from "@/lib/useContent";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(10, "Tell us a bit more").max(1000),
});

function ContactPage() {
  const c = useSiteContent();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.from("contact_messages").insert(r.data);
    setSubmitting(false);
    if (error) {
      setErrors({ message: "Something went wrong. Try again." });
      return;
    }
    setSent(true);
  };

  return (
    <SiteLayout>
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 stars" />
        <div className="absolute inset-0 spotlight" />
        <div className="relative max-w-6xl mx-auto grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1 text-[11px] uppercase tracking-[0.2em] text-white/60 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-glow-pulse" /> Contact
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-[-0.04em] leading-[0.95] text-fade">
              Let's build something great.
            </h1>
            <p className="mt-6 text-lg text-white/60 leading-relaxed">
              Tell us about your idea, timeline and budget. We'll come back within 24 hours with a clear plan.
            </p>

            <div className="mt-10 space-y-3">
              {[
                { icon: Mail, label: c.contact_email },
                { icon: MessageCircle, label: c.contact_whatsapp },
                { icon: MapPin, label: c.contact_location },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-4 rounded-2xl glass p-4 hairline-hover transition-all"
                >
                  <div className="h-9 w-9 rounded-xl glass-strong flex items-center justify-center">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-white/80">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            onSubmit={submit}
            className="rounded-3xl glass-strong p-8 space-y-5"
          >
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-12"
              >
                <CheckCircle2 className="h-16 w-16" />
                <h3 className="mt-4 text-2xl font-semibold tracking-tight">Message sent.</h3>
                <p className="mt-2 text-white/50">We'll be in touch within 24 hours.</p>
              </motion.div>
            ) : (
              <>
                <Field label="Your name" error={errors.name}>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    maxLength={100}
                    className="w-full bg-transparent border-b border-white/15 py-3 outline-none focus:border-white transition-colors text-white placeholder:text-white/30"
                    placeholder="Jane Doe"
                  />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    maxLength={255}
                    className="w-full bg-transparent border-b border-white/15 py-3 outline-none focus:border-white transition-colors text-white placeholder:text-white/30"
                    placeholder="jane@company.com"
                  />
                </Field>
                <Field label="Project details" error={errors.message}>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    maxLength={1000}
                    rows={5}
                    className="w-full bg-transparent border-b border-white/15 py-3 outline-none focus:border-white transition-colors resize-none text-white placeholder:text-white/30"
                    placeholder="Tell us what you'd like to build..."
                  />
                </Field>
                <button
                  type="submit"
                  disabled={submitting}
                  className="group w-full inline-flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-medium bg-white text-black hover:bg-white/90 transition-all disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send message"}
                  <Send className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            )}
          </motion.form>
        </div>
      </section>
    </SiteLayout>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] uppercase tracking-[0.2em] text-white/40">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

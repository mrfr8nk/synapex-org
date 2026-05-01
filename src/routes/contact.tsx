import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, MapPin, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Synapex Developers" },
      { name: "description", content: "Tell us about your project. We reply within 24 hours." },
      { property: "og:title", content: "Contact Synapex" },
      { property: "og:description", content: "Start a project with Synapex Developers." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(10, "Tell us a bit more").max(1000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => { errs[i.path[0] as string] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setSent(true);
  };

  return (
    <SiteLayout>
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="relative max-w-6xl mx-auto grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">
              Let's build <span className="text-gradient">something great.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Tell us about your idea, timeline and budget. We'll come back within 24 hours
              with a clear plan.
            </p>

            <div className="mt-10 space-y-4">
              {[
                { icon: Mail, label: "hello@synapex.dev" },
                { icon: MessageCircle, label: "WhatsApp: +263 78 000 0000" },
                { icon: MapPin, label: "Harare, Zimbabwe — serving worldwide" },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl glass p-4">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-purple flex items-center justify-center">
                    <c.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm">{c.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={submit}
            className="rounded-3xl glass p-8 space-y-5"
          >
            {sent ? (
              <div className="flex flex-col items-center text-center py-12">
                <CheckCircle2 className="h-16 w-16 text-cyan" />
                <h3 className="mt-4 text-2xl font-semibold">Message sent!</h3>
                <p className="mt-2 text-muted-foreground">We'll be in touch within 24 hours.</p>
              </div>
            ) : (
              <>
                <Field label="Your name" error={errors.name}>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    maxLength={100}
                    className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-cyan transition-colors"
                    placeholder="Jane Doe"
                  />
                </Field>
                <Field label="Email" error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    maxLength={255}
                    className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-cyan transition-colors"
                    placeholder="jane@company.com"
                  />
                </Field>
                <Field label="Project details" error={errors.message}>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    maxLength={1000}
                    rows={5}
                    className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-cyan transition-colors resize-none"
                    placeholder="Tell us what you'd like to build..."
                  />
                </Field>
                <button
                  type="submit"
                  className="group w-full inline-flex items-center justify-center gap-2 rounded-xl py-4 text-sm font-medium text-white bg-gradient-to-r from-primary via-accent to-purple animate-gradient shadow-glow hover:shadow-glow-strong transition-shadow"
                >
                  Send message
                  <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
      <label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

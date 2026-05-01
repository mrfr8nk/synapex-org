import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { SectionHeader } from "@/components/sections/Services";
import { FadeIn } from "@/components/FadeIn";
import { CTA } from "@/components/sections/CTA";
import { fallbackFaq } from "@/lib/content";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Synapex Developers" },
      { name: "description", content: "Common questions about working with Synapex — pricing, timelines, ownership and more." },
    ],
  }),
  component: FaqPage,
});

function FaqItem({ item, isOpen, onToggle }: { item: any; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="rounded-2xl glass overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-white/[0.03] transition-colors"
      >
        <span className="text-base font-medium tracking-tight pr-4">{item.question}</span>
        <div className="h-8 w-8 rounded-full glass flex items-center justify-center shrink-0 transition-transform duration-300">
          {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-sm text-white/60 leading-relaxed border-t border-white/8 pt-4">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FaqPage() {
  const [openId, setOpenId] = useState<string | null>("q1");

  return (
    <SiteLayout>
      <section className="relative pt-32 pb-12 px-6 overflow-hidden">
        <div className="absolute inset-0 stars opacity-40" />
        <div className="absolute inset-0 spotlight" />
        <div className="relative max-w-7xl mx-auto">
          <FadeIn direction="up">
            <SectionHeader
              eyebrow="FAQ"
              title="Questions answered."
              subtitle="Everything you want to know about working with Synapex before you reach out."
            />
          </FadeIn>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-3">
            {fallbackFaq.map((item, i) => (
              <FadeIn key={item.id} direction="up" delay={i * 0.05}>
                <FaqItem
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                />
              </FadeIn>
            ))}
          </div>

          <FadeIn direction="up" delay={0.3} className="mt-14 text-center rounded-3xl glass p-10">
            <p className="text-lg font-medium tracking-tight">Still have questions?</p>
            <p className="mt-2 text-sm text-white/50">We're a message away. No sales scripts, just real answers.</p>
            <a
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Talk to us →
            </a>
          </FadeIn>
        </div>
      </section>
      <CTA />
    </SiteLayout>
  );
}

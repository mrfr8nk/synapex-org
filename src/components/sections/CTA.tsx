import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="relative py-32 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl glass-strong p-12 md:p-20 text-center"
      >
        <div className="absolute inset-0 stars opacity-40" />
        <div className="absolute inset-0 spotlight" />
        <div className="relative">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1] text-fade">
            Have an idea?<br />Let's build it.
          </h2>
          <p className="mt-6 text-white/50 max-w-xl mx-auto text-base">
            Tell us about your project. We'll come back within 24 hours with a clear plan.
          </p>
          <Link
            to="/contact"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-white text-black px-7 py-3.5 text-sm font-medium hover:bg-white/90 transition-all hover:scale-[1.02] group"
          >
            Start a project
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

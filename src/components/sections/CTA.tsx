import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl glass p-12 md:p-20 text-center">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[600px] rounded-full bg-primary/40 blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-purple/30 blur-3xl" />
        <div className="relative">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            Have an idea? <br />
            <span className="text-gradient">Let's build it.</span>
          </h2>
          <p className="mt-6 text-muted-foreground max-w-xl mx-auto">
            Tell us about your project and we'll come back within 24 hours with a plan.
          </p>
          <Link
            to="/contact"
            className="mt-10 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-medium text-white bg-gradient-to-r from-primary via-accent to-purple animate-gradient shadow-glow hover:shadow-glow-strong transition-shadow"
          >
            Start a Project
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

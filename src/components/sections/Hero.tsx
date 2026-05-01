import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-purple/30 blur-3xl animate-float-slow [animation-delay:2s]" />
      <div className="absolute top-10 right-1/3 h-40 w-40 rounded-full bg-cyan/30 blur-2xl animate-pulse-glow" />

      <div className="relative max-w-7xl mx-auto px-6 py-24 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-cyan" />
            <span className="text-muted-foreground">African innovation,</span>
            <span className="text-gradient font-medium">global standards</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.05]"
        >
          We Build <span className="text-gradient animate-gradient">Powerful</span>
          <br />
          Digital Experiences
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-8 text-center text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          Synapex Developers crafts modern websites, mobile apps, AI systems and software
          solutions for businesses, startups, schools and creators.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/contact"
            className="group relative inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-medium text-white overflow-hidden shadow-glow hover:shadow-glow-strong transition-shadow"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-purple animate-gradient" />
            <span className="relative">Start a Project</span>
            <ArrowRight className="relative h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-medium glass hover:bg-white/10 transition-colors"
          >
            <Play className="h-4 w-4" />
            View Our Work
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {[
            { v: "120+", l: "Projects Delivered" },
            { v: "80+", l: "Happy Clients" },
            { v: "25+", l: "Technologies" },
            { v: "12", l: "Team Members" },
          ].map((s, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-5 text-center hover:shadow-glow transition-shadow"
            >
              <div className="text-3xl md:text-4xl font-bold text-gradient">{s.v}</div>
              <div className="mt-1 text-xs text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="h-10 w-6 rounded-full border-2 border-white/20 flex justify-center pt-2">
          <div className="h-2 w-1 rounded-full bg-white/60 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

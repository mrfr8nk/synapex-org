import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [path]);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`w-full max-w-6xl rounded-2xl transition-all duration-500 ${
          scrolled ? "glass shadow-glow" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-3">
          <Link to="/" className="group flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-purple blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative h-9 w-9 rounded-lg bg-gradient-to-br from-primary via-accent to-purple flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="font-bold text-lg tracking-tight">
              Synapex<span className="text-gradient">.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const active = path === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className="relative px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-white/5 border border-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:block">
            <Link
              to="/contact"
              className="relative inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-white overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-purple animate-gradient" />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-purple via-primary to-accent" />
              <span className="relative">Start a Project</span>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-white/10"
            >
              <div className="flex flex-col p-4 gap-1">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="px-4 py-3 rounded-lg text-sm hover:bg-white/5 transition-colors"
                    activeProps={{ className: "px-4 py-3 rounded-lg text-sm bg-white/5 text-foreground" }}
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  to="/contact"
                  className="mt-2 text-center rounded-xl px-5 py-3 text-sm font-medium text-white bg-gradient-to-r from-primary via-accent to-purple animate-gradient"
                >
                  Start a Project
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}

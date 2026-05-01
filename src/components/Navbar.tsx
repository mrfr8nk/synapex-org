import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Work" },
  { to: "/team", label: "Team" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [path]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="px-4">
        <nav className="mx-auto max-w-7xl rounded-full transition-all duration-500 glass-nav">
          <div className="flex items-center justify-between px-5 py-2.5">
            <Link to="/" className="flex items-center gap-2 group">
              <img
                src="/synapex-logo.png"
                alt="Synapex"
                className="h-8 w-8 object-contain"
              />
              <span className="font-semibold text-sm tracking-tight">SYNAPEX</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {links.map((l) => {
                const active = path === l.to;
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="relative px-3.5 py-1.5 text-[13px] text-white/60 hover:text-white transition-colors"
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-full bg-white/10 hairline"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
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
                className="inline-flex items-center rounded-full bg-white text-black px-4 py-1.5 text-[13px] font-medium hover:bg-white/90 transition-colors"
              >
                Get started
              </Link>
            </div>

            <button
              className="md:hidden p-1 text-white"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="md:hidden overflow-hidden"
              >
                <div className="border-t border-white/10 px-2 py-3 flex flex-col gap-0.5">
                  {links.map((l, i) => (
                    <motion.div
                      key={l.to}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        to={l.to}
                        className="block px-4 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                        activeProps={{ className: "block px-4 py-2.5 rounded-xl text-sm bg-white/10 text-white" }}
                      >
                        {l.label}
                      </Link>
                    </motion.div>
                  ))}
                  <Link
                    to="/contact"
                    className="mt-2 mx-2 text-center rounded-full bg-white text-black px-4 py-2.5 text-sm font-medium"
                  >
                    Get started
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </motion.header>
  );
}

import { Link } from "@tanstack/react-router";
import { Github, Twitter, Linkedin, Instagram, ArrowUpRight } from "lucide-react";

const cols = [
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/team", label: "Team" },
      { to: "/projects", label: "Work" },
      { to: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Services",
    links: [
      { to: "/services", label: "Web Development" },
      { to: "/services", label: "Mobile Apps" },
      { to: "/services", label: "AI Integration" },
      { to: "/services", label: "SaaS Platforms" },
    ],
  },
  {
    title: "Connect",
    links: [
      { to: "/contact", label: "Start a project" },
      { to: "/contact", label: "hello@synapex.dev" },
      { to: "/admin", label: "Admin" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/10">
      <div className="absolute inset-0 stars opacity-20 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                <span className="text-black text-xs font-bold">SX</span>
              </div>
              <span className="font-semibold tracking-tight">SYNAPEX DEVELOPERS</span>
            </Link>
            <p className="mt-5 text-sm text-white/50 max-w-sm leading-relaxed">
              Engineering premium software, AI systems and digital experiences for ambitious teams worldwide.
            </p>
            <div className="mt-6 flex gap-2">
              {[Github, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 rounded-full glass hairline-hover flex items-center justify-center transition-all hover:-translate-y-0.5"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">{col.title}</h4>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l, i) => (
                  <li key={i}>
                    <Link to={l.to} className="text-white/70 hover:text-white transition-colors story-link">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Synapex Developers. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built in Harare <ArrowUpRight className="h-3 w-3" /> for the world
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "@tanstack/react-router";
import { Github, Twitter, Linkedin, Instagram, Facebook, Youtube, ArrowUpRight } from "lucide-react";
import { useSiteContent } from "@/lib/useContent";

const cols = [
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/team", label: "Team" },
      { to: "/careers", label: "Careers" },
      { to: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Work",
    links: [
      { to: "/services", label: "Services" },
      { to: "/projects", label: "Portfolio" },
      { to: "/pricing", label: "Pricing" },
      { to: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Connect",
    links: [
      { to: "/contact", label: "Start a project" },
      { to: "/contact", label: "hello@synapex.dev" },
      { to: "/admin", label: "Admin portal" },
    ],
  },
];

const SOCIAL_MAP = [
  { key: "social_github", Icon: Github, label: "GitHub" },
  { key: "social_twitter", Icon: Twitter, label: "Twitter" },
  { key: "social_linkedin", Icon: Linkedin, label: "LinkedIn" },
  { key: "social_instagram", Icon: Instagram, label: "Instagram" },
  { key: "social_facebook", Icon: Facebook, label: "Facebook" },
  { key: "social_youtube", Icon: Youtube, label: "YouTube" },
];

export function Footer() {
  const c = useSiteContent();
  const socials = SOCIAL_MAP.filter(({ key }) => !!c[key]);

  return (
    <footer className="relative mt-24 border-t border-white/10">
      <div className="absolute inset-0 stars opacity-20 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <img src="/synapex-logo.png" alt="Synapex" className="h-9 w-9 object-contain" />
              <span className="font-semibold tracking-tight">SYNAPEX DEVELOPERS</span>
            </Link>
            <p className="mt-5 text-sm text-white/50 max-w-sm leading-relaxed">
              {c.footer_tagline}
            </p>
            <p className="mt-3 text-xs text-white/30">
              Harare, Zimbabwe &middot; Remote-first
            </p>
            <div className="mt-6 flex gap-2 flex-wrap">
              {socials.map(({ Icon, key, label }) => (
                <a
                  key={key}
                  href={c[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
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
                    <Link to={l.to as any} className="text-white/70 hover:text-white transition-colors story-link">
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

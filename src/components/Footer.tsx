import { Link } from "@tanstack/react-router";
import { Github, Twitter, Linkedin, Instagram, Facebook, Youtube, ArrowUpRight, Globe, Heart } from "lucide-react";
import { useSiteContent } from "@/lib/useContent";

const COMPANY_LINKS = [
  { to: "/about", label: "About us" },
  { to: "/team", label: "Our team" },
  { to: "/careers", label: "Careers" },
  { to: "/faq", label: "FAQ" },
  { to: "/blog", label: "Blog" },
];

const WORK_LINKS = [
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Portfolio" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Start a project" },
  { to: "/sponsors", label: "Sponsor us" },
];

const COMMUNITY_LINKS = [
  { to: "/join", label: "Join as developer" },
  { to: "/dashboard", label: "Developer dashboard" },
  { to: "/careers", label: "Open positions" },
  { to: "/contact", label: "Partner with us" },
];

const LEGAL_LINKS = [
  { href: "https://github.com/synapex-dev", label: "GitHub" },
  { to: "/contact", label: "Privacy policy" },
  { to: "/contact", label: "Terms of use" },
  { href: "https://github.com/synapex-dev/LICENSE", label: "MIT License" },
];

const SOCIAL_MAP = [
  { key: "social_github", Icon: Github, label: "GitHub" },
  { key: "social_twitter", Icon: Twitter, label: "Twitter" },
  { key: "social_linkedin", Icon: Linkedin, label: "LinkedIn" },
  { key: "social_instagram", Icon: Instagram, label: "Instagram" },
  { key: "social_facebook", Icon: Facebook, label: "Facebook" },
  { key: "social_youtube", Icon: Youtube, label: "YouTube" },
];

const PAYMENT_METHODS = [
  { label: "Stripe", bg: "from-violet-600/20 to-indigo-600/20", border: "border-violet-500/20" },
  { label: "PayPal", bg: "from-blue-600/20 to-cyan-600/20", border: "border-blue-500/20" },
  { label: "EcoCash", bg: "from-green-600/20 to-emerald-600/20", border: "border-green-500/20" },
  { label: "Omari", bg: "from-orange-600/20 to-amber-600/20", border: "border-orange-500/20" },
  { label: "Bank Transfer", bg: "from-white/10 to-white/5", border: "border-white/15" },
];

export function Footer() {
  const c = useSiteContent();
  const socials = SOCIAL_MAP.filter(({ key }) => !!c[key]);
  const email = c.contact_email || "hello@synapex.dev";

  return (
    <footer className="relative mt-24 border-t border-white/10">
      <div className="absolute inset-0 stars opacity-15 pointer-events-none" />

      {/* Newsletter / CTA strip */}
      <div className="relative border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-white/80">Stay ahead of the curve.</p>
            <p className="text-xs text-white/40 mt-0.5">New projects, insights and open positions — straight to your inbox.</p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full max-w-sm gap-2"
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm focus:border-white/30 outline-none transition-colors placeholder:text-white/25"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-white text-black px-5 py-2.5 text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Main grid */}
        <div className="grid gap-10 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img src="/synapex-logo.png" alt="Synapex" className="h-9 w-9 object-contain" />
              <span className="font-semibold tracking-tight text-sm group-hover:text-white/80 transition-colors">SYNAPEX DEVELOPERS</span>
            </Link>
            <p className="mt-5 text-sm text-white/50 max-w-xs leading-relaxed">
              {c.footer_tagline || "Building premium software, AI systems and digital experiences for ambitious teams worldwide."}
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-white/30">
              <Globe className="h-3 w-3" />
              <span>Global · Remote-first · Open to teens 13+</span>
            </div>
            <a
              href={`mailto:${email}`}
              className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white transition-colors"
            >
              <ArrowUpRight className="h-3 w-3" />
              {email}
            </a>
            <div className="mt-5 flex gap-2 flex-wrap">
              {socials.map(({ Icon, key, label }) => (
                <a
                  key={key}
                  href={c[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="h-9 w-9 rounded-full glass border border-white/10 flex items-center justify-center transition-all hover:-translate-y-0.5 hover:border-white/25"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to as any} className="text-white/55 hover:text-white transition-colors story-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Work */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-4">Work</h4>
            <ul className="space-y-2.5 text-sm">
              {WORK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to as any} className="text-white/55 hover:text-white transition-colors story-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-4">Community</h4>
            <ul className="space-y-2.5 text-sm">
              {COMMUNITY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to as any} className="text-white/55 hover:text-white transition-colors story-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              {LEGAL_LINKS.map((l) =>
                "href" in l ? (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-white/55 hover:text-white transition-colors story-link">
                      {l.label}
                    </a>
                  </li>
                ) : (
                  <li key={l.label}>
                    <Link to={(l as any).to as any} className="text-white/55 hover:text-white transition-colors story-link">
                      {l.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-14 pt-8 border-t border-white/8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4">Accepted payment methods</p>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map(({ label, bg, border }) => (
              <div
                key={label}
                className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${bg} border ${border} px-3.5 py-1.5 text-[11px] font-medium text-white/60`}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/8 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/30">
          <div className="flex flex-wrap gap-x-4 gap-y-1 items-center">
            <p>© {new Date().getFullYear()} Synapex Developers. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Licensed under <span className="text-white/50 ml-1">MIT</span>
            </p>
          </div>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-400/70 fill-red-400/70" /> for the world
          </p>
        </div>
      </div>
    </footer>
  );
}
